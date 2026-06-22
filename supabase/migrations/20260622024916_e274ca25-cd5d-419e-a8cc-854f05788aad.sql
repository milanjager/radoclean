CREATE OR REPLACE FUNCTION public.insert_reservation_secure(
  p_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_postal_code text,
  p_package_size text,
  p_category text,
  p_frequency text,
  p_urgent text,
  p_has_supplies boolean,
  p_window_count text,
  p_extras_ids text[],
  p_preferred_date date,
  p_preferred_time text,
  p_notes text,
  p_referral_code text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_base numeric;
  v_extras_price numeric := 0;
  v_total numeric;
  v_multiplier numeric;
  v_freq_discount numeric := 0;
  v_urgent_mult numeric := 1;
  v_window_price numeric := 0;
  v_supplies_discount numeric := 0;
  v_referral record;
  v_extra_id text;
  v_extra_price numeric;
  v_extras_jsonb jsonb := '[]'::jsonb;
  v_package_label text;
  v_category_label text;
  v_frequency_label text;
  new_id uuid;
BEGIN
  v_base := CASE p_package_size
    WHEN 'small'  THEN 1890
    WHEN 'medium' THEN 2890
    WHEN 'large'  THEN 4990
    ELSE NULL
  END;
  IF v_base IS NULL THEN RAISE EXCEPTION 'Invalid package_size: %', p_package_size; END IF;

  v_package_label := CASE p_package_size
    WHEN 'small'  THEN 'Malý byt (1+kk, 2+kk)'
    WHEN 'medium' THEN 'Střední byt (3+kk, 4+kk)'
    WHEN 'large'  THEN 'Rodinný dům / Generální'
  END;

  v_multiplier := CASE p_category
    WHEN 'standard'           THEN 1
    WHEN 'general'            THEN 1.5
    WHEN 'post-construction'  THEN 2
    WHEN 'post-moving'        THEN 1.7
    WHEN 'regular'            THEN 0.85
    ELSE NULL
  END;
  IF v_multiplier IS NULL THEN RAISE EXCEPTION 'Invalid category: %', p_category; END IF;

  v_category_label := CASE p_category
    WHEN 'standard'           THEN 'Běžný úklid'
    WHEN 'general'            THEN 'Generální úklid'
    WHEN 'post-construction'  THEN 'Úklid po rekonstrukci'
    WHEN 'post-moving'        THEN 'Úklid po stěhování'
    WHEN 'regular'            THEN 'Pravidelný úklid'
  END;

  v_base := v_base * v_multiplier;

  IF p_category = 'regular' AND p_frequency IS NOT NULL THEN
    v_freq_discount := CASE p_frequency
      WHEN 'twice-weekly' THEN 0.20
      WHEN 'weekly'       THEN 0.15
      WHEN 'biweekly'     THEN 0.10
      WHEN 'monthly'      THEN 0.05
      ELSE 0
    END;
    v_base := v_base * (1 - v_freq_discount);
    v_frequency_label := CASE p_frequency
      WHEN 'twice-weekly' THEN '2x týdně'
      WHEN 'weekly'       THEN '1x týdně'
      WHEN 'biweekly'     THEN '1x za 14 dní'
      WHEN 'monthly'      THEN '1x měsíčně'
      ELSE NULL
    END;
  END IF;

  IF p_urgent IS NOT NULL THEN
    v_urgent_mult := CASE p_urgent
      WHEN 'urgent-24h' THEN 1.30
      WHEN 'weekend'    THEN 1.20
      WHEN 'evening'    THEN 1.15
      ELSE 1
    END;
    v_base := v_base * v_urgent_mult;
  END IF;

  IF p_has_supplies THEN v_supplies_discount := 200; END IF;

  IF p_window_count IS NOT NULL THEN
    v_window_price := CASE p_window_count
      WHEN '1-3'  THEN 200
      WHEN '4-6'  THEN 350
      WHEN '7-10' THEN 500
      WHEN '11+'  THEN 700
      ELSE 0
    END;
    v_extras_price := v_extras_price + v_window_price;
    v_extras_jsonb := v_extras_jsonb || jsonb_build_array(
      jsonb_build_object('id','windows-'||p_window_count,'label','Mytí oken ('||p_window_count||')','price',v_window_price)
    );
  END IF;

  IF p_extras_ids IS NOT NULL THEN
    FOREACH v_extra_id IN ARRAY p_extras_ids LOOP
      v_extra_price := CASE v_extra_id
        WHEN 'dog'                THEN 200
        WHEN 'dishes'             THEN 150
        WHEN 'trash'              THEN 50
        WHEN 'plants'             THEN 50
        WHEN 'ironing'            THEN 300
        WHEN 'garden'             THEN 600
        WHEN 'carpet-cleaning'    THEN 500
        WHEN 'oven-cleaning'      THEN 350
        WHEN 'fridge-cleaning'    THEN 250
        WHEN 'balcony-terrace'    THEN 450
        WHEN 'laundry'            THEN 400
        WHEN 'organizing'         THEN 550
        WHEN 'basement-garage'    THEN 300
        WHEN 'wallpaper-cleaning' THEN 400
        WHEN 'walls-cleaning'     THEN 600
        ELSE NULL
      END;
      IF v_extra_price IS NULL THEN RAISE EXCEPTION 'Invalid extra: %', v_extra_id; END IF;
      v_extras_price := v_extras_price + v_extra_price;
      v_extras_jsonb := v_extras_jsonb || jsonb_build_array(
        jsonb_build_object('id', v_extra_id, 'price', v_extra_price)
      );
    END LOOP;
  END IF;

  v_total := round(v_base + v_extras_price - v_supplies_discount);

  IF p_referral_code IS NOT NULL AND length(p_referral_code) > 0 THEN
    SELECT * INTO v_referral FROM public.referral_codes WHERE code = p_referral_code LIMIT 1;
    IF FOUND AND v_referral.discount_activated THEN
      v_total := round(v_total * 0.85);
    END IF;
  END IF;

  INSERT INTO public.reservations (
    name, email, phone, address, city, postal_code,
    package_type, extras, base_price, extras_price, total_price,
    preferred_date, preferred_time, notes, referral_code
  ) VALUES (
    p_name, p_email, p_phone, p_address, p_city, p_postal_code,
    v_category_label || ' - ' || v_package_label || COALESCE(' (' || v_frequency_label || ')', ''),
    v_extras_jsonb,
    round(v_base)::int,
    round(v_extras_price - v_supplies_discount)::int,
    v_total::int,
    p_preferred_date, p_preferred_time, p_notes, p_referral_code
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_reservation_secure(
  text, text, text, text, text, text, text, text, text, text,
  boolean, text, text[], date, text, text, text
) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.insert_reservation(
  text, text, text, text, text, text, text, jsonb,
  integer, integer, integer, date, text, text, text
) FROM anon, authenticated;
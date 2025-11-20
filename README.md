# Super Úklid Radotín

Moderní webová aplikace pro úklidovou službu v Radotíně a okolí.

## 🚀 Technologie

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI komponenty
- **Supabase** - Backend (databáze, autentizace)
- **React Router** - Routing
- **React Hook Form** + **Zod** - Formuláře a validace
- **Vitest** + **React Testing Library** - Testování

## 📦 Instalace

```bash
npm install
```

## 🧪 Testování

### Spuštění testů
```bash
npm run test
```

### Spuštění testů s UI
```bash
npm run test:ui
```

### Coverage report
```bash
npm run test:coverage
```

### Watch mode (pro vývoj)
```bash
npm run test:watch
```

## 🏃‍♂️ Vývoj

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

## 📁 Struktura projektu

```
src/
├── components/          # React komponenty
│   ├── __tests__/      # Testy komponent
│   ├── ui/             # UI komponenty (shadcn)
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility funkce
│   └── __tests__/      # Testy utilit
├── pages/              # Stránky aplikace
├── integrations/       # Integrace (Supabase)
└── setupTests.ts       # Test setup
```

## ✅ Testování

Projekt obsahuje automatické testy pro:

### Komponenty
- **ReservationForm** - Testování rezervačního formuláře
  - Validace povinných polí
  - Validace formátu emailu a telefonu
  - Správný výpočet ceny s extras
  - Aplikace referral slevy
  - Odeslání formuláře do databáze

- **NeighborhoodDiscount** - Testování referral programu
  - Generování referral kódů
  - Validace emailu
  - Zobrazení statistik
  - Kalkulace slevy podle počtu referrals
  - Kopírování kódu do schránky

### Utility funkce
- **cn** - Testování className mergeru
  - Slučování className stringů
  - Řešení konfliktních Tailwind tříd
  - Podmíněné třídy

## 🎯 Hlavní funkce

- ✨ Responsive design
- 📱 Mobilní CTA tlačítka
- 📝 Rezervační formulář s validací
- 🎁 Referral program s automatickou slevou
- 📊 Admin dashboard
- 🔐 Autentizace
- 📧 Email notifikace

## 📝 Skripty

V `package.json` přidejte tyto skripty:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 🔧 Konfigurace testů

Testy jsou konfigurovány v `vitest.config.ts` s:
- **jsdom** environment pro DOM simulaci
- **@testing-library/jest-dom** pro DOM assertions
- Automatický cleanup po každém testu
- Mock pro Supabase client
- Mock pro window.matchMedia
- Coverage reporting

## 📞 Kontakt

Pro více informací navštivte naši webovou stránku nebo nás kontaktujte:
- 📱 +420 777 888 999
- 📧 info@superuklidradotin.cz

---

## Project info

**URL**: https://lovable.dev/projects/be86ce25-3df9-4bc7-bef2-cd00a7537aeb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be86ce25-3df9-4bc7-bef2-cd00a7537aeb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

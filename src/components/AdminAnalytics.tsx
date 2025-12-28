import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  Clock,
  MapPin,
  Globe,
  Search,
  Smartphone,
  Monitor,
  FileText,
  CheckCircle,
  XCircle,
  Zap
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { cs } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Reservation = {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  city: string;
  package_type: string;
};

type DateRange = "7days" | "30days" | "thisMonth" | "all";

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

// Simulated SEO/UX data (in production, this would come from Google Analytics API)
const seoMetrics = {
  pageViews: 12847,
  uniqueVisitors: 4523,
  avgSessionDuration: "2:34",
  bounceRate: 42.3,
  pagesPerSession: 3.2,
  mobileTraffic: 68,
  desktopTraffic: 32,
  organicTraffic: 45,
  directTraffic: 30,
  referralTraffic: 15,
  socialTraffic: 10,
};

const topPages = [
  { path: "/", title: "Domovská stránka", views: 5234, avgTime: "1:45", bounceRate: 35 },
  { path: "/#cenik", title: "Ceník", views: 2156, avgTime: "2:30", bounceRate: 28 },
  { path: "/#kontakt", title: "Kontakt", views: 1843, avgTime: "1:15", bounceRate: 45 },
  { path: "/#sluzby", title: "Služby", views: 1567, avgTime: "2:10", bounceRate: 32 },
  { path: "/#recenze", title: "Recenze", views: 1234, avgTime: "1:55", bounceRate: 38 },
];

const seoChecklist = [
  { name: "Meta title optimalizován", status: true, impact: "high" },
  { name: "Meta description", status: true, impact: "high" },
  { name: "Strukturovaná data (JSON-LD)", status: true, impact: "medium" },
  { name: "Open Graph tagy", status: true, impact: "medium" },
  { name: "Robots.txt", status: true, impact: "low" },
  { name: "Sitemap.xml", status: false, impact: "medium" },
  { name: "Kanonické URL", status: true, impact: "medium" },
  { name: "Mobilní optimalizace", status: true, impact: "high" },
  { name: "HTTPS", status: true, impact: "high" },
  { name: "Core Web Vitals", status: true, impact: "high" },
];

const AdminAnalytics = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [jobApplicationsCount, setJobApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30days");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsRes, inquiriesRes, chatsRes, jobsRes] = await Promise.all([
        supabase.from("reservations").select("id, created_at, total_price, status, city, package_type"),
        supabase.from("inquiries").select("id", { count: "exact" }),
        supabase.from("chat_conversations").select("id", { count: "exact" }),
        supabase.from("job_applications").select("id", { count: "exact" }),
      ]);

      setReservations(reservationsRes.data || []);
      setInquiriesCount(inquiriesRes.count || 0);
      setChatCount(chatsRes.count || 0);
      setJobApplicationsCount(jobsRes.count || 0);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "7days":
        return subDays(now, 7);
      case "30days":
        return subDays(now, 30);
      case "thisMonth":
        return startOfMonth(now);
      case "all":
        return new Date(0);
      default:
        return subDays(now, 30);
    }
  };

  const filteredReservations = useMemo(() => {
    const startDate = getDateRangeFilter();
    return reservations.filter(r => new Date(r.created_at) >= startDate);
  }, [reservations, dateRange]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = filteredReservations.length;
    const confirmed = filteredReservations.filter(r => r.status === "confirmed" || r.status === "completed").length;
    const revenue = filteredReservations
      .filter(r => r.status !== "cancelled")
      .reduce((sum, r) => sum + r.total_price, 0);
    const avgOrderValue = total > 0 ? Math.round(revenue / total) : 0;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    
    // Compare with previous period
    const previousStartDate = subDays(getDateRangeFilter(), dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 30);
    const previousReservations = reservations.filter(r => {
      const date = new Date(r.created_at);
      return date >= previousStartDate && date < getDateRangeFilter();
    });
    const previousRevenue = previousReservations
      .filter(r => r.status !== "cancelled")
      .reduce((sum, r) => sum + r.total_price, 0);
    
    const revenueChange = previousRevenue > 0 ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100) : 0;
    const ordersChange = previousReservations.length > 0 
      ? Math.round(((total - previousReservations.length) / previousReservations.length) * 100) 
      : 0;

    return { total, confirmed, revenue, avgOrderValue, conversionRate, revenueChange, ordersChange };
  }, [filteredReservations, reservations, dateRange]);

  // Chart data - reservations per day
  const chartData = useMemo(() => {
    const startDate = getDateRangeFilter();
    const endDate = new Date();
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const dayReservations = filteredReservations.filter(r => 
        isSameDay(new Date(r.created_at), day)
      );
      return {
        date: format(day, "d.M", { locale: cs }),
        rezervace: dayReservations.length,
        tržby: dayReservations.reduce((sum, r) => sum + r.total_price, 0),
      };
    });
  }, [filteredReservations, dateRange]);

  // City distribution
  const cityData = useMemo(() => {
    const cities: Record<string, number> = {};
    filteredReservations.forEach(r => {
      cities[r.city] = (cities[r.city] || 0) + 1;
    });
    return Object.entries(cities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredReservations]);

  // Package distribution
  const packageData = useMemo(() => {
    const packages: Record<string, number> = {};
    filteredReservations.forEach(r => {
      const pkg = r.package_type.split(" - ")[0] || r.package_type;
      packages[pkg] = (packages[pkg] || 0) + 1;
    });
    return Object.entries(packages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredReservations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with date filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Přehled & Analytika</h2>
          <p className="text-muted-foreground">Statistiky návštěvnosti, konverzí a SEO</p>
        </div>
        <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vyberte období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Posledních 7 dní</SelectItem>
            <SelectItem value="30days">Posledních 30 dní</SelectItem>
            <SelectItem value="thisMonth">Tento měsíc</SelectItem>
            <SelectItem value="all">Vše</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for different analytics sections */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="business">Obchod</TabsTrigger>
          <TabsTrigger value="traffic">Návštěvnost</TabsTrigger>
          <TabsTrigger value="seo">SEO & UX</TabsTrigger>
        </TabsList>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6 mt-6">
          {/* Main stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Celkové tržby</p>
                    <p className="text-2xl font-bold">{stats.revenue.toLocaleString("cs-CZ")} Kč</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.revenueChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stats.revenueChange)}%
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">vs. předchozí období</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Objednávky</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stats.ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.ordersChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stats.ordersChange)}%
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{stats.confirmed} potvrzených</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Konverzní poměr</p>
                    <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">z rezervací na potvrzení</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Průměrná objednávka</p>
                    <p className="text-2xl font-bold">{stats.avgOrderValue.toLocaleString("cs-CZ")} Kč</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">průměrná hodnota</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inquiriesCount}</p>
                  <p className="text-sm text-muted-foreground">Dotazů celkem</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatCount}</p>
                  <p className="text-sm text-muted-foreground">Chat konverzací</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobApplicationsCount}</p>
                  <p className="text-sm text-muted-foreground">Pracovních přihlášek</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tržby v čase</CardTitle>
                <CardDescription>Denní přehled tržeb a rezervací</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number) => [`${value.toLocaleString("cs-CZ")} Kč`, "Tržby"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tržby" 
                        stroke="#16a34a" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Počet rezervací</CardTitle>
                <CardDescription>Denní přehled počtu rezervací</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="rezervace" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Rezervace podle města
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {cityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Rezervace podle balíčku
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageData.map((pkg, index) => (
                    <div key={pkg.name} className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{pkg.name}</span>
                          <span className="text-sm text-muted-foreground">{pkg.value}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(pkg.value / stats.total) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {packageData.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Žádná data</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6 mt-6">
          {/* Traffic overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Zobrazení stránek</p>
                    <p className="text-2xl font-bold">{seoMetrics.pageViews.toLocaleString("cs-CZ")}</p>
                  </div>
                  <Eye className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs">+12% vs. minulý měsíc</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unikátní návštěvníci</p>
                    <p className="text-2xl font-bold">{seoMetrics.uniqueVisitors.toLocaleString("cs-CZ")}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs">+8% vs. minulý měsíc</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prům. doba na stránce</p>
                    <p className="text-2xl font-bold">{seoMetrics.avgSessionDuration}</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">{seoMetrics.pagesPerSession} stránek/session</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-bold">{seoMetrics.bounceRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/20" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-xs">-3% (lepší)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device & Traffic Source */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Zařízení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Mobil</span>
                        <span className="text-sm text-muted-foreground">{seoMetrics.mobileTraffic}%</span>
                      </div>
                      <Progress value={seoMetrics.mobileTraffic} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Desktop</span>
                        <span className="text-sm text-muted-foreground">{seoMetrics.desktopTraffic}%</span>
                      </div>
                      <Progress value={seoMetrics.desktopTraffic} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Zdroje návštěvnosti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Organické vyhledávání</span>
                    </div>
                    <span className="text-sm font-medium">{seoMetrics.organicTraffic}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Přímá návštěva</span>
                    </div>
                    <span className="text-sm font-medium">{seoMetrics.directTraffic}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Referral</span>
                    </div>
                    <span className="text-sm font-medium">{seoMetrics.referralTraffic}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      <span className="text-sm">Sociální sítě</span>
                    </div>
                    <span className="text-sm font-medium">{seoMetrics.socialTraffic}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Nejnavštěvovanější stránky
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Stránka</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Zobrazení</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Prům. čas</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page) => (
                      <tr key={page.path} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm font-medium">{page.title}</p>
                            <p className="text-xs text-muted-foreground">{page.path}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 text-sm">{page.views.toLocaleString("cs-CZ")}</td>
                        <td className="text-right py-3 px-2 text-sm">{page.avgTime}</td>
                        <td className="text-right py-3 px-2">
                          <Badge variant={page.bounceRate < 40 ? "default" : "secondary"}>
                            {page.bounceRate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          {/* SEO Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>SEO Skóre</CardTitle>
                <CardDescription>Celkové hodnocení optimalizace</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${90 * 3.52} 352`}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">90%</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Výborné! Vaše stránky jsou dobře optimalizované.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  SEO Checklist
                </CardTitle>
                <CardDescription>Kontrola klíčových SEO prvků</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {seoChecklist.map((item) => (
                    <div 
                      key={item.name} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {item.status ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge 
                        variant={item.impact === "high" ? "default" : item.impact === "medium" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {item.impact === "high" ? "Vysoká" : item.impact === "medium" ? "Střední" : "Nízká"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>Metriky výkonu stránky důležité pro SEO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-sm text-muted-foreground mb-2">LCP (Largest Contentful Paint)</p>
                  <p className="text-3xl font-bold text-green-600">1.8s</p>
                  <Badge className="mt-2 bg-green-600">Dobrý</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-sm text-muted-foreground mb-2">FID (First Input Delay)</p>
                  <p className="text-3xl font-bold text-green-600">45ms</p>
                  <Badge className="mt-2 bg-green-600">Dobrý</Badge>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm text-muted-foreground mb-2">CLS (Cumulative Layout Shift)</p>
                  <p className="text-3xl font-bold text-yellow-600">0.12</p>
                  <Badge className="mt-2 bg-yellow-600">Potřebuje zlepšení</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Doporučení pro zlepšení</CardTitle>
              <CardDescription>Akce pro lepší SEO a UX</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Vytvořit sitemap.xml</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sitemap pomáhá vyhledávačům lépe indexovat vaše stránky. Doporučujeme přidat sitemap.xml do kořenového adresáře.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Optimalizovat CLS</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cumulative Layout Shift je mírně nad doporučenou hodnotou. Zvažte nastavení explicitních rozměrů pro obrázky a fonty.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Propojit Google Search Console</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pro detailnější data o vyhledávání a indexaci doporučujeme propojit Google Search Console.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;

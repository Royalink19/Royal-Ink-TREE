'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  BarChart3,
  QrCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  TrendingUp,
  MousePointerClick,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Store,
  Eye,
  Radio,
  Link2,
  MapPin,
  Smartphone,
  Layers,
  Globe,
} from 'lucide-react';
import type { AnalyticsRecord } from '@/lib/analytics-storage';

interface TouchpointPreset {
  id: string;
  tag: string;
  titleAr: string;
  titleFr: string;
  category: 'physical' | 'card' | 'social';
  categoryAr: string;
  placementAr: string;
  placementFr: string;
  icon: string;
}

// Known Presets for Touchpoint Links & QR Generation
const PRESETS: TouchpointPreset[] = [
  {
    id: 'stand_qr',
    tag: 'stand_qr',
    titleAr: 'ستاند طاولة الاستقبال (Desk Stand QR)',
    titleFr: 'Stand de Comptoir / Réception',
    category: 'physical',
    categoryAr: 'منفذ فيزيائي بالمحل',
    placementAr: 'يُطبع كرمز QR ويوضع على حامل الأكريليك/الستاند فوق مكتب الاستقبال أو كاونتر البيع.',
    placementFr: 'À imprimer sur le support plexiglass du comptoir / réception dans le showroom.',
    icon: '🏪',
  },
  {
    id: 'stand_nfc',
    tag: 'stand_nfc',
    titleAr: 'ستاند الشريحة الذكية (Stand NFC Tap URL)',
    titleFr: 'Puce NFC du Stand de Comptoir',
    category: 'physical',
    categoryAr: 'منفذ فيزيائي بالمحل',
    placementAr: 'يُبرمج داخل شريحة الـ NFC المدمجة في الستاند للمس السريع بالهاتف دون الحاجة للكاميرا.',
    placementFr: 'À programmer via application NFC Tools dans la puce NFC du stand de comptoir.',
    icon: '📲',
  },
  {
    id: 'glass_front',
    tag: 'glass_front',
    titleAr: 'واجهة المحل والزجاج الخارجي (Glass Window QR)',
    titleFr: 'Vitrine / Porte d\'Entrée Magasin',
    category: 'physical',
    categoryAr: 'منفذ فيزيائي بالمحل',
    placementAr: 'يُطبع كملصق ستيكر مقاوم للشمس ويوضع على باب المحل أو الواجهة الزجاجية المطلة على السوق للزبائن أثناء الدخول أو عند الإغلاق.',
    placementFr: 'À coller sous forme d\'autocollant sur la vitrine ou la porte en verre du magasin.',
    icon: '🪟',
  },
  {
    id: 'business_card',
    tag: 'business_card',
    titleAr: 'بطاقة العمل الرسمية (Carte de Visite QR/NFC)',
    titleFr: 'Carte de Visite Officielle',
    category: 'card',
    categoryAr: 'بطاقة عمل موحدة',
    placementAr: 'يُطبع في ظهر بطاقة العمل الرسمية الموحدة لشركة Royal Ink أو يُبرمج في شريحة الـ NFC الخاصة بالكارت.',
    placementFr: 'À imprimer au dos de la carte de visite officielle ou programmer dans la puce NFC de la carte.',
    icon: '💼',
  },
  {
    id: 'instagram',
    tag: 'instagram',
    titleAr: 'رابط البايو إنستغرام (Instagram Bio Link)',
    titleFr: 'Lien Bio Instagram',
    category: 'social',
    categoryAr: 'شبكات التواصل',
    placementAr: 'يوضع في حقل الرابط (Website / Link in Bio) في صفحة الإنستغرام الرسمية لرويال إنك.',
    placementFr: 'À coller directement dans le champ "Site web" de la bio du compte Instagram officiel.',
    icon: '📸',
  },
  {
    id: 'facebook',
    tag: 'facebook',
    titleAr: 'زر صفحة الفيسبوك (Facebook Page Action)',
    titleFr: 'Bouton Page Facebook',
    category: 'social',
    categoryAr: 'شبكات التواصل',
    placementAr: 'يوضع في زر الإجراء الرئيسي للصفحة (Call to Action Button) أو في المنشور المثبت بالأعلى.',
    placementFr: 'À configurer sur le bouton principal "Visiter le site web" ou post épinglé Facebook.',
    icon: '🔵',
  },
  {
    id: 'tiktok',
    tag: 'tiktok',
    titleAr: 'رابط البايو تيك توك (TikTok Bio Link)',
    titleFr: 'Lien Bio TikTok',
    category: 'social',
    categoryAr: 'شبكات التواصل',
    placementAr: 'يوضع في رابط البايو التعريفي لحساب تيك توك الرسمي.',
    placementFr: 'À coller dans le champ "Site web" de la biographie du compte TikTok.',
    icon: '🎵',
  },
];

export default function StatsDashboard() {
  const [data, setData] = useState<AnalyticsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'qrs'>('links');

  // QR Generator State
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].tag);
  const [customTag, setCustomTag] = useState('');
  const [domain, setDomain] = useState('');
  const [qrColorStyle, setQrColorStyle] = useState<'bw' | 'royal'>('bw');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Initialize domain on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  // Fetch Stats from API
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Compute Active Tag and URL
  const activeTag = selectedPreset === 'custom' ? customTag || 'custom' : selectedPreset;
  const currentBaseDomain = domain.trim() || 'https://royal-ink.com';
  const targetUrl = `${currentBaseDomain}/connect?source=${encodeURIComponent(activeTag)}`;

  // Generate QR Code
  useEffect(() => {
    if (!targetUrl) return;

    const darkColor = qrColorStyle === 'royal' ? '#e30b17' : '#000000';
    const lightColor = qrColorStyle === 'royal' ? '#141413' : '#ffffff';

    QRCode.toDataURL(targetUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [targetUrl, qrColorStyle]);

  // Copy individual Link
  const handleCopyLink = (urlToCopy: string, tagId: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedTag(tagId);
    setTimeout(() => setCopiedTag(null), 2500);
  };

  // Switch to QR Tab with specified preset
  const handleOpenQRForTag = (tag: string) => {
    setSelectedPreset(tag);
    setActiveTab('qrs');
  };

  // Download QR Code PNG
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `royal-ink-qr-${activeTag}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset Stats
  const handleReset = async () => {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les statistiques à zéro ?')) {
      try {
        const res = await fetch('/api/stats', { method: 'DELETE' });
        if (res.ok) {
          fetchStats();
        }
      } catch (err) {
        console.error('Failed to reset:', err);
      }
    }
  };

  const totalVisits = data?.totalVisits || 0;
  const totalClicks = data?.totalClicks || 0;
  const conversionRate = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '0';

  // Find top channel
  const sortedSources = data?.sources
    ? Object.entries(data.sources).sort((a, b) => b[1].views - a[1].views)
    : [];
  const topChannel =
    sortedSources.length > 0 && sortedSources[0][1].views > 0
      ? sortedSources[0][1].label
      : 'En attente de scans';

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white selection:bg-[#e30b17] selection:text-white pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#121211]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>الموقع الرئيسي</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e30b17] animate-pulse" />
            <h1 className="text-sm sm:text-base font-bold tracking-tight">
              Royal Ink <span className="text-[#e30b17]">Analytics & Links Hub</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all"
            title="تحديث الإحصائيات"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#e30b17]' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-red-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all"
            title="تصفير الأرقام"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصفير</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Tab 1: Ready-to-use Links */}
            <button
              onClick={() => setActiveTab('links')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                activeTab === 'links'
                  ? 'bg-[#e30b17] text-white shadow-lg shadow-red-900/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>📋 روابط المنافذ السريعة (Links & Copy)</span>
            </button>

            {/* Tab 2: Live Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-[#e30b17] text-white shadow-lg shadow-red-900/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 الإحصائيات المباشرة (Live Stats)</span>
            </button>

            {/* Tab 3: QR Studio */}
            <button
              onClick={() => setActiveTab('qrs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                activeTab === 'qrs'
                  ? 'bg-[#e30b17] text-white shadow-lg shadow-red-900/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>🖨️ استوديو الباركود (QR Generator)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>التتبع التلقائي نشط ومحمي</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB 1: QUICK READY-TO-USE LINKS & COPY
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            {/* Domain Setting Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141413] border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#e30b17] uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>دومين الموقع الأساسي (Base Domain):</span>
                </span>
                <p className="text-xs text-white/50">
                  جميع الروابط بالأسفل تتكيف فوراً مع هذا الدومين. يمكنك كتابة أي دومين نهائي هنا:
                </p>
              </div>

              <div className="w-full md:w-96">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://royal-ink.com"
                  className="w-full bg-[#0a0a09] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e30b17]"
                />
              </div>
            </div>

            {/* List of Touchpoint Cards */}
            <div className="space-y-3.5">
              {PRESETS.map((p) => {
                const fullUrl = `${currentBaseDomain}/connect?source=${p.tag}`;
                const isCopied = copiedTag === p.id;

                let categoryStyle = 'bg-red-950/40 text-red-300 border-red-500/20';
                if (p.category === 'card') categoryStyle = 'bg-amber-950/40 text-amber-300 border-amber-500/20';
                else if (p.category === 'social') categoryStyle = 'bg-blue-950/40 text-blue-300 border-blue-500/20';

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#141413] border border-white/10 hover:border-white/20 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Info Column */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg">{p.icon}</span>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {p.titleAr}
                        </h3>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
                          {p.categoryAr}
                        </span>
                      </div>

                      {/* Where to put it */}
                      <div className="flex items-start gap-1.5 text-xs text-white/70 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <MapPin className="w-3.5 h-3.5 text-[#e30b17] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white/90">أين يوضع هذا الرابط؟ </span>
                          <span className="text-white/60">{p.placementAr}</span>
                        </div>
                      </div>

                      {/* URL Box */}
                      <div className="mt-2 flex items-center gap-2">
                        <code className="text-[11px] font-mono text-[#e30b17] bg-[#0a0a09] px-3 py-1.5 rounded-lg border border-white/10 truncate max-w-full block select-all">
                          {fullUrl}
                        </code>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex sm:flex-row lg:flex-col items-stretch gap-2 shrink-0">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(fullUrl, p.id)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#e30b17] hover:bg-[#c90914] text-white shadow-lg shadow-red-900/30'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? 'تم النسخ بنجاح!' : 'نسخ الرابط'}</span>
                      </button>

                      {/* Open in QR Studio Button */}
                      <button
                        onClick={() => handleOpenQRForTag(p.tag)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>توليد الباركود</span>
                      </button>

                      {/* Live Test */}
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white/40 hover:text-white/80 transition-colors"
                        title="تجربة الرابط في تبويب جديد"
                      >
                        <span>اختبار الرابط</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 2: ANALYTICS DASHBOARD
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Scans / Views */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#141413] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e30b17]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 uppercase font-medium">إجمالي الزيارات / المسحات</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/70">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {totalVisits.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  من مختلف النقاط (ستاند، واجهة، كارت...)
                </div>
              </div>

              {/* Total Clicks */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#141413] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 uppercase font-medium">إجمالي التفاعلات والنقرات</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {totalClicks.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  واتساب، اتصال، متجر، خريطة...
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#141413] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 uppercase font-medium">نسبة التحويل (Conversion)</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#e30b17]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e30b17]">
                  {conversionRate}%
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  نسبة الزوار الذين تواصلوا أو تسوقوا
                </div>
              </div>

              {/* Top Channel */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#141413] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 uppercase font-medium">المصدر الأكثر نشاطاً</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                  {topChannel}
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  صاحب أعلى نسبة مسح وزيارات
                </div>
              </div>
            </div>

            {/* Touchpoints Detailed Table */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#141413] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#e30b17]" />
                    <span>مقارنة أداء المنافذ (Touchpoints Performance)</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    إحصائيات دقيقة لكل ستاند، واجهة زجاجية، بطاقة عمل، وحساب تواصل
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-white/40 uppercase">
                      <th className="pb-3 pr-4 font-medium">المنفذ / النقطة (Touchpoint)</th>
                      <th className="pb-3 px-4 font-medium text-center">المسحات (Visits)</th>
                      <th className="pb-3 px-4 font-medium text-center">النقرات (Clicks)</th>
                      <th className="pb-3 px-4 font-medium text-center">نسبة التفاعل</th>
                      <th className="pb-3 pl-4 font-medium text-right">الحصة من الحركة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedSources.map(([sourceKey, info]) => {
                      const share = totalVisits > 0 ? (info.views / totalVisits) * 100 : 0;
                      const conv = info.views > 0 ? ((info.clicks / info.views) * 100).toFixed(0) : '0';

                      let categoryBadge = 'bg-white/5 text-white/60';
                      if (info.category === 'stand') categoryBadge = 'bg-red-950/40 text-red-300 border-red-500/20';
                      else if (info.category === 'glass') categoryBadge = 'bg-blue-950/40 text-blue-300 border-blue-500/20';
                      else if (info.category === 'nfc') categoryBadge = 'bg-purple-950/40 text-purple-300 border-purple-500/20';
                      else if (info.category === 'card') categoryBadge = 'bg-amber-950/40 text-amber-300 border-amber-500/20';
                      else if (info.category === 'social') categoryBadge = 'bg-pink-950/40 text-pink-300 border-pink-500/20';

                      return (
                        <tr key={sourceKey} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-white/90">{info.label}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${categoryBadge}`}>
                                ?source={sourceKey}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                            {info.views}
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono text-emerald-400">
                            {info.clicks}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-white/80">
                              {conv}%
                            </span>
                          </td>

                          <td className="py-3.5 pl-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-24 sm:w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-[#e30b17] rounded-full transition-all duration-500"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-white/50 w-10 text-right">
                                {share.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Breakdown & Recent Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actions Clicked */}
              <div className="p-5 rounded-2xl bg-[#141413] border border-white/10 shadow-xl">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <MousePointerClick className="w-4 h-4 text-[#e30b17]" />
                  <span>الإجراءات الأكثر طلباً (Actions Clicked)</span>
                </h3>

                {Object.keys(data?.actions || {}).length === 0 ? (
                  <p className="text-xs text-white/40 italic py-6 text-center">
                    لم يتم تسجيل أي نقرات بعد. بمجرد قيام الزوار بالضغط على الأزرار ستظهر هنا بالتفصيل.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {Object.entries(data?.actions || {})
                      .sort((a, b) => b[1] - a[1])
                      .map(([actionId, count]) => {
                        const actionTotal = totalClicks > 0 ? ((count / totalClicks) * 100).toFixed(0) : '0';
                        return (
                          <div
                            key={actionId}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
                          >
                            <span className="text-xs font-medium text-white/90 capitalize">
                              {actionId.replace(/-/g, ' ')}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-white/50">{actionTotal}%</span>
                              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Recent Activity Log */}
              <div className="p-5 rounded-2xl bg-[#141413] border border-white/10 shadow-xl flex flex-col">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#e30b17]" />
                  <span>سجل النشاط المباشر (Recent Live Activity)</span>
                </h3>

                {(!data?.recentEvents || data.recentEvents.length === 0) ? (
                  <p className="text-xs text-white/40 italic py-6 text-center my-auto">
                    بانتظار المسحات والنقرات الحية...
                  </p>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {data.recentEvents.slice(0, 15).map((evt) => {
                      const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });
                      const isClick = evt.type === 'link_click';

                      return (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isClick ? 'bg-emerald-950 text-emerald-300' : 'bg-blue-950 text-blue-300'
                              }`}
                            >
                              {isClick ? 'نقر' : 'مسح/زيارة'}
                            </span>
                            <span className="text-white/80 font-mono">
                              {evt.source}
                            </span>
                            {evt.linkId && (
                              <span className="text-white/40">
                                → {evt.linkId}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-white/40">{timeStr}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 3: QR CODE STUDIO & GENERATOR
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'qrs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-[#141413] border border-white/10 shadow-xl">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
                  <QrCode className="w-5 h-5 text-[#e30b17]" />
                  <span>توليد باركود مخصص للطباعة (QR Code Studio)</span>
                </h2>
                <p className="text-xs text-white/50 mb-5">
                  اختر المنفذ الفيزيائي (ستاند، زجاج واجهة، بطاقة عمل) لتحميل باركود فائق الدقة جاهز للمطبعة.
                </p>

                {/* Preset Touchpoint Selector */}
                <div className="space-y-3 mb-5">
                  <label className="text-xs font-semibold text-white/70 uppercase">
                    1. اختر المنفذ المراد توليد باركود له:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESETS.map((p) => {
                      const selected = selectedPreset === p.tag;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPreset(p.tag)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            selected
                              ? 'bg-[#e30b17]/15 border-[#e30b17] text-white shadow-sm'
                              : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="font-semibold text-xs leading-tight mb-1 flex items-center gap-1.5">
                            <span>{p.icon}</span>
                            <span>{p.titleAr}</span>
                          </div>
                          <div className="text-[10px] text-white/40 leading-snug">{p.placementAr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Domain & Link Customizer */}
                <div className="space-y-4 pt-3 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase mb-1.5">
                      2. رابط الموقع (Domain):
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="https://royal-ink.com"
                      className="w-full bg-[#0a0a09] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e30b17]"
                    />
                    <span className="text-[10px] text-white/40 mt-1 block">
                      عند رفع الموقع على الدومين النهائي (مثل https://royal-ink.dz)، اكتبه هنا لتحديث الباركود تلقائياً.
                    </span>
                  </div>

                  {/* QR Style / Color Palette */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase mb-1.5">
                      3. تصميم ولون الباركود:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQrColorStyle('bw')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                          qrColorStyle === 'bw'
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-sm bg-black border border-neutral-300" />
                        <span>أسود كلاسيكي (الأفضل والأضمن للمطابع)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQrColorStyle('royal')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                          qrColorStyle === 'royal'
                            ? 'bg-[#e30b17] text-white border-[#e30b17] font-bold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-sm bg-[#e30b17]" />
                        <span>أحمر رويال إنك الملكي</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Preview Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-24 w-full max-w-sm p-6 rounded-3xl bg-[#141413] border border-white/10 shadow-2xl flex flex-col items-center text-center">
                {/* Brand Preview Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/logo.svg" alt="Royal Ink Logo" width={110} height={24} className="h-6 w-auto" />
                </div>

                {/* QR Code Canvas Frame */}
                <div className="relative p-4 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="w-56 h-56 object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-black/40 text-xs">
                      جاري إنشاء الباركود...
                    </div>
                  )}
                </div>

                {/* Active Tag Label */}
                <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e30b17]">
                  ?source={activeTag}
                </div>

                {/* Target URL string */}
                <div className="mt-2 text-[11px] font-mono text-white/50 break-all px-2 max-w-xs">
                  {targetUrl}
                </div>

                {/* Action Buttons: Download & Copy */}
                <div className="w-full grid grid-cols-2 gap-2 mt-5">
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#e30b17] hover:bg-[#c90914] active:scale-95 text-white text-xs font-bold shadow-lg shadow-red-900/30 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل بدقة عالية</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(targetUrl, 'active_qr')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-xs font-medium border border-white/10 transition-all"
                  >
                    {copiedTag === 'active_qr' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedTag === 'active_qr' ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

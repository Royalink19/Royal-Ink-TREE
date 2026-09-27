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
  Users,
  MousePointerClick,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Store,
  Eye,
  CreditCard,
  Phone,
  Radio,
} from 'lucide-react';
import type { AnalyticsRecord } from '@/lib/analytics-storage';

// Known Presets for Touchpoint QR Generation
const PRESETS = [
  {
    id: 'stand_qr',
    label: '🏪 Stand de Comptoir (Desk Stand QR)',
    tag: 'stand_qr',
    description: 'À imprimer sur le support plexiglass du comptoir / réception',
  },
  {
    id: 'stand_nfc',
    label: '📲 Stand NFC Tap URL',
    tag: 'stand_nfc',
    description: 'À programmer dans la puce NFC du stand de présentation',
  },
  {
    id: 'glass_front',
    label: '🪟 Vitrine / Façade Magasin (Glass Sticker QR)',
    tag: 'glass_front',
    description: 'À coller sur la vitrine ou la porte d\'entrée du magasin',
  },
  {
    id: 'card_ammar',
    label: '💼 Carte de Visite — M. Ammar',
    tag: 'card_ammar',
    description: 'QR Code ou NFC pour la carte de visite de M. Ammar',
  },
  {
    id: 'card_fstouh',
    label: '💼 Carte de Visite — M. Fstouh',
    tag: 'card_fstouh',
    description: 'QR Code ou NFC pour la carte de visite de M. Fstouh',
  },
  {
    id: 'instagram',
    label: '📸 Lien Bio Instagram',
    tag: 'instagram',
    description: 'Lien direct à mettre dans la bio du compte Instagram officiel',
  },
  {
    id: 'facebook',
    label: '🔵 Lien Page Facebook',
    tag: 'facebook',
    description: 'Lien pour le bouton d\'action ou publications Facebook',
  },
  {
    id: 'tiktok',
    label: '🎵 Lien Bio TikTok',
    tag: 'tiktok',
    description: 'Lien pour la bio du profil TikTok',
  },
];

export default function StatsDashboard() {
  const [data, setData] = useState<AnalyticsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'qrs'>('analytics');

  // QR Generator State
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].tag);
  const [customTag, setCustomTag] = useState('');
  const [domain, setDomain] = useState('');
  const [qrColorStyle, setQrColorStyle] = useState<'bw' | 'royal'>('bw');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

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
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Compute Active Tag and URL
  const activeTag = selectedPreset === 'custom' ? customTag || 'custom' : selectedPreset;
  const targetUrl = `${domain || 'https://royal-ink.com'}/connect?source=${encodeURIComponent(activeTag)}`;

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

  // Copy URL
  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  const topChannel = sortedSources.length > 0 && sortedSources[0][1].views > 0
    ? sortedSources[0][1].label
    : 'En attente de scans';

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white selection:bg-[#e30b17] selection:text-white pb-16">
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
              Royal Ink <span className="text-[#e30b17]">Analytics & QR Studio</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#e30b17]' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-red-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all"
            title="Réinitialiser"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصفير</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#e30b17] text-white shadow-lg shadow-red-900/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>الإحصائيات المباشرة (Live Stats)</span>
            </button>

            <button
              onClick={() => setActiveTab('qrs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'qrs'
                  ? 'bg-[#e30b17] text-white shadow-lg shadow-red-900/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>استوديو توليد الباركود (QR Generator)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>التتبع التلقائي نشط</span>
          </div>
        </div>

        {/* ── TAB 1: ANALYTICS DASHBOARD ──────────────────────── */}
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
                  من مختلف النقاط (ستاند، واجهة، كروت...)
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

            {/* Touchpoints Detailed Table (Stand vs Glass vs NFC vs Cards vs Social) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#141413] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#e30b17]" />
                    <span>مقارنة المنافذ الفيزيائية والرقمية (Touchpoints Breakdown)</span>
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

                      // Badge Color
                      let categoryBadge = 'bg-white/5 text-white/60';
                      if (info.category === 'stand') categoryBadge = 'bg-red-950/40 text-red-300 border-red-500/20';
                      else if (info.category === 'glass') categoryBadge = 'bg-blue-950/40 text-blue-300 border-blue-500/20';
                      else if (info.category === 'nfc') categoryBadge = 'bg-purple-950/40 text-purple-300 border-purple-500/20';
                      else if (info.category === 'card') categoryBadge = 'bg-amber-950/40 text-amber-300 border-amber-500/20';
                      else if (info.category === 'social') categoryBadge = 'bg-pink-950/40 text-pink-300 border-pink-500/20';

                      return (
                        <tr key={sourceKey} className="hover:bg-white/[0.02] transition-colors">
                          {/* Label & Tag */}
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-white/90">{info.label}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${categoryBadge}`}>
                                ?source={sourceKey}
                              </span>
                            </div>
                          </td>

                          {/* Views */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                            {info.views}
                          </td>

                          {/* Clicks */}
                          <td className="py-3.5 px-4 text-center font-mono text-emerald-400">
                            {info.clicks}
                          </td>

                          {/* Conv */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-white/80">
                              {conv}%
                            </span>
                          </td>

                          {/* Share Progress Bar */}
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

        {/* ── TAB 2: QR CODE STUDIO & GENERATOR ────────────────── */}
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
                    1. اختر المنفذ الفيزيائي المراد طباعته:
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
                          <div className="font-semibold text-xs leading-tight mb-1">{p.label}</div>
                          <div className="text-[10px] text-white/40 leading-snug">{p.description}</div>
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
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-xs font-medium border border-white/10 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
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

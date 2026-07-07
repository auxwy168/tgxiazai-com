// ============================================================
// TG下载站 — tgxiazai.com
// Telegram 中文官方下载与深度教程一站式平台
// ============================================================
export const siteConfig = {
  // ── 基础信息 ──
  name: 'tgxiazai.com',
  title: 'TG下载 — Telegram中文官方下载与深度教程',
  description:
    'TG下载提供Telegram中文官方下载（Windows/macOS/Android/iOS/Web/Linux全平台），附完整安装教程、注册入门指南、隐私安全设置、代理配置、功能进阶教程。所有下载指向官方服务器，SHA256校验，100%安全无毒。2026最新版。',
  keywords: 'Telegram下载,Telegram中文版,Telegram电脑版,Telegram安卓,Telegram苹果,Telegram注册,Telegram教程,Telegram安全,Telegram代理,Telegram中文设置,Telegram群组,Telegram频道,Telegram机器人,tg下载,telegram官网',
  url: 'https://tgxiazai.com',
  language: 'zh-CN',
  author: 'TG下载',
  email: 'contact@tgxiazai.com',

  // ── 更新浮窗 ──
  newsFloat: {
    date: '更新日期：2026-07-07',
    label: '最新更新',
    items: [
      '1. Telegram Desktop v5.12.3 正式版发布',
      '2. 新增 Telegram vs WhatsApp 全面对比',
      '3. +86 注册收不到验证码解决方案汇总',
    ],
  },

  // ── Logo 区 ──
  logo: {
    text: 'TG下载',
    img: 'TG.svg',
    imgWidth: 160,
    imgHeight: 22,
  },

  // ── Hero 下载区 ──
  downloadButtons: [
    { img: 'window_img.png', btnSvg: 'down.svg', onClick: "window.open('https://telegram.org/dl/desktop/win64')" },
    { img: 'android_img.png', btnSvg: 'down-android.svg', onClick: "window.open('https://telegram.org/dl/android/apk')" },
    { img: 'iphone_img.png', btnSvg: 'down-iphone.svg', onClick: "window.open('https://apps.apple.com/app/telegram-messenger/id686449807')" },
  ],

  // ── Features 区（10 个）──
  features: [
    { gif: 'img1.gif', title: '200,000人超级群组', desc: '单个群组容纳20万人，支持投票、话题、慢速模式、精细权限管理。' },
    { gif: 'img2.gif', title: '无限订阅频道', desc: '一对多广播，支持静默推送、定时发布、内容变现等专业运营功能。' },
    { gif: 'img3.gif', title: '端到端加密', desc: 'Secret Chat采用MTProto 2.0加密，支持阅后即焚、截屏提醒、禁止转发。' },
    { gif: 'img4.gif', title: '2GB超大文件传输', desc: '单文件上限2GB，云端无限存储，所有格式随意发送，永不丢失。' },
    { gif: 'img5.gif', title: 'Bot机器人平台', desc: '开放Bot API，支持内联查询、支付、游戏、Web App等自动化功能。' },
    { gif: 'img6.gif', title: '全设备云端同步', desc: '手机、平板、电脑、网页端实时同步，换设备无需备份迁移。' },
    { gif: 'img7.gif', title: '高清语音/视频通话', desc: '端到端加密通话，支持千人语音聊天室、屏幕共享、噪音抑制。' },
    { gif: 'img8.gif', title: '永久免费 · 无广告', desc: 'Telegram承诺永久免费无广告，创始人Pavel Durov自掏腰包运营。' },
    { gif: 'img9.gif', title: 'MTProto 2.0加密协议', desc: '自研加密协议，经过全球安全专家多次审计，比TLS更快更安全。' },
  ],

  // ── 内容分类 ──
  categories: [
    { id: 'download', name: '下载安装' },
    { id: 'guide', name: '注册入门' },
    { id: 'safety', name: '安全隐私' },
    { id: 'tutorial', name: '功能教程' },
    { id: 'compare', name: '对比评测' },
    { id: 'proxy', name: '代理网络' },
  ],

  // ── 分类标签映射 ──
  catLabels: {
    download: '下载安装',
    guide: '注册入门',
    safety: '安全隐私',
    tutorial: '功能教程',
    compare: '对比评测',
    proxy: '代理网络',
  } as Record<string, string>,

  // ── 分类标签调色板 ──
  catTagPalette: [
    { bg: '#e0f2fe', color: '#0369a1' },
    { bg: '#ecfdf5', color: '#065f46' },
    { bg: '#fef3c7', color: '#92400e' },
    { bg: '#f3e8ff', color: '#7c3aed' },
    { bg: '#fce7f3', color: '#be185d' },
    { bg: '#e0f2fe', color: '#0891b2' },
  ],

  // ── 配色方案（Telegram 蓝 #0088cc）──
  colors: {
    primary: '#0088cc',
    primaryHover: '#00a8e8',
    bg: '#ffffff',
    bgCard: '#f5f7fa',
    textPrimary: '#1a1a2e',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    featTitle: '#0088cc',
    btnBorder: '#ffffff',
    border: '#e8ecf1',
  },

  // ── 字体方案 ──
  fonts: {
    heading: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
    body: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
  },

  // ── 社交分享链接 ──
  social: [
    { name: 'Telegram', href: 'https://t.me/', icon: 'telegram' },
    { name: 'X (Twitter)', href: 'https://x.com/', icon: 'x' },
    { name: 'YouTube', href: 'https://youtube.com/', icon: 'youtube' },
    { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
    { name: '微博', href: 'https://weibo.com/', icon: 'weibo' },
  ],

  // ── 页脚 ──
  footer: {
    notice: 'TG下载（tgxiazai.com）是独立的Telegram中文教程与下载导航站点，非Telegram官方。所有下载链接均指向 telegram.org 官方服务器。',
  },

  // ── 结构化数据 ──
  structuredData: {
    organization: 'TG下载',
    homepageType: 'WebSite' as 'WebSite' | 'Organization',
  },
};

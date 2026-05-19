"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Plus, Mic, Send, Search, Settings, 
  ChevronRight, ChevronLeft, ChevronDown, MoreVertical, 
  LayoutGrid, MessageSquare, Image as ImageIcon, 
  FileText, Copy, ThumbsUp, ThumbsDown, 
  ShieldAlert, RefreshCcw, Command, 
  Zap, LogOut, User, Sparkles, 
  Check, X, Trash2, Pin, Edit2, 
  Layers, Ghost, Monitor, Smartphone,
  ExternalLink, ArrowLeft, ArrowRight,
  Menu, Info, Paperclip, MicOff,
  Square, Play, Download, Share2,
  Bookmark, Folder, History, CreditCard,
  Crown, Lock, Eye, EyeOff, Mail,
  Loader2, ArrowUpRight
} from 'lucide-react';
import { create } from 'zustand';

const DEEPSEEK_API_KEY = "sk-ece8c3c14e464b2685083854f977dda3";

const t = {
  fa: {
    newChat: "گفتگوی جدید",
    searchPlaceholder: "جستجو در تمام گفتگوها...",
    today: "امروز",
    yesterday: "دیروز",
    settingsTitle: "تنظیمات چت‌چی AI",
    general: "عمومی",
    personalization: "شخصی‌سازی",
    usage: "اشتراک و مصرف",
    security: "امنیت",
    account: "حساب کاربری",
    dataControl: "کنترل داده‌ها",
    langLabel: "زبان پیش‌فرض پلتفرم",
    themeLabel: "پوسته بصری محیط کاربری",
    narratorLabel: "گوینده دستیار صوتی",
    voiceOptionLabel: "مکالمه صوتی مستقل",
    voiceOptionSubtitle: "مکالمه صوتی چت‌چی را در یک صفحه اختصاصی، بدون متن زنده و جلوه‌های شلوغ بصری نگه‌داری کنید.",
    cancel: "انصراف",
    save: "ذخیره تغییرات",
    upgradeTitle: "طرح اشتراک فعلی شما",
    freePlan: "طرح رایگان",
    upgradePrompt: "برای استفاده از مدل‌های پیشرفته و افزایش محدوده تصویرسازی، پلتفرم خود را ارتقا دهید.",
    usageLimit: "میزان مصرف پیام ماهانه",
    close: "بستن پنجره",
    deleteAccount: "حذف دائمی حساب کاربری",
    deleteAccountDesc: "کلیه مکالمات، فایل‌ها و تگ‌های شما برای همیشه حذف خواهند شد.",
    deleteBtn: "حذف حساب",
    renameTitle: "تغییر نام گفتگو",
    renamePlaceholder: "نام جدید گفتگو را وارد کنید...",
    deleteConfirmTitle: "آیا از حذف این گفتگو مطمئن هستید؟",
    deleteConfirmDesc: "این عمل غیرقابل بازگشت است و تاریخچه این چت کاملاً پاک خواهد شد.",
    sureDeleteBtn: "بله، حذف شود",
    pinned: "سنجاق شده‌ها",
    tempModeActive: "حالت گفتگوی موقت فعال است - تاریخچه ذخیره نخواهد شد",
    tempModeBtn: "گفتگوی موقت",
    emptyTitle: "امروز چطور می‌توانم در انجام پروژه‌ها به شما کمک کنم؟",
    tempModeTitle: "گفت‌وگوی موقت",
    tempModeDesc: "این گفت‌وگو در تاریخچه چت‌های شما نمایش داده نمی‌شود و پس از پایان گفت وگو ذخیره نخواهد شد.",
    composerPlaceholder: "درخواست خود را بنویسید...",
    warningAlert: "چت‌چی ممکن است اطلاعات نادرستی تولید کند. اعتبار پاسخ‌ها را بسنجید.",
    processing: "در حال پردازش..."
  },
  en: {
    newChat: "New Chat",
    searchPlaceholder: "Search in all chats...",
    today: "Today",
    yesterday: "Yesterday",
    settingsTitle: "چت‌چی Settings",
    general: "General",
    personalization: "Personalization",
    usage: "Usage & Plan",
    security: "Security",
    account: "Account",
    dataControl: "Data Control",
    langLabel: "Default Language",
    themeLabel: "Theme Profile",
    narratorLabel: "Voice Assistant Narrator",
    voiceOptionLabel: "Independent Voice Chat",
    voiceOptionSubtitle: "Keep Dimoon Voice in a separate full screen, without real time transcripts and visuals.",
    cancel: "Cancel",
    save: "Save Changes",
    upgradeTitle: "Your Current Subscription",
    freePlan: "Free Plan",
    upgradePrompt: "Upgrade your platform to access advanced models and increase image generation quotas.",
    usageLimit: "Monthly message usage",
    close: "Close Window",
    deleteAccount: "Permanently Delete Account",
    deleteAccountDesc: "All conversations, files, and tags will be deleted forever.",
    deleteBtn: "Delete Account",
    renameTitle: "Rename Conversation",
    renamePlaceholder: "Enter new conversation title...",
    deleteConfirmTitle: "Are you sure you want to delete this conversation?",
    deleteConfirmDesc: "This action is irreversible and the history of this chat will be completely erased.",
    sureDeleteBtn: "Yes, Delete",
    pinned: "Pinned Chats",
    tempModeActive: "Temporary chat mode is active - History will not be saved",
    tempModeBtn: "Temporary Chat",
    emptyTitle: "How can I help you with your projects today?",
    tempModeTitle: "Temporary Chat",
    tempModeDesc: "This chat will not appear in your history and will not be saved after you close it.",
    composerPlaceholder: "Write your message...",
    warningAlert: "چت‌چی may generate inaccurate info. Verify its responses.",
    processing: "Processing..."
  },
  ar: {
    newChat: "محادثة جديدة",
    searchPlaceholder: "البحث في جميع المحادثات...",
    today: "اليوم",
    yesterday: "بالأمس",
    settingsTitle: "إعدادات ديمون AI",
    general: "عام",
    personalization: "التخصيص",
    usage: "الاشتراك والاستهلاك",
    security: "الأمان",
    account: "حساب المستخدم",
    dataControl: "التحكم في البيانات",
    langLabel: "لغة المنصة الافتراضية",
    themeLabel: "المظهر البصري للواجهة",
    narratorLabel: "متحدث المساعد الصوتی",
    voiceOptionLabel: "المحادثة الصوتية المستقلة",
    voiceOptionSubtitle: "حافظ على محادثة ديمون الصوتية في شاشة مخصصة منفصلة، بدون نصوص حية وتأثيرات بصرية مزدحمة.",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
    upgradeTitle: "خطة اشتراكك الحالية",
    freePlan: "الخطة المجانية",
    upgradePrompt: "قم بترقية حسابك للوصول إلى النماذج المتقدمة وزيادة حصص توليد الصور.",
    usageLimit: "استهلاك الرسائل الشهري",
    close: "إغلاق النافذة",
    deleteAccount: "حذف الحساب نهائياً",
    deleteAccountDesc: "سيتم حذف جميع المحادثات والملفات والإشارات الخاصة بك نهائياً.",
    deleteBtn: "حذف الحساب",
    renameTitle: "تغییر اسم المحادثة",
    renamePlaceholder: "أدخل الاسم الجديد للمحادثة...",
    deleteConfirmTitle: "هل أنت متأكد من حذف هذه المحادثة؟",
    deleteConfirmDesc: "هذا الإجراء غير قابل للتراجع وسيتم محو سجل هذه المحادثة بالكامل.",
    sureDeleteBtn: "نعم، احذف",
    pinned: "المحادثات المثبتة",
    tempModeActive: "وضع المحادثة المؤقتة نشط - لن يتم حفظ السجل",
    tempModeBtn: "محادثة مؤقتة",
    emptyTitle: "كيف يمكنني مساعدتك في مشاريعك اليوم؟",
    tempModeTitle: "محادثة مؤقتة",
    tempModeDesc: "لن تظهر هذه المحادثة في سجلك ولن يتم حفظها بعد إغلاقها.",
    composerPlaceholder: "اكتب رسالتك...",
    warningAlert: "قد ينتج ديمون AI معلومات غير دقيقة. يرجى التحقق من الإجابات.",
    processing: "جاري المعالجة..."
  }
};

const DesignTokens = () => {
  const store = useStore() as {
  theme: string;
  dir: string;
};

const { theme, dir } = store;
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark'); 
    root.style.setProperty('--background', '#FFFFFF');
    root.style.setProperty('--sidebar-bg', '#FCFCFC');
    root.style.setProperty('--border', '#F1F1F1');
    root.style.setProperty('--text-primary', '#111111');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--card-bg', '#FFFFFF');
    root.style.setProperty('--user-msg-bg', '#FAFAFA');
    root.style.setProperty('--ai-msg-bg', 'transparent');
    root.dir = dir;
  }, [dir]);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;300;400;500;700;900&display=swap');
      
      :root {
        --font-vazir: 'Vazirmatn', sans-serif;
        --primary: #000000;
        --accent: #4F46E5;
        --accent-foreground: #FFFFFF;
        --success: #10B981;
        --warning: #F59E0B;
        --danger: #EF4444;
        --radius-primary: 24px;
        --radius-card: 20px;
        --radius-button: 18px;
        --radius-modal: 32px;
        --radius-small: 14px;
        --shadow-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
        --shadow-layered: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
      }

      body {
        font-family: var(--font-vazir);
        -webkit-font-smoothing: antialiased;
        background-color: var(--background);
        color: var(--text-primary);
        margin: 0;
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      input:focus, select:focus, textarea:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      *:focus-visible {
        outline: none !important;
        box-shadow: none !important;
      }

      .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .sidebar-chat-btn {
        mask-image: linear-gradient(to right, transparent 0%, black 36px);
        -webkit-mask-image: linear-gradient(to right, transparent 0%, black 36px);
        transition: padding-left 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      .group:hover .sidebar-chat-btn {
        padding-left: 104px !important;
        mask-image: linear-gradient(to right, transparent 0%, black 104px) !important;
        -webkit-mask-image: linear-gradient(to right, transparent 0%, black 104px) !important;
      }

      .prose-persian {
        line-height: 1.85;
        font-size: 16px;
      }

      pre code {
        direction: ltr;
        display: block;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 12px;
        overflow-x: auto;
        font-family: monospace;
      }
    `}} />
  );
};

const useStore = create((set, get) => ({
  user: null,
  view: 'auth', 
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isCompareMode: false,
  selectedModels: ['dimoon-light'],
  messages: [],
  isThinking: false,
  tempMode: false,
  currentChatId: null,

  lang: 'fa', 
  dir: 'rtl',
  theme: 'light', 
  voiceFullscreenMode: false,
  narrator: 'arash', 

  isSearchOpen: false,
  isSettingsOpen: false,
  activeSettingsTab: 'general',
  renameChatId: null,
  deleteChatId: null,

  history: [
    { id: '1', title: 'تحلیل بازار بورس تهران', date: 'امروز', group: 'امروز', pinned: false },
    { id: '2', title: 'نوشتن اسکریپت پایتون', date: 'امروز', group: 'امروز', pinned: false },
    { id: '3', title: 'ایده‌های استارتاپی', date: 'دیروز', group: 'دیروز', pinned: false },
  ],

  setAuth: (user: any) => set({ user, view: user ? 'chat' : 'auth' }),
  setView: (view) => set({ view }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setCompareMode: (val) => set({ isCompareMode: val, selectedModels: val ? get().selectedModels.slice(0, 2) : [get().selectedModels[0]] }),
  
  toggleModel: (modelId) => {
    const { isCompareMode, selectedModels } = get();
    if (modelId === 'gemini' || modelId === 'grok') return;

    if (isCompareMode) {
      if (selectedModels.includes(modelId)) {
        if (selectedModels.length > 1) set({ selectedModels: selectedModels.filter(m => m !== modelId) });
      } else {
        const newModels = selectedModels.length >= 2 ? [selectedModels[1], modelId] : [...selectedModels, modelId];
        set({ selectedModels: newModels });
      }
    } else {
      set({ selectedModels: [modelId] });
    }
  },

  addMessage: (msg) => set((state) => {
    const newMessages = [...state.messages, msg];
    let newHistory = state.history;
    let nextChatId = state.currentChatId;

    if (msg.role === 'user' && state.messages.length === 0 && !state.tempMode) {
      const limitedTitle = msg.content.trim().substring(0, 30) + (msg.content.trim().length > 30 ? '...' : '');
      const newId = Date.now().toString();
      nextChatId = newId;
      newHistory = [
        { id: newId, title: limitedTitle, date: 'امروز', group: 'امروز', pinned: false },
        ...state.history
      ];
    }

    return { 
      messages: newMessages, 
      history: newHistory,
      currentChatId: nextChatId
    };
  }),
  setThinking: (val) => set({ isThinking: val }),
  clearChat: () => set({ messages: [], currentChatId: null, tempMode: false }),
  setTempMode: (val) => set({ tempMode: val }),

  deleteChat: (id) => set((state) => ({ 
    history: state.history.filter(h => h.id !== id),
    currentChatId: state.currentChatId === id ? null : state.currentChatId,
    messages: state.currentChatId === id ? [] : state.messages
  })),
  togglePinChat: (id) => set((state) => ({
    history: state.history.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h)
  })),
  renameChat: (id, newTitle) => set((state) => ({
    history: state.history.map(h => h.id === id ? { ...h, title: newTitle } : h)
  })),

  setSearchOpen: (val) => set({ isSearchOpen: val }),
  setSettingsOpen: (val) => set({ isSettingsOpen: val }),
  setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
  setRenameChatId: (id) => set({ renameChatId: id }),
  setDeleteChatId: (id) => set({ deleteChatId: id }),

  setLang: (lang) => set({ lang, dir: (lang === 'en') ? 'ltr' : 'rtl' }),
  setTheme: (theme) => set({ theme: 'light' }), 
  setVoiceFullscreenMode: (val) => set({ voiceFullscreenMode: val }),
  setNarrator: (val) => set({ narrator: val }),
}));

const MODELS = [
  { 
    id: 'dimoon-light', 
    name: 'Dimoon Light', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
        <path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 1-9-9Z" />
      </svg>
    ), 
    color: 'bg-indigo-500',
    deactivated: false
  },
  { 
    id: 'gpt-4', 
    name: 'ChatGPT', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ), 
    color: 'bg-emerald-500',
    deactivated: false
  },
  { 
    id: 'gemini', 
    name: 'Gemini (غیرفعال)', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
        <path d="M12 2.25a.75.75 0 0 1 .75.75c0 5.07 4.18 9.25 9.25 9.25a.75.75 0 0 1 0 1.5c-5.07 0-9.25 4.18-9.25 9.25a.75.75 0 0 1-1.5 0c0-5.07-4.18-9.25-9.25-9.25a.75.75 0 0 1 0-1.5c5.07 0 9.25-4.18 9.25-9.25a.75.75 0 0 1 .75-.75Z" />
      </svg>
    ), 
    color: 'bg-gray-300',
    deactivated: true
  },
  { 
    id: 'grok', 
    name: 'Grok (غیرفعال)', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-white">
        <path d="m4 20 16-16M4 4h8l8 16" />
      </svg>
    ), 
    color: 'bg-gray-300',
    deactivated: true
  },
];

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
    outline: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
  };
  
  return (
    <button 
      className={`h-[48px] px-5 rounded-[18px] font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const AuthView = () => {
  const setAuth = useStore(s => s.setAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('لطفاً تمامی فیلدهای الزامی را پر کنید.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuth({ name: name || 'کاربر نمونه چت‌چی', email });
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuth({ name: 'کاربر مهمان چت‌چی', email: 'guest@dimoon.ai' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 relative overflow-hidden select-none">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-[480px] bg-white border border-gray-100/80 rounded-[32px] shadow-layered p-8 md:p-10 z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">خوش آمدید به چت‌چی </h2>
          <p className="text-sm text-gray-400 font-medium mt-2">دستیار هوشمند و نسل جدید هوش مصنوعی فارسی</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3"
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 mr-2">نام و نام خانوادگی</label>
              <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-[18px] px-4 py-1.5 focus-within:border-indigo-500 transition-all">
                <User className="w-5 h-5 text-gray-400 ml-3" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: سهراب سپهری" 
                  className="w-full bg-transparent outline-none text-sm font-semibold py-2.5 text-gray-855"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 mr-2">پست الکترونیک (ایمیل)</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-[18px] px-4 py-1.5 focus-within:border-indigo-500 transition-all">
              <Mail className="w-5 h-5 text-gray-400 ml-3" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com" 
                className="w-full bg-transparent outline-none text-sm font-semibold py-2.5 text-gray-855 text-left dir-ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 mr-2">رمز عبور</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-[18px] px-4 py-1.5 focus-within:border-indigo-500 transition-all">
              <Lock className="w-5 h-5 text-gray-400 ml-3" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-transparent outline-none text-sm font-semibold py-2.5 text-gray-855 text-left dir-ltr"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-6 rounded-[18px] text-[15px] font-bold shadow-soft mt-6"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'ورود به حساب کاربری' : 'ساخت حساب کاربری')}
          </Button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <span className="relative bg-white px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">یا ادامه با</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={handleDemoLogin} className="flex items-center justify-center gap-2 h-12 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-2xl transition-all text-xs font-bold text-indigo-700 active:scale-[0.98]">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>ورود دمو (سریع)</span>
          </button>
          
          <Button variant="outline" className="h-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.26-2.07 2.95v2.6h3.34c1.96-1.8 3.08-4.45 3.08-7.81z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.34-2.6c-.93.63-2.12 1-3.94 1-3.03 0-5.6-2.05-6.52-4.8H2.18v3.02C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.48 14.09c-.23-.69-.36-1.42-.36-2.18s.13-1.5.36-2.19V6.7H2.18C1.43 8.2 1 9.95 1 12c0 2.05.43 3.8 1.18 5.3l3.3-2.61z"/>
              <path fill="#EA4335" d="M12 4.75c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.46 1.48 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.7l3.3 2.61c.92-2.75 3.49-4.8 6.52-4.8z"/>
            </svg>
            گوگل
          </Button>
        </div>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? 'هنوز ثبت‌نام نکرده‌اید؟ ایجاد حساب جدید' : 'قبلاً ثبت‌نام کرده‌اید؟ ورود به پنل کاربری'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ModelSelector = () => {
  const { isCompareMode, setCompareMode, selectedModels, toggleModel, lang } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const tCurr = t[lang] || t.fa;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-[14px] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        aria-expanded={isOpen}
      >
        <div className="flex -space-x-1 space-x-reverse">
          {selectedModels.map(id => {
            const model = MODELS.find(m => m.id === id);
            return (
              <div key={id} className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] border-2 border-white ${model?.color}`}>
                {model?.icon}
              </div>
            );
          })}
        </div>
        <span className="text-sm font-bold text-gray-900 mx-1">
          {isCompareMode ? 'حالت مقایسه' : MODELS.find(m => m.id === selectedModels[0])?.name}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-100 rounded-[28px] shadow-layered p-5 z-[60]"
          >
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-50">
              <span className="text-sm font-bold text-gray-800">انتخاب مدل هوشمند</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400">مقایسه</span>
                <button 
                  onClick={() => setCompareMode(!isCompareMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isCompareMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    animate={{ x: isCompareMode ? -22 : -2 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {MODELS.map(model => (
                <button
                  key={model.id}
                  disabled={model.deactivated}
                  onClick={() => toggleModel(model.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-[16px] transition-all group ${
                    selectedModels.includes(model.id) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  } ${model.deactivated ? 'opacity-35 cursor-not-allowed text-gray-300' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${model.color}`}>
                      {model.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{model.name}</p>
                      <p className="text-[10px] opacity-60">{model.deactivated ? 'بزودی در نسخه‌های آینده...' : 'توضیحات کوتاه مدل...'}</p>
                    </div>
                  </div>
                  {selectedModels.includes(model.id) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* High-fidelity content processing to strip raw markdown formatting and stylize headings & quotes nicely */
const formatAssistantResponse = (text) => {
  if (!text) return "";
  let cleanText = text;
  
  // Guard against disclosing the backend API or engine provider, maintaining strict branded identity
  const identitiesToMask = [
    /deepseek/gi,
    /د‌یپ‌سیک/g,
    /دیپسیک/g,
    /deep seek/gi
  ];
  identitiesToMask.forEach((regex) => {
    cleanText = cleanText.replace(regex, "چت‌چی لایت (ChatChee Light)");
  });

  // Clean raw markdown double asterisks for inline items to keep typography cohesive and premium
  cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, "$1");

  const lines = cleanText.split('\n');
  return lines.map((line, idx) => {
    // Convert section headers starting with hashes into proper styled headings
    if (line.trim().startsWith('###')) {
      return <h4 key={idx} className="text-md font-extrabold text-indigo-900 mt-4 mb-2">{line.replace(/###/g, '').trim()}</h4>;
    }
    if (line.trim().startsWith('##')) {
      return <h3 key={idx} className="text-lg font-black text-indigo-950 mt-5 mb-3">{line.replace(/##/g, '').trim()}</h3>;
    }
    if (line.trim().startsWith('#')) {
      return <h2 key={idx} className="text-xl font-black text-gray-950 mt-6 mb-4">{line.replace(/#/g, '').trim()}</h2>;
    }
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <ul key={idx} className="list-disc list-inside mr-4 my-1 text-gray-800 text-sm">
          <li>{line.trim().substring(2)}</li>
        </ul>
      );
    }
    return <p key={idx} className="mb-3 text-right dir-rtl leading-relaxed text-sm text-gray-850">{line}</p>;
  });
};

const Message = ({ msg, isLast }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showCritique, setShowCritique] = useState(false);
  const { toggleModel, setCompareMode } = useStore();
  const [showRightCompareAnswer, setShowRightCompareAnswer] = useState(false);

  useEffect(() => {
    if (msg.isCompare) {
      const timer = setTimeout(() => {
        setShowRightCompareAnswer(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isUser = msg.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col items-end mb-12 w-full text-right animate-none"
      dir="rtl"
    >
      {/* Dynamic Model Header Aligned to the Right consistently */}
      {!isUser && !msg.isCompare && (
        <div className="flex items-center gap-2 mb-4 w-full justify-end max-w-2xl ml-auto mr-0 text-right dir-rtl">
          <span className="text-xs font-bold text-gray-900">{MODELS.find(m => m.id === msg.model)?.name}</span>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm ${MODELS.find(m => m.id === msg.model)?.color || 'bg-black'}`}>
            {MODELS.find(m => m.id === msg.model)?.icon}
          </div>
        </div>
      )}

      {isUser ? (
        /* Task 5: User message bubble right-aligned and taking only content width, not full line */
        <div className="relative ml-auto mr-0 flex flex-col items-end w-full text-right dir-rtl">
          <div className="inline-block max-w-2xl bg-[#FAFAFA] text-black px-6 py-4 rounded-[var(--radius-card)] rounded-br-[4px] shadow-soft text-right dir-rtl border border-gray-100">
            <div className="prose prose-persian text-black text-right dir-rtl">
              {msg.content.split('\n').map((para, i) => (
                <p key={i} className="mb-0 text-right dir-rtl">{para}</p>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              title="کپی پیام"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : msg.isCompare ? (
        /* Task 4: Compare Mode responses rendered frameless without cards, borders, or boxes */
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-right dir-rtl mt-2">
          {/* Left Model Column */}
          <div className="space-y-3 relative group">
            <div className="flex items-center gap-2 mb-2 justify-end w-full">
              <span className="text-xs font-bold text-gray-900">{MODELS.find(m => m.id === msg.compareModelLeft)?.name}</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${MODELS.find(m => m.id === msg.compareModelLeft)?.color || 'bg-black'}`}>
                {MODELS.find(m => m.id === msg.compareModelLeft)?.icon}
              </div>
            </div>
            <div className="prose prose-persian text-gray-800 text-sm leading-relaxed text-right dir-rtl">
              {formatAssistantResponse(msg.compareContentLeft)}
            </div>
          </div>

          {/* Right Model Column with Shimmer Pre-Animation Shadow */}
          <div className="space-y-3 relative">
            <AnimatePresence mode="wait">
              {!showRightCompareAnswer ? (
                <motion.div 
                  key="shadow-loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="animate-pulse bg-transparent rounded-3xl p-4 h-full min-h-[140px] flex flex-col justify-between text-right"
                >
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200/60 rounded-full w-2/3 ml-auto mr-0" />
                    <div className="h-4 bg-gray-200/40 rounded-full w-full" />
                    <div className="h-4 bg-gray-200/30 rounded-full w-1/2 ml-auto mr-0" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold self-start animate-bounce text-right w-full block">در حال همگام‌سازی و تحلیل مدل دوم...</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="compare-answer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3 relative group text-right dir-rtl"
                >
                  <div className="flex items-center gap-2 mb-2 justify-end w-full">
                    <span className="text-xs font-bold text-gray-900">{MODELS.find(m => m.id === msg.compareModelRight)?.name}</span>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${MODELS.find(m => m.id === msg.compareModelRight)?.color || 'bg-black'}`}>
                      {MODELS.find(m => m.id === msg.compareModelRight)?.icon}
                    </div>
                  </div>
                  <div className="prose prose-persian text-gray-800 text-sm leading-relaxed text-right dir-rtl">
                    {formatAssistantResponse(msg.compareContentRight)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Standard Single AI Layout - RTL Right Flushed with Natural Polished Formatter */
        <div className="relative w-full max-w-2xl ml-auto mr-0 text-right dir-rtl">
          <div className="prose prose-persian text-gray-800 text-right dir-rtl">
            {formatAssistantResponse(msg.content)}
            
            {msg.image && (
              <div className="mt-4 rounded-[20px] overflow-hidden border border-gray-100">
                <img src={msg.image} alt="Generated" className="w-full h-auto" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><RefreshCcw className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-500 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
            <button 
              onClick={() => setShowCritique(!showCritique)} 
              className={`p-2 hover:bg-indigo-50 rounded-lg transition-colors ${showCritique ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
              title="نقد و بررسی"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showCritique && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-full right-0 mt-4 bg-white border border-gray-100 p-5 rounded-[24px] shadow-layered z-40 w-72"
              >
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-right">نقد با مدل دیگر</h4>
                <div className="space-y-1">
                  {MODELS.filter(m => m.id !== msg.model && !m.deactivated).map(m => (
                    <button 
                      key={m.id}
                      onClick={() => {
                        setCompareMode(true);
                        toggleModel(m.id);
                        setShowCritique(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-right justify-end"
                    >
                      <span className="text-sm font-medium mr-auto ml-0">{m.name}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${m.color}`}>{m.icon}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

const Sidebar = () => {
  const { 
    isSidebarOpen, toggleSidebar, history, clearChat, user, setView, setAuth, lang,
    setSearchOpen, setSettingsOpen, setRenameChatId, setDeleteChatId, togglePinChat
  } = useStore();

  const isSearchOpen = useStore(s => s.isSearchOpen);
  const isSettingsOpen = useStore(s => s.isSettingsOpen);
  const activeSettingsTab = useStore(s => s.activeSettingsTab);
  const renameChatId = useStore(s => s.renameChatId);
  const deleteChatId = useStore(s => s.deleteChatId);
  const theme = useStore(s => s.theme);
  const narrator = useStore(s => s.narrator);
  const voiceFullscreenMode = useStore(s => s.voiceFullscreenMode);

  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profilePopupRef = useRef(null);
  const tCurr = t[lang] || t.fa;

  const [fastAnswers, setFastAnswers] = useState(true);
  const [refMemories, setRefMemories] = useState(true);
  const [refHistory, setRefHistory] = useState(true);
  const [webSearch, setWebSearch] = useState(false);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [advVoice, setAdvVoice] = useState(false);
  
  const [locationOn, setLocationOn] = useState(false);
  const [isArchiveManagerOpen, setIsArchiveManagerOpen] = useState(false);
  const [isArchiveAllConfirmOpen, setIsArchiveAllConfirmOpen] = useState(false);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);

  const [isTrustedDevicesOpen, setIsTrustedDevicesOpen] = useState(false);
  const [trustedDevicesList, setTrustedDevicesList] = useState([
    { id: '1', name: 'مرورگر کروم روی سیستم‌عامل مک (دستگاه فعلی)', lastLogin: 'هم‌اکنون فعال' },
    { id: '2', name: 'آیفون ۱۵ پرو - مرورگر سافاری', lastLogin: 'دیروز، ساعت ۱۲:۴۰' }
  ]);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authenticatorApp, setAuthenticatorApp] = useState(false);
  const [textMessageMfa, setTextMessageMfa] = useState(true); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        setProfilePopupOpen(false);
      }
    };
    if (profilePopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profilePopupOpen]);

  const pinnedChats = useMemo(() => history.filter(h => h.pinned), [history]);
  const todayChats = useMemo(() => history.filter(h => h.group === 'امروز' && !h.pinned), [history]);
  const yesterdayChats = useMemo(() => history.filter(h => h.group === 'دیروز' && !h.pinned), [history]);

  return (
    <>
      <motion.aside 
        animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-full bg-[var(--sidebar-bg)] border-l border-[var(--border)] flex flex-col relative z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">چت‌چی </span>
          </div>
        </div>

        <div className="px-6 space-y-3">
          <Button onClick={clearChat} className="w-full h-14 rounded-[18px] shadow-soft bg-black text-white">
            <Plus className="w-5 h-5" />
            <span>{tCurr.newChat}</span>
          </Button>

          <button 
            onClick={() => setSearchOpen(true)}
            className="w-full h-12 bg-white border border-gray-100 rounded-[18px] px-4 flex items-center justify-between text-gray-400 hover:border-gray-200 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">{tCurr.searchPlaceholder}</span>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-8 px-4 custom-scrollbar">
          <div className="space-y-8">
            
            {pinnedChats.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
                  <Pin className="w-3 h-3 rotate-45" />
                  {tCurr.pinned}
                </h4>
                <div className="space-y-1">
                  {pinnedChats.map(item => (
                    <div key={item.id} className="group relative flex items-center w-full">
                      <button 
                        className="w-full text-right p-3.5 pl-12 rounded-[16px] text-[14px] font-bold text-indigo-600 bg-indigo-50/50 overflow-hidden whitespace-nowrap block sidebar-chat-btn"
                      >
                        {item.title}
                      </button>
                      
                      <div className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button 
                          onClick={() => togglePinChat(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-indigo-500 shadow-sm transition-colors"
                          title="برداشتن سنجاق"
                        >
                          <Pin className="w-3.5 h-3.5 rotate-45" />
                        </button>
                        <button 
                          onClick={() => setRenameChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                          title="تغییر نام"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-colors" 
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {todayChats.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 mr-2 uppercase tracking-widest">{tCurr.today}</h4>
                <div className="space-y-1">
                  {todayChats.map(item => (
                    <div key={item.id} className="group relative flex items-center w-full">
                      <button 
                        className="w-full text-right p-3.5 pl-12 rounded-[16px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all overflow-hidden whitespace-nowrap block sidebar-chat-btn"
                      >
                        {item.title}
                      </button>

                      <div className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button 
                          onClick={() => togglePinChat(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                          title="سنجاق کردن"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setRenameChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                          title="تغییر نام"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-colors" 
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {yesterdayChats.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 mr-2 uppercase tracking-widest">{tCurr.yesterday}</h4>
                <div className="space-y-1">
                  {yesterdayChats.map(item => (
                    <div key={item.id} className="group relative flex items-center w-full">
                      <button 
                        className="w-full text-right p-3.5 pl-12 rounded-[16px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all overflow-hidden whitespace-nowrap block sidebar-chat-btn"
                      >
                        {item.title}
                      </button>

                      <div className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button 
                          onClick={() => togglePinChat(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                          title="سنجاق کردن"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setRenameChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                          title="تغییر نام"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteChatId(item.id)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-colors" 
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setView('pricing')}
            className="w-full flex items-center justify-between p-4 rounded-[20px] bg-indigo-50 hover:bg-indigo-100 transition-all mb-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                <Crown className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-indigo-900">ارتقا به پرو</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">امکانات نامحدود</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="relative" ref={profilePopupRef}>
            <AnimatePresence>
              {profilePopupOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute bottom-full right-0 left-0 mb-3 bg-white border border-gray-100 rounded-[24px] shadow-layered p-4 z-[60]"
                >
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                      {user?.name ? user.name[0] : 'م'}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{user?.name || 'مهمان چت‌چی'}</p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {user?.email === 'guest@dimoon.ai' ? 'طرح رایگان چت‌چی' : '۰۹۱۲۳۴۵۶۷۸۹'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-100 my-3" />
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => { setView('pricing'); setProfilePopupOpen(false); }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-right text-sm font-semibold text-indigo-600 transition-colors"
                    >
                      <span>ارتقای اشتراک چت‌چی</span>
                      <Crown className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => { setSettingsOpen(true); setProfilePopupOpen(false); }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-right text-sm font-semibold text-gray-700 transition-colors"
                    >
                      <span>تنظیمات سیستم</span>
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={() => { setAuth(null); setProfilePopupOpen(false); }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50 text-right text-sm font-semibold text-red-600 transition-colors"
                    >
                      <span>خروج از حساب</span>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setProfilePopupOpen(!profilePopupOpen)}
              className="w-full flex items-center justify-between p-3 rounded-[20px] hover:bg-gray-100 transition-all text-[var(--text-primary)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black border-4 border-white shadow-sm">
                  {user?.name ? user.name[0] : 'م'}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold leading-none">{user?.name || 'کاربر چت‌چی'}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">پنل کاربری</p>
                </div>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isSearchOpen && (
          <div 
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-white rounded-[var(--radius-modal)] border border-zinc-100 shadow-layered overflow-hidden"
            >
              <button 
                onClick={() => setSearchOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8">
                <div className="flex items-center gap-4 bg-gray-50 rounded-[20px] px-5 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <Search className="text-gray-400 w-5 h-5" />
                  <input autoFocus placeholder="جستجو در تمام گفتگوها..." className="w-full bg-transparent outline-none text-lg py-3 font-medium text-[var(--text-primary)]" />
                </div>
                <div className="mt-8 space-y-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 text-right">جستجوهای اخیر</h3>
                  <div className="space-y-1">
                    {history.slice(0, 3).map(h => (
                      <button key={h.id} className="w-full text-right p-4 hover:bg-gray-50 rounded-2xl flex items-center justify-between group transition-colors text-[var(--text-primary)]">
                        <div className="flex items-center gap-4">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{h.title}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Settings Modal Container */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div 
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white border border-zinc-100 rounded-[var(--radius-modal)] shadow-layered overflow-hidden flex flex-col md:flex-row h-[560px]"
            >
              <button 
                onClick={() => setSettingsOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-[100]"
                aria-label="بستن تنظیمات"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-56 bg-gray-50/80 border-l border-gray-100 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-6 mr-2 text-right">{tCurr.settingsTitle}</h3>
                  <div className="space-y-1">
                    {[
                      { id: 'general', label: tCurr.general },
                      { id: 'personalization', label: tCurr.personalization },
                      { id: 'usage', label: tCurr.usage },
                      { id: 'security', label: tCurr.security },
                      { id: 'data_control', label: tCurr.dataControl || 'کنترل داده‌ها' },
                      { id: 'account', label: tCurr.account }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => useStore.getState().setActiveSettingsTab(tab.id)}
                        className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                          activeSettingsTab === tab.id 
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/10' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col justify-between text-right relative">
                <div className="space-y-6">
                  {activeSettingsTab === 'general' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">تنظیمات عمومی سیستم</h4>
                      <div className="space-y-4">
                        
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
                          <span className="text-xs font-bold text-gray-700">{tCurr.langLabel}</span>
                          <select 
                            value={lang}
                            onChange={(e) => useStore.getState().setLang(e.target.value)}
                            className="bg-white border border-zinc-200 rounded-xl p-3 text-xs font-bold outline-none text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
                          >
                            <option value="fa">فارسی (Persian)</option>
                            <option value="en">English (LTR)</option>
                            <option value="ar">العربية (Arabic)</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
                          <span className="text-xs font-bold text-gray-700">{tCurr.narratorLabel}</span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: 'arash', name: 'آرش' },
                              { id: 'sara', name: 'سارا' },
                              { id: 'maryam', name: 'مریم' },
                              { id: 'omid', name: 'امید' }
                            ].map(vc => (
                              <button 
                                key={vc.id} 
                                onClick={() => useStore.getState().setNarrator(vc.id)}
                                className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${narrator === vc.id ? 'border-indigo-600 bg-indigo-50 text-indigo-750' : 'border-zinc-200 text-zinc-600'}`}
                              >
                                {vc.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">{tCurr.voiceOptionLabel}</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">{tCurr.voiceOptionSubtitle}</span>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => useStore.getState().setVoiceFullscreenMode(!voiceFullscreenMode)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${voiceFullscreenMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div 
                              animate={{ x: voiceFullscreenMode ? -20 : -2 }}
                              className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'personalization' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">شخصی‌سازی تجربه کاربری</h4>
                      <div className="space-y-4">
                        
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1.5 mr-1 text-right">سبک و لحن پایه</label>
                          <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold outline-none text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer">
                            <option value="default">پیش‌فرض</option>
                            <option value="professional">حرفه‌ای</option>
                            <option value="friendly">صمیمی</option>
                            <option value="candid">رک و صریح</option>
                            <option value="quirky">عجیب و متفاوت</option>
                            <option value="efficient">مختصر و کارآمد</option>
                            <option value="cynical">کنایه‌آمیز</option>
                          </select>
                        </div>

                        <div className="space-y-3 pt-2">
                          <p className="text-xs font-bold text-gray-455 mr-1 text-right">ویژگی‌ها</p>
                          <p className="text-[10px] text-gray-400 mr-1 -mt-1 text-right">تنظیمات تکمیلی را برای شخصی‌سازی سبک و لحن پاسخ‌ها انتخاب کنید.</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[11px] font-bold text-gray-500 mr-1">صمیمیت (گرم)</span>
                              <select className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer">
                                <option>پیش‌فرض</option>
                                <option>کم</option>
                                <option>متوسط</option>
                                <option>زیاد</option>
                              </select>
                            </div>
                            
                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[11px] font-bold text-gray-500 mr-1">اشتیاق (پرشور)</span>
                              <select className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer">
                                <option>پیش‌فرض</option>
                                <option>کم</option>
                                <option>متوسط</option>
                                <option>زیاد</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[11px] font-bold text-gray-500 mr-1">سربرگ‌ها و لیست‌ها</span>
                              <select className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer">
                                <option>مختصر</option>
                                <option>مفصل</option>
                                <option>استاندارد</option>
                                <option>فشرده با فرمت Markdown</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[11px] font-bold text-gray-500 mr-1">شکلک (ایموجی)</span>
                              <select className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer">
                                <option>بدون ایموجی</option>
                                <option>حداقل</option>
                                <option>استاندارد</option>
                                <option>زیاد</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">پاسخ‌های سریع</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">
                              چت‌چی گاهی اوقات می‌تواند از دانش عمومی خود برای ارائه پاسخ‌های سریع و عمیق استفاده کند. این پاسخ‌ها شخصی‌سازی نمی‌شوند و از حافظه ذخیره‌شده شما استفاده نمی‌کنند.
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFastAnswers(!fastAnswers)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${fastAnswers ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div 
                              animate={{ x: fastAnswers ? -20 : -2 }}
                              className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1.5 mr-1 text-right">دستورالعمل‌های سفارشی</label>
                          <textarea 
                            rows={3}
                            placeholder="ترجیحات تکمیلی در مورد رفتار، سبک و لحن پاسخ‌دهی"
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-medium outline-none text-[var(--text-primary)] placeholder:text-gray-300 resize-none text-right"
                          />
                        </div>

                        <div className="space-y-3 pt-4">
                          <h5 className="text-xs font-bold text-gray-505 mr-1 text-right">درباره شما</h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-right">
                              <span className="text-[11px] font-bold text-gray-400 mr-1">نام مستعار</span>
                              <input type="text" placeholder="مثال: مانی" className="w-full mt-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] text-right" />
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-bold text-gray-400 mr-1">شغل</span>
                              <input type="text" placeholder="مثال: طراح رابط کاربری" className="w-full mt-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] text-right" />
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-gray-400 mr-1">توضیحات بیشتر درباره شما</span>
                            <textarea rows={2} placeholder="توضیحات تکمیلی..." className="w-full mt-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-primary)] resize-none text-right" />
                          </div>
                        </div>

                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl gap-4 mt-2">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">ارجاع به حافظه‌های ذخیره شده</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">
                              به چت‌چی اجازه دهید هنگام پاسخ‌دهی خاطرات و ترجیحات شما را ذخیره کرده و به آن‌ها ارجاع دهد.
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setRefMemories(!refMemories)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${refMemories ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div 
                              animate={{ x: refMemories ? -20 : -2 }}
                              className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl gap-4 mt-2">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">ارجاع به تاریخچه گفتگوها</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">
                              به چت‌چی اجازه دهید برای پاسخ‌دهی بهتر، به تمام گفتگوهای قبلی شما رجوع کند.
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setRefHistory(!refHistory)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${refHistory ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div 
                              animate={{ x: refHistory ? -20 : -2 }}
                              className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        <div className="space-y-3 pt-4">
                          <h5 className="text-xs font-bold text-gray-550 mr-1 text-right">تنظیمات پیشرفته</h5>
                          
                          <div className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl gap-4">
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-gray-700">جستجوی وب</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">به چت‌چی اجازه دهید به صورت خودکار برای یافتن پاسخ‌ها در وب جستجو کند.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setWebSearch(!webSearch)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${webSearch ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                              <motion.div animate={{ x: webSearch ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                          </div>

                          <div className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl gap-4">
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-gray-700">بوم چت‌چی (Canvas)</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">همکاری تعاملی با چت‌چی روی متون و قطعه کدهای طولانی.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setCanvasEnabled(!canvasEnabled)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${canvasEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                              <motion.div animate={{ x: canvasEnabled ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                          </div>

                          <div className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl gap-4">
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-gray-700">دستیار صوتی چت‌چی</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">فعال‌سازی گفتگو و ارتباط صوتی در چت‌چی.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setVoiceEnabled(!voiceEnabled)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${voiceEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                              <motion.div animate={{ x: voiceEnabled ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                          </div>

                          <div className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl gap-4">
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-gray-700">صدای پیشرفته تعاملی</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">مکالمه طبیعی‌تر، هوشمندتر و بدون تأخیر در بخش صوتی.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setAdvVoice(!advVoice)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${advVoice ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                              <motion.div animate={{ x: advVoice ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'usage' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">اشتراک و جزئیات مصرف منابع</h4>
                      <div className="space-y-4">
                        <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-indigo-900">{tCurr.upgradeTitle}</span>
                            <span className="text-xs font-black text-white bg-indigo-600 px-3 py-1 rounded-full">{tCurr.freePlan}</span>
                          </div>
                          <p className="text-[11px] text-indigo-600/80 leading-relaxed text-right">{tCurr.upgradePrompt}</p>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>{tCurr.usageLimit}</span>
                            <span>۷۵۰ از ۱,۰۰۰ پیام</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '75%' }} />
                          </div>
                          <p className="text-[10px] text-gray-400">تاریخ تمدید دوره‌ای اشتراک: ۱۴ روز آینده</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'security' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">تنظیمات امنیت حساب</h4>
                      <div className="space-y-4">
                        
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">رمز عبور</span>
                            <span className="text-xs text-gray-400 mt-1">••••••••</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setIsPasswordChangeOpen(true)}
                            className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            تغییر رمز عبور
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">اپلیکیشن تایید هویت</span>
                            <span className="text-[10px] text-gray-400 mt-1">استفاده از کدهای یک‌بار مصرف از یک اپلیکیشن تایید هویت.</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setAuthenticatorApp(!authenticatorApp)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${authenticatorApp ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div animate={{ x: authenticatorApp ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">پیامک متنی (فعال به‌صورت پیش‌فرض)</span>
                            <span className="text-[10px] text-gray-400 mt-1">دریافت کدهای تایید ۶ رقمی از طریق پیامک یا واتس‌اپ بر اساس پیش‌شماره کشور.</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setTextMessageMfa(!textMessageMfa)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${textMessageMfa ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <motion.div animate={{ x: textMessageMfa ? -20 : -2 }} className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">دستگاه‌های قابل اعتماد</span>
                            <span className="text-[10px] text-gray-400 mt-1">پس از ورود به حساب کاربری، دستگاه شما به عنوان یک دستگاه قابل اعتماد ثبت می‌شود.</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsTrustedDevicesOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            <span>{trustedDevicesList.length} دستگاه</span>
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">خروج از این دستگاه</span>
                            <span className="text-[10px] text-gray-400 mt-1">نشست فعلی خود را روی این دستگاه با ایمنی کامل ببندید.</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setAuth(null)}
                            className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            خروج از دستگاه
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4 border border-red-100">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-red-600">خروج از تمامی دستگاه‌ها</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">
                              خروج از تمامی نشست‌های فعال در همه دستگاه‌ها، از جمله نشست فعلی شما. خروج سایر دستگاه‌ها ممکن است تا ۳۰ دقیقه زمان ببرد.
                            </span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setAuth(null)}
                            className="px-4 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            خروج از همه
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'data_control' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">کنترل داده‌ها</h4>
                      <div className="space-y-4">
                        
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">موقعیت مکانی</span>
                            <span className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-sm">
                              با فعال‌سازی این بخش، موقعیت مکانی شما به چت‌چی کمک می‌کند تا اطلاعات مرتبط‌تری مانند آب‌وهوا، اخبار محلی و پیشنهادات نزدیک به شما را ارائه دهد.
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setLocationOn(!locationOn)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap ${locationOn ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          >
                            {locationOn ? 'روشن' : 'فعال‌سازی'}
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">گفتگوهای بایگانی‌شده</span>
                            <span className="text-[10px] text-gray-400 mt-1">مدیریت تمام گفتگوهای منتقل شده به بخش بایگانی</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsArchiveManagerOpen(true)}
                            className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            مدیریت بایگانی
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">بایگانی کردن تمام گفتگوها</span>
                            <span className="text-[10px] text-gray-400 mt-1">انتقال فوری تمامی تاریخچه‌های چت به پوشه بایگانی</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsArchiveAllConfirmOpen(true)}
                            className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            بایگانی همه
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4 border border-red-100">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-red-600">حذف دائمی تمام گفتگوها</span>
                            <span className="text-[10px] text-gray-400 mt-1">پاک کردن دائمی تمامی چت‌ها به طور کامل و غیرقابل بازگشت</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsDeleteAllConfirmOpen(true)}
                            className="px-4 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            حذف همه
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-gray-700">خروجی گرفتن از کل داده‌ها</span>
                            <span className="text-[10px] text-gray-400 mt-1">تهیه فایل فشرده حاوی تمام اطلاعات حساب و تاریخچه گفتگوها</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsExportConfirmOpen(true)}
                            className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            دریافت خروجی
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'account' && (
                    <div className="space-y-5">
                      <h4 className="text-md font-bold text-gray-900 mb-2">حساب کاربری</h4>
                      <div className="space-y-4">
                        
                        <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                          <label className="text-xs font-bold text-gray-700 block mr-1 text-right">نام و نام خانوادگی</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              defaultValue={user?.name || 'مهمان چت‌چی'} 
                              id="account-name-field"
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[var(--text-primary)] text-right" 
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const el = document.getElementById('account-name-field');
                                if (el) {
                                  useStore.getState().setAuth({ ...user, name: el.value });
                                }
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                            >
                              تغییر نام
                            </button>
                          </div>
                        </div>

                        <div className="p-4 border border-red-100 bg-red-50/50 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-red-600 block text-right">{tCurr.deleteAccount}</span>
                            <span className="text-[10px] text-gray-400 mt-1 block text-right">{tCurr.deleteAccountDesc}</span>
                          </div>
                          <button 
                            onClick={() => setDeleteChatId('delete-account-confirm')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-none whitespace-nowrap"
                          >
                            حذف حساب
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-4">
                  <Button variant="outline" className="h-10 text-xs px-4 rounded-xl" onClick={() => setSettingsOpen(false)}>{tCurr.cancel}</Button>
                  <Button variant="primary" className="h-10 text-xs px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700" onClick={() => setSettingsOpen(false)}>{tCurr.save}</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Screen Popups Block */}
      <AnimatePresence>
        {isArchiveManagerOpen && (
          <div 
            onClick={() => setIsArchiveManagerOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white border border-zinc-100 rounded-[32px] shadow-layered p-8 text-right"
            >
              <button 
                onClick={() => setIsArchiveManagerOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between border-b pb-4 w-full">
                  <h5 className="font-bold text-gray-900 text-lg text-right w-full">گفتگوهای بایگانی‌شده</h5>
                </div>
                
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 font-bold text-sm">
                  <History className="w-12 h-12 mb-3 text-gray-300" />
                  <span>شما هیچ گفتگوی بایگانی‌شده‌ای ندارید.</span>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t mt-4">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsArchiveManagerOpen(false)}>بستن پنجره</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTrustedDevicesOpen && (
          <div 
            onClick={() => setIsTrustedDevicesOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[32px] w-full max-w-md shadow-layered text-right"
            >
              <button 
                onClick={() => setIsTrustedDevicesOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h5 className="font-black text-gray-900 text-lg mb-4 text-right">دستگاه‌های قابل اعتماد</h5>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 text-right">
                پس از ورود به حساب کاربری، دستگاه شما به عنوان یک دستگاه قابل اعتماد ثبت می‌شود. هنگام ورود از یک موقعیت جدید، پیامی جهت تأیید به دستگاه‌های قابل اعتماد شما ارسال خواهد شد. شما می‌توانید در هر زمان دستگاهی را از این لیست حذف کنید.
              </p>
              
              <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar">
                {trustedDevicesList.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <button 
                      onClick={() => setTrustedDevicesList(prev => prev.filter(d => d.id !== device.id))}
                      className="p-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all border border-gray-100"
                      title="حذف دستگاه"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{device.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{device.lastLogin}</p>
                    </div>
                  </div>
                ))}
                {trustedDevicesList.length === 0 && (
                  <p className="text-xs text-center text-gray-400 py-4">هیچ دستگاه قابل اعتمادی ثبت نشده است.</p>
                )}
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsTrustedDevicesOpen(false)}>بستن</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPasswordChangeOpen && (
          <div 
            onClick={() => setIsPasswordChangeOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[32px] w-full max-w-sm shadow-layered text-right"
            >
              <button 
                onClick={() => setIsPasswordChangeOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h5 className="font-black text-gray-900 text-lg mb-4 text-right">تغییر رمز عبور</h5>
              
              <div className="space-y-4">
                <div className="text-right">
                  <label className="text-xs font-bold text-gray-500 mr-1 block mb-1 text-right">رمز عبور فعلی</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none text-[var(--text-primary)] text-right" 
                  />
                </div>
                <div className="text-right">
                  <label className="text-xs font-bold text-gray-500 mr-1 block mb-1 text-right">رمز عبور جدید</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none text-[var(--text-primary)] text-right" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsPasswordChangeOpen(false)}>انصراف</Button>
                <Button variant="primary" className="h-10 text-xs rounded-xl bg-indigo-600 text-white" onClick={() => setIsPasswordChangeOpen(false)}>تایید تغییر</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isArchiveAllConfirmOpen && (
          <div 
            onClick={() => setIsArchiveAllConfirmOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[24px] w-full max-w-sm shadow-layered text-right"
            >
              <button 
                onClick={() => setIsArchiveAllConfirmOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h5 className="font-black text-gray-900 text-md mb-2 text-right">بایگانی همه گفتگوها؟</h5>
              <p className="text-xs text-gray-400 mb-6 text-right">آیا مطمئن هستید که می‌خواهید تمام گفتگوهای خود را بایگانی کنید؟</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsArchiveAllConfirmOpen(false)}>انصراف</Button>
                <Button variant="primary" className="h-10 text-xs rounded-xl bg-indigo-600 text-white" onClick={() => setIsArchiveAllConfirmOpen(false)}>تایید بایگانی</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteAllConfirmOpen && (
          <div 
            onClick={() => setIsDeleteAllConfirmOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[24px] w-full max-w-sm shadow-layered text-right"
            >
              <button 
                onClick={() => setIsDeleteAllConfirmOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h5 className="font-black text-red-600 text-md mb-2 text-right">حذف تمام گفتگوها؟</h5>
              <p className="text-xs text-gray-400 mb-6 text-right">این عمل غیرقابل بازگشت است و تمامی گفتگوها برای همیشه پاک خواهند شد.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsDeleteAllConfirmOpen(false)}>انصراف</Button>
                <Button variant="danger" className="h-10 text-xs rounded-xl bg-red-600 text-white border-none" onClick={() => {
                  clearChat();
                  useStore.setState({ history: [] });
                  setIsDeleteAllConfirmOpen(false);
                }}>تایید حذف کامل</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExportConfirmOpen && (
          <div 
            onClick={() => setIsExportConfirmOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[32px] w-full max-w-md shadow-layered text-right"
            >
              <button 
                onClick={() => setIsExportConfirmOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h5 className="font-black text-gray-900 text-md mb-3 text-right">خروجی داده‌ها</h5>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 space-y-2 text-right">
                جزئیات حساب کاربری و گفتگوهای شما در فایل خروجی قرار خواهند گرفت. این اطلاعات به صورت یک فایل قابل دانلود به ایمیل ثبت‌شده شما ارسال می‌شود. لینک دانلود ۲۴ ساعت پس از دریافت منقضی خواهد شد. فرآیند آماده‌سازی ممکن است زمان‌بر باشد و پس از اتمام به شما اطلاع‌رسانی می‌شود. برای ادامه، بر روی دکمه «تأیید خروجی» کلیک کنید.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsExportConfirmOpen(false)}>انصراف</Button>
                <Button variant="primary" className="h-10 text-xs rounded-xl bg-indigo-600 text-white" onClick={() => setIsExportConfirmOpen(false)}>تایید خروجی</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {renameChatId && (
          <div 
            onClick={() => setRenameChatId(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[var(--radius-modal)] w-full max-w-md shadow-layered text-right"
            >
              <button 
                onClick={() => setRenameChatId(null)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black text-gray-900 mb-2 text-right">{tCurr.renameTitle}</h3>
              <p className="text-xs font-medium text-gray-400 mb-4 text-right">عنوان مناسبی برای دسترسی سریع‌تر انتخاب کنید.</p>
              
              <input 
                autoFocus
                type="text"
                placeholder={tCurr.renamePlaceholder}
                className="w-full bg-gray-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 mb-6 text-right"
                defaultValue={history.find(h => h.id === renameChatId)?.title || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    useStore.getState().renameChat(renameChatId, e.currentTarget.value);
                    setRenameChatId(null);
                  }
                }}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setRenameChatId(null)}>{tCurr.cancel}</Button>
                <Button 
                  variant="primary" 
                  className="h-10 text-xs rounded-xl bg-indigo-600 text-white" 
                  onClick={() => {
                    const inp = document.querySelector('input[placeholder="' + tCurr.renamePlaceholder + '"]');
                    if (inp) {
                      useStore.getState().renameChat(renameChatId, inp.value);
                    }
                    setRenameChatId(null);
                  }}
                >
                  {tCurr.save}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteChatId && (
          <div 
            onClick={() => setDeleteChatId(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[var(--radius-modal)] w-full max-w-md shadow-layered text-right"
            >
              <button 
                onClick={() => setDeleteChatId(null)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 mr-0 ml-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2 text-right">{tCurr.deleteConfirmTitle}</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed text-right">{tCurr.deleteConfirmDesc}</p>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setDeleteChatId(null)}>{tCurr.cancel}</Button>
                <Button 
                  variant="danger" 
                  className="h-10 text-xs rounded-xl bg-red-600 text-white hover:bg-red-700 border-none" 
                  onClick={() => {
                    useStore.getState().deleteChat(deleteChatId);
                    setDeleteChatId(null);
                  }}
                >
                  {tCurr.sureDeleteBtn}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const ASPECT_RATIOS = [
  { id: 'auto', label: 'خودکار', desc: '', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="12" x="3" y="6" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ) },
  { id: '1:1', label: 'مربع', ratio: '1:1', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="5" y="5" rx="1.5" /></svg>
  ) },
  { id: '3:4', label: 'پرتره', ratio: '3:4', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="11" height="16" x="6.5" y="4" rx="1.5" /></svg>
  ) },
  { id: '9:16', label: 'استوری', ratio: '9:16', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="10" height="18" x="7" y="3" rx="1.5" /></svg>
  ) },
  { id: '4:3', label: 'لندسکیپ', ratio: '4:3', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="12" x="4" y="6" rx="1.5" /></svg>
  ) },
  { id: '16:9', label: 'عریض', ratio: '16:9', icon: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="10" x="3" y="7" rx="1.5" /></svg>
  ) },
];

const STYLES = [
  { id: 'cyberpunk', label: 'سایبرپانک (Cyberpunk)', prompt: 'سبک بصری سایبرپانک، نورهای نئونی درخشان، اتمسفر آینده‌نگرانه شهری تیره و تکنولوژیک، رنگ‌های بنفش و صورتی نئون' },
  { id: 'anime', label: 'انیمه (Anime)', prompt: 'سبک هنری انیمه ژاپنی مدرن، با کیفیت بالا، جزئیات ظریف، رنگ‌های زنده و پرانرژی و پس‌زمینه نقاشی دستی نوستالژیک' },
  { id: 'dramatic', label: 'پرتره دراماتیک (Dramatic Headshot)', prompt: 'عکاسی پرتره استودیویی تاریک و احساسی با کنتراست نوری شدید و سایه‌های عمیق سایه روشن، واقع‌گرایانه با جزئیات بالا' },
  { id: 'coloring', label: 'کتاب رنگ‌آمیزی (Coloring Book)', prompt: 'طرح خطی ساده و تمیز کتاب رنگ‌آمیزی کودکان، بدون رنگ، خطوط مشکی ضخیم روی زمینه سفید خالص، بدون سایه' },
  { id: 'photoshoot', label: 'عکاسی حرفه‌ای (Photo Shoot)', prompt: 'عکاسی تجاری استودیویی فوق‌العاده باکیفیت با دوربین حرفه‌ای، فوکوس عمیق، بافت پوست طبیعی و نورپردازی ملایم تجاری' },
  { id: 'retro', label: 'کارتون قدیمی (Retro Cartoon)', prompt: 'طراحی فانتزی کارتون‌های کلاسیک دهه ۱۹۵۰ با بافت چاپی قدیمی، رنگ‌های اشباع‌شده گرم و افکت‌های چاپی نوستالژیک' },
  { id: '80s', label: 'زرق و برق دهه ۸۰ (80s Glam)', prompt: 'مد روز پر زرق و برق و فانتزی دهه ۱۹۸۰ با پالت رنگ‌های تند پاستلی، رترو فیوچریسم، موهای حجوم و جلوه‌های نوری طلایی' },
  { id: 'nouveau', label: 'آرت نوو (Art Nouveau)', prompt: 'طراحی تزئینی به سبک آرت نوو، الگوهای مواج گیاهی و ارگانیک، خطوط منحنی ظریف الهام گرفته از طبیعت و پالت رنگ‌های خاکی گرم' },
  { id: 'synthwave', label: 'سینت‌ویو (Synthwave)', prompt: 'هنر دیجیتالی سینت‌ویو دهه ۸۰ میلادی، غروب خورشید شبکه‌ای، خطوط رترو وکتور، کوه‌های افق بنفش تیره و فضای سایبر آینده‌نگر' },
];

const Composer = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  
  // Image Tag Workflow States
  const [hasImageTag, setHasImageTag] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('auto');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isAspectOpen, setIsAspectOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  // Additional Helper Tag Modes (Smart Thinking, Deep Research, Web Search, Canvas)
  const [hasThinkingTag, setHasThinkingTag] = useState(false);
  const [hasResearchTag, setResearchTag] = useState(false);
  const [hasWebSearchTag, setWebSearchTag] = useState(false);
  const [hasCanvasTag, setCanvasTag] = useState(false);

  // Deep Research Websites Options States
  const [isResearchSitesOpen, setIsResearchSitesOpen] = useState(false);
  const [searchTargetType, setSearchTargetType] = useState('broad'); // 'broad' or 'specific'
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [siteUrlInput, setSiteUrlInput] = useState('');
  const [addedWebsites, setAddedWebsites] = useState([]);
  const [urlValidationError, setUrlValidationError] = useState('');

  const { addMessage, selectedModels, isThinking, setThinking, tempMode, isCompareMode, lang } = useStore();
  
  const fileInputRef = useRef(null);
  const toolsRef = useRef(null);
  const aspectRef = useRef(null);
  const styleRef = useRef(null);
  const researchSitesRef = useRef(null);
  const tCurr = t[lang] || t.fa;

  useEffect(() => {
    const handleTriggerImageTag = () => {
      setHasImageTag(true);
      setHasThinkingTag(false);
      setResearchTag(false);
      setWebSearchTag(false);
      setCanvasTag(false);
    };
    window.addEventListener('trigger-image-tag', handleTriggerImageTag);
    return () => window.removeEventListener('trigger-image-tag', handleTriggerImageTag);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
      if (aspectRef.current && !aspectRef.current.contains(event.target)) {
        setIsAspectOpen(false);
      }
      if (styleRef.current && !styleRef.current.contains(event.target)) {
        setIsStyleOpen(false);
      }
      if (researchSitesRef.current && !researchSitesRef.current.contains(event.target)) {
        setIsResearchSitesOpen(false);
      }
    };
    if (isToolsOpen || isAspectOpen || isStyleOpen || isResearchSitesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolsOpen, isAspectOpen, isStyleOpen, isResearchSitesOpen]);

  const queryDeepSeekAPI = async (promptText) => {
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: promptText }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`خطای سرور: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "خطایی در دریافت پاسخ از سرور رخ داد.";
    } catch (err) {
      console.error("DeepSeek API error:", err);
      return `پاسخ شبیه‌سازی‌شده (درخواست آفلاین): در حال بررسی پیام شما هستیم. سیستم چت‌چی نسخه ۲.۰ آماده خدمت‌رسانی است.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    let finalQuery = input;
    if (hasImageTag) {
      const aspectStr = selectedAspectRatio !== 'auto' ? ` با نسبت تصویر ${selectedAspectRatio}` : '';
      const styleStr = selectedStyle ? ` در سبک هنر بصری ${STYLES.find(s => s.id === selectedStyle)?.label}` : '';
      finalQuery = `[تولید تصویر] ${input}${aspectStr}${styleStr}`;
    } else {
      let prefix = "";
      if (hasThinkingTag) prefix += "[تفکر هوشمند] ";
      if (hasResearchTag) {
        prefix += "[تحقیق عمیق] ";
        if (searchTargetType === 'specific' && addedWebsites.length > 0) {
          prefix += `(محدود به سایت‌های: ${addedWebsites.join(', ')}) `;
        }
      }
      if (hasWebSearchTag) prefix += "[جستجوی وب] ";
      if (hasCanvasTag) prefix += "[بوم Canvas] ";
      finalQuery = `${prefix}${input}`;
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: finalQuery,
      attachments: attachments,
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      isCompare: isCompareMode
    };
    
    addMessage(userMsg);
    setInput('');
    setAttachments([]);
    setHasImageTag(false);
    setHasThinkingTag(false);
    setResearchTag(false);
    setWebSearchTag(false);
    setCanvasTag(false);
    setAddedWebsites([]);
    setSearchTargetType('broad');
    setSelectedAspectRatio('auto');
    setSelectedStyle(null);
    setThinking(true);

    const isDimoonLightSelected = selectedModels[0] === 'dimoon-light';

    if (isCompareMode) {
      const liveLeftAPIResponse = await queryDeepSeekAPI(finalQuery);
      setThinking(false);
      const aiCompareMsg = {
        id: Date.now() + 1,
        role: 'ai',
        model: 'dimoon-light',
        content: ``,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        isCompare: true,
        compareModelLeft: 'dimoon-light',
        compareModelRight: 'gpt-4',
        compareContentLeft: liveLeftAPIResponse,
        compareContentRight: `من پاسخ مدل ChatGPT هستم. درخواست شما برای مقایسه با مدل چت‌چی لایت تحلیل شد. پاسخ‌های مقایسه‌ای به زودی با جزییات و دقت بیشتری ارائه می‌شوند.`
      };
      addMessage(aiCompareMsg);
    } else if (isDimoonLightSelected) {
      const apiResponse = await queryDeepSeekAPI(finalQuery);
      setThinking(false);
      addMessage({
        id: Date.now() + 1,
        role: 'ai',
        model: 'dimoon-light',
        content: apiResponse,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        isCompare: false
      });
    } else {
      setTimeout(() => {
        setThinking(false);
        const aiMsg = {
          id: Date.now() + 1,
          role: 'ai',
          model: selectedModels[0],
          content: `در حال بررسی درخواست شما هستم. این پاسخ در حالت ${tempMode ? 'موقت' : 'دائمی'} و با مدل ${selectedModels[0]} تولید شده است. سیستم چت‌چی نسخه ۲.۰ آماده ارائه تحلیل‌های دقیق‌تر می‌باشد.`,
          timestamp: new Date().toLocaleTimeString('fa-IR'),
          isCompare: false
        };
        addMessage(aiMsg);
      }, 2000);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, size: f.size, type: f.type }))]);
  };

  const handleAddWebsite = () => {
    setUrlValidationError('');
    // Simple URL regex validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    if (!urlPattern.test(siteUrlInput.trim())) {
      setUrlValidationError('سایت واردشده معتبر نیست');
      return;
    }

    setAddedWebsites(prev => [...prev, siteUrlInput.trim()]);
    setSiteUrlInput('');
    setIsAddSiteModalOpen(false);
  };

  const deactivateAllModes = () => {
    setHasImageTag(false);
    setHasThinkingTag(false);
    setResearchTag(false);
    setWebSearchTag(false);
    setCanvasTag(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 z-40 bg-gradient-to-t from-white via-white/95 to-transparent">
      <div className="max-w-4xl mx-auto relative">
        {/* Dynamic target websites chip strip above prompt line */}
        <AnimatePresence>
          {addedWebsites.length > 0 && hasResearchTag && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex flex-wrap gap-1.5 mb-2.5 justify-end" dir="rtl">
              {addedWebsites.map((site, i) => (
                <div key={i} className="flex items-center gap-1 bg-indigo-50/50 border border-indigo-100/30 px-2.5 py-1 rounded-xl text-[10px] font-bold text-indigo-700">
                  <span>{site}</span>
                  <button onClick={() => setAddedWebsites(prev => prev.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-indigo-100 rounded-full transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex flex-wrap gap-2 mb-4">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm text-[var(--text-primary)]">
                  <FileText className="w-3 h-3 text-indigo-500" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`
          bg-white border-2 border-[var(--border)] rounded-[32px] shadow-layered transition-all duration-300
          focus-within:border-black/5 focus-within:ring-4 ring-indigo-500/5 p-3 relative
          ${tempMode ? 'bg-[#FFFEFB]' : ''}
        `}>
          
          {/* Custom Tools Panel overlay */}
          <AnimatePresence>
            {isToolsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-4 mb-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-layered p-3 z-50 text-right"
              >
                <div className="space-y-1">
                  <button onClick={() => { deactivateAllModes(); setHasImageTag(true); setIsToolsOpen(false); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <span>ساخت تصویر</span>
                    </span>
                  </button>
                  <button onClick={() => { deactivateAllModes(); setHasThinkingTag(true); setIsToolsOpen(false); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>تفکر هوشمند</span>
                    </span>
                  </button>
                  <button onClick={() => { deactivateAllModes(); setResearchTag(true); setIsToolsOpen(false); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors">
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-500" />
                      <span>تحقیق عمیق</span>
                    </span>
                  </button>
                  <button onClick={() => { deactivateAllModes(); setWebSearchTag(true); setIsToolsOpen(false); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors">
                    <span className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-emerald-500" />
                      <span>جستجوی وب</span>
                    </span>
                  </button>
                  <button onClick={() => { deactivateAllModes(); setCanvasTag(true); setIsToolsOpen(false); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-500" />
                      <span>بوم (Canvas)</span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 px-2">
            <div className="flex items-center gap-1 mb-1" ref={toolsRef}>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all hover:scale-110 active:scale-95"
                title="افزودن فایل"
              >
                <Paperclip className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all hover:scale-110 active:scale-95"
                title="ابزارها"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </button>
            </div>
            
            {/* Auto-growing textarea layout */}
            <div className="flex-1 flex flex-col justify-end text-right">
              
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                rows={1}
                style={{ height: 'auto', maxHeight: '240px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder={tCurr.composerPlaceholder}
                className="w-full bg-transparent py-3 px-1 resize-none outline-none text-lg leading-relaxed font-medium placeholder:text-gray-300 min-h-[52px] max-h-60 overflow-y-auto text-right"
              />

              {/* Dynamic contextual tags action strip */}
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100 flex-wrap relative" dir="rtl">
                
                {/* 1. Image Generation Tag */}
                {hasImageTag && (
                  <button
                    onClick={() => setHasImageTag(false)}
                    className="flex items-center gap-1.5 text-indigo-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-none border-none bg-transparent group/tag select-none hover:bg-red-50 hover:text-red-700 rounded-2xl h-[32px]"
                  >
                    <span className="group-hover/tag:hidden">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="hidden group-hover/tag:inline-block">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <span>تصویر</span>
                  </button>
                )}

                {/* 2. Smart Thinking Tag */}
                {hasThinkingTag && (
                  <button
                    onClick={() => setHasThinkingTag(false)}
                    className="flex items-center gap-1.5 text-amber-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-none border-none bg-transparent group/tag select-none hover:bg-red-50 hover:text-red-700 rounded-2xl h-[32px]"
                  >
                    <span className="group-hover/tag:hidden">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="hidden group-hover/tag:inline-block">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <span>تفکر هوشمند</span>
                  </button>
                )}

                {/* 3. Deep Research Tag & Sites nested sub-trigger */}
                {hasResearchTag && (
                  <>
                    <button
                      onClick={() => { setResearchTag(false); setAddedWebsites([]); }}
                      className="flex items-center gap-1.5 text-blue-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-none border-none bg-transparent group/tag select-none hover:bg-red-50 hover:text-red-700 rounded-2xl h-[32px]"
                    >
                      <span className="group-hover/tag:hidden">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <span className="hidden group-hover/tag:inline-block">
                        <X className="w-3.5 h-3.5" />
                      </span>
                      <span>تحقیق عمیق</span>
                    </button>

                    {/* Sites context tag trigger */}
                    <div className="relative" ref={researchSitesRef}>
                      <button
                        onClick={() => setIsResearchSitesOpen(!isResearchSitesOpen)}
                        className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/40 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 transition-colors h-[32px]"
                      >
                        <span>سایت‌ها: {searchTargetType === 'broad' ? 'همه وب' : `${addedWebsites.length} سایت`}</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {isResearchSitesOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full mb-2 right-0 bg-white border border-gray-150 rounded-2xl shadow-layered p-2 z-[60] w-52 text-right"
                          >
                            <button
                              onClick={() => { setSearchTargetType('broad'); setAddedWebsites([]); setIsResearchSitesOpen(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${searchTargetType === 'broad' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-755'}`}
                            >
                              <span>جستجوی کل وب</span>
                              {searchTargetType === 'broad' && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => { setSearchTargetType('specific'); setIsAddSiteModalOpen(true); setIsResearchSitesOpen(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${searchTargetType === 'specific' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-755'}`}
                            >
                              <span>جستجوی سایت‌های خاص</span>
                              {searchTargetType === 'specific' && <Check className="w-3.5 h-3.5" />}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {/* 4. Web Search Tag */}
                {hasWebSearchTag && (
                  <button
                    onClick={() => setWebSearchTag(false)}
                    className="flex items-center gap-1.5 text-emerald-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-none border-none bg-transparent group/tag select-none hover:bg-red-50 hover:text-red-700 rounded-2xl h-[32px]"
                  >
                    <span className="group-hover/tag:hidden">
                      <Monitor className="w-3.5 h-3.5" />
                    </span>
                    <span className="hidden group-hover/tag:inline-block">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <span>جستجوی وب</span>
                  </button>
                )}

                {/* 5. Canvas Tag */}
                {hasCanvasTag && (
                  <button
                    onClick={() => setCanvasTag(false)}
                    className="flex items-center gap-1.5 text-purple-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-none border-none bg-transparent group/tag select-none hover:bg-red-50 hover:text-red-700 rounded-2xl h-[32px]"
                  >
                    <span className="group-hover/tag:hidden">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <span className="hidden group-hover/tag:inline-block">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <span>بوم (Canvas)</span>
                  </button>
                )}

                {/* Aspect Ratio Selector (Only visible for Image Generation Tag) */}
                {hasImageTag && (
                  <div className="relative" ref={aspectRef}>
                    <button 
                      onClick={() => setIsAspectOpen(!isAspectOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors border-none bg-transparent shadow-none"
                    >
                      {ASPECT_RATIOS.find(r => r.id === selectedAspectRatio)?.icon}
                      <span>{selectedAspectRatio === 'auto' ? 'نسبت تصویر: خودکار' : `نسبت تصویر: ${ASPECT_RATIOS.find(r => r.id === selectedAspectRatio)?.label}`}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    
                    <AnimatePresence>
                      {isAspectOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full mb-3 right-0 bg-white border border-gray-150 rounded-[20px] shadow-layered p-2.5 z-[60] w-52 text-right"
                        >
                          <p className="text-[10px] font-bold text-gray-400 px-3 py-1.5 border-b border-gray-50 mb-1 select-none">نسبت تصویر را انتخاب کنید</p>
                          <div className="space-y-0.5 overflow-hidden">
                            {ASPECT_RATIOS.map(ratio => (
                              <button
                                key={ratio.id}
                                onClick={() => {
                                  setSelectedAspectRatio(ratio.id);
                                  setIsAspectOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${selectedAspectRatio === ratio.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-755'}`}
                              >
                                <div className="flex items-center gap-2">
                                  {ratio.icon}
                                  <span>{ratio.label}</span>
                                </div>
                                {selectedAspectRatio === ratio.id && <Check className="w-3.5 h-3.5" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Style Selector (Only visible for Image Generation Tag) */}
                {hasImageTag && (
                  <div className="relative" ref={styleRef}>
                    <button 
                      onClick={() => setIsStyleOpen(!isStyleOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors border-none bg-transparent shadow-none"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>استایل</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    
                    <AnimatePresence>
                      {isStyleOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full mb-3 right-0 bg-white border border-gray-150 rounded-[24px] shadow-layered p-4 z-[60] w-72 text-right"
                        >
                          <p className="text-[10px] font-bold text-gray-400 px-1 pb-2 border-b border-gray-50 mb-3 select-none">یک سبک هنری انتخاب کنید</p>
                          <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto custom-scrollbar">
                            {STYLES.map(style => (
                              <button
                                key={style.id}
                                onClick={() => {
                                  setSelectedStyle(style.id);
                                  setInput(prev => {
                                    const clearPrev = prev.trim();
                                    return clearPrev ? `${clearPrev} (${style.prompt})` : style.prompt;
                                  });
                                  setIsStyleOpen(false);
                                }}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${selectedStyle === style.id ? 'bg-indigo-50 border border-indigo-100/50' : 'hover:bg-gray-50'}`}
                              >
                                <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${style.id === 'cyberpunk' ? 'from-pink-500 to-purple-600' : style.id === 'anime' ? 'from-blue-400 to-indigo-500' : style.id === 'dramatic' ? 'from-neutral-700 to-neutral-900' : style.id === 'coloring' ? 'from-zinc-100 to-zinc-300' : style.id === 'photoshoot' ? 'from-amber-700 to-stone-800' : style.id === 'retro' ? 'from-yellow-400 to-red-500' : style.id === '80s' ? 'from-fuchsia-400 to-cyan-400' : style.id === 'nouveau' ? 'from-emerald-600 to-yellow-600' : 'from-purple-900 to-pink-600'} shadow-sm flex items-center justify-center text-white/40 font-bold text-xs`}>
                                  {style.label[0]}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 truncate max-w-full text-center">{style.label.split(' ')[0]}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>

            </div>

            <div className="flex items-center gap-1 mb-1">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isRecording ? 'bg-red-50 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-50'}`}
                title="تایپ صوتی"
              >
                <Mic className="w-6 h-6" />
              </button>

              <motion.button 
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || isThinking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-none
                  ${(input.trim() || attachments.length > 0) ? 'bg-black text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                `}
                title="ارسال"
              >
                {isThinking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isRecording && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex items-center justify-center gap-4 border-t border-gray-50 mt-2">
                <div className="flex gap-1 h-4 items-center">
                  {[...Array(6)].map((_, i) => (
                    <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }} className="w-1 bg-red-400 rounded-full" />
                  ))}
                </div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">در حال ضبط...</span>
                <span className="text-[10px] text-gray-400 font-medium">00:12</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-5 font-bold uppercase tracking-widest opacity-60">
          {tCurr.warningAlert}
        </p>
      </div>

      {/* Add Specific Website Modal (Deep Research websites input popup) */}
      <AnimatePresence>
        {isAddSiteModalOpen && (
          <div 
            onClick={() => setIsAddSiteModalOpen(false)}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-zinc-100 p-8 rounded-[32px] w-full max-w-sm shadow-layered text-right"
            >
              <button 
                onClick={() => setIsAddSiteModalOpen(false)} 
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors z-50"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h5 className="font-black text-gray-900 text-md mb-2 text-right">افزودن وب‌سایت برای جستجو</h5>
              <p className="text-[11px] text-gray-400 mb-4 text-right leading-relaxed">آدرس دامنه یا وب‌سایت مدنظر خود را بنویسید تا جستجوی عمیق تنها به آن محدود شود.</p>

              <div className="space-y-2 text-right">
                <input 
                  autoFocus
                  type="text" 
                  value={siteUrlInput}
                  onChange={(e) => { setSiteUrlInput(e.target.value); setUrlValidationError(''); }}
                  placeholder="مثال: wikipedia.org"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 text-xs font-semibold outline-none text-[var(--text-primary)] text-left dir-ltr" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddWebsite();
                  }}
                />
                
                {urlValidationError && (
                  <p className="text-[11px] font-bold text-red-500 mt-1.5 animate-pulse text-right">{urlValidationError}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" className="h-10 text-xs rounded-xl" onClick={() => setIsAddSiteModalOpen(false)}>انصراف</Button>
                <Button variant="primary" className="h-10 text-xs rounded-xl bg-indigo-600 text-white" onClick={handleAddWebsite}>افزودن سایت</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const PricingView = () => {
  const setView = useStore(s => s.setView);
  const plans = [
    { name: 'رایگان', price: '۰', features: ['مدل‌های پایه', 'جستجوی محدود', '۵ فایل در روز'], current: true },
    { name: 'پرو', price: '۹۹,۰۰۰', features: ['مدل‌های پیشرفته (GPT-4)', 'مقایسه نامحدود', 'تولید تصویر', 'پشتیبانی اولویت‌دار'], popular: true },
    { name: 'سازمانی', price: 'سفارشی', features: ['امنیت پیشرفته', 'پنل مدیریت تیم', 'API اختصاصی', 'آموزش مدل خصوصی'] }
  ];

  return (
    <div className="min-h-screen bg-white p-12 custom-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto text-right">
        <button onClick={() => setView('chat')} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12 font-bold group">
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> بازگشت به گفتگو
        </button>
        
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 text-[var(--text-primary)]">پلن مناسب خود را انتخاب کنید</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">با ارتقای حساب کاربری، به قدرت واقعی هوش مصنوعی دسترسی پیدا کنید و بهره‌وری خود را چندین برابر کنید.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[var(--radius-modal)] border transition-all ${plan.popular ? 'border-indigo-600 shadow-layered scale-105 z-10' : 'border-gray-100 hover:border-gray-200 shadow-soft'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest">محبوب‌ترین</div>
              )}
              <h3 className="text-2xl font-black mb-2 text-[var(--text-primary)]">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-8 text-[var(--text-primary)]">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-gray-400 font-bold">تومان / ماهانه</span>
              </div>
              <ul className="space-y-4 mb-12">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500"><Check className="w-3 h-3" /></div>
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'accent' : 'outline'} className="w-full h-14 text-lg">
                {plan.current ? 'پلن فعلی شما' : 'انتخاب این پلن'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DimoonAIApp() {
  const { view, isSidebarOpen, toggleSidebar, isCompareMode, messages, isThinking, tempMode, setTempMode, lang, setSearchOpen, user } = useStore();
  const scrollRef = useRef(null);
  const tCurr = t[lang] || t.fa;

  // Task 4: Dynamic Hourly Greeting Generator
  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = user?.name ? ` ${user.name}` : "";
    if (hr >= 5 && hr < 12) return `صبح بخیر${name}، چطور کمک کنم؟`;
    if (hr >= 12 && hr < 17) return `ظهر بخیر${name}، چطور کمک کنم؟`;
    if (hr >= 17 && hr < 21) return `عصر بخیر${name}، چطور کمک کنم؟`;
    return `شب بخیر${name}، چطور کمک کنم؟`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (view === 'auth') return <><DesignTokens /><AuthView /></>;
  if (view === 'pricing') return <><DesignTokens /><PricingView /></>;

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 overflow-hidden" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <DesignTokens />

      <Sidebar />

      <main className="flex-1 flex flex-col h-full bg-white relative">
        
        <header className="h-[64px] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-[45]">
          <div className="flex items-center gap-5">
            <button 
              onClick={toggleSidebar}
              className="p-2.5 hover:bg-gray-100 rounded-[14px] text-gray-500 transition-colors"
              aria-label={isSidebarOpen ? "بستن منو" : "باز کردن منو"}
            >
              {isSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <ModelSelector />
          </div>

          <div className="flex items-center gap-3">
            <motion.button 
              onClick={() => messages.length === 0 && setTempMode(!tempMode)}
              disabled={messages.length > 0}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-sm font-bold transition-all ${
                tempMode 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'text-gray-500 hover:bg-gray-100'
              } ${messages.length > 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Ghost className={`w-4 h-4 ${tempMode ? 'animate-pulse' : ''}`} />
              <span>{tCurr.tempModeBtn}</span>
            </motion.button>
          </div>
        </header>

        {/* Dynamic chat canvas with improved padding */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto px-12 md:px-16 pt-16 pb-52 custom-scrollbar transition-colors duration-500 ${tempMode ? 'bg-[#FFFEFB]' : ''}`}
        >
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto h-full flex flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-10 shadow-soft"
              >
                {tempMode ? (
                  <Ghost className="w-12 h-12 text-black" />
                ) : (
                  <Sparkles className="w-12 h-12 text-black" />
                )}
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black mb-6 tracking-tight text-[var(--text-primary)]"
              >
                {tempMode ? tCurr.tempModeTitle : getGreeting()}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-base max-w-xl leading-relaxed mb-16"
              >
                {tempMode ? tCurr.tempModeDesc : 'چت‌چی هوش مصنوعی حرفه‌ای پارسی است که برای تحلیل داده، کدنویسی، و خلق ایده‌های نو در کنار شماست.'}
              </motion.p>
              
              {/* Task 2: 3 Example un-bold prompts on a single line */}
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl mt-2">
                {[
                  { text: 'ساخت تصویر', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                  { text: 'نوشتن یا ویرایش', icon: <Edit2 className="w-3.5 h-3.5" /> },
                  { text: 'جستجو یا ترجمه موضوع', icon: <Search className="w-3.5 h-3.5" /> }
                ].map((hint, idx) => (
                  <motion.button 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    onClick={() => {
                      if (hint.text === 'ساخت تصویر') {
                        // Task 4 trigger event for prompt image tag injection
                        window.dispatchEvent(new Event('trigger-image-tag'));
                      } else {
                        // Standard dynamic text insert
                        const composerTextarea = document.querySelector('textarea');
                        if (composerTextarea) {
                          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                          nativeSetter.call(composerTextarea, hint.text);
                          composerTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                          composerTextarea.focus();
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-normal text-gray-600 border border-gray-100 rounded-full hover:bg-gray-50 hover:border-indigo-100 transition-all group"
                  >
                    <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                      {hint.icon}
                    </span>
                    <span className="text-gray-700 group-hover:text-indigo-900">{hint.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg, i) => (
                <Message key={msg.id} msg={msg} isLast={i === messages.length - 1} />
              ))}
              
              {isThinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start mb-12">
                  <div className="flex items-center gap-3 mb-4 w-full justify-end text-right dir-rtl">
                    <span className="text-sm font-black text-gray-400">{tCurr.processing}</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-3 w-full max-w-md mr-auto">
                    <div className="h-4 bg-gray-50 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-gray-50 rounded-full w-2/3 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {tempMode && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 glass-effect border border-amber-200 text-amber-800 px-6 py-2.5 rounded-full text-sm font-bold shadow-layered flex items-center gap-3 z-[60]"
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              {tCurr.tempModeActive}
            </motion.div>
          )}
        </AnimatePresence>

        <Composer />

      </main>

      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/20 z-[40]"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .animate-pulse-slow {
      animation: pulse-slow 3s infinite ease-in-out;
    }
  `;
  document.head.appendChild(style);
}
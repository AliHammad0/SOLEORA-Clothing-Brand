
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_URL = "https://soleora-clothing-brand-backend.vercel.app/api/v1/users/login";

const Login = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Welcome Back",
      subtitle: "Login to your SOLEORA account.",
      email: "Email Address",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      login: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      signup: "Create Account",
      forgot: "Forgot Password?",
      genericError: "Login failed. Please try again.",
      show: "Show password",
      hide: "Hide password",
      secure: "Your style journey continues here.",
      rights: "All rights reserved.",
    },
    ur: {
      title: "واپس خوش آمدید",
      subtitle: "اپنے SOLEORA اکاؤنٹ میں لاگ اِن کریں۔",
      email: "ای میل ایڈریس",
      password: "پاس ورڈ",
      emailPlaceholder: "اپنی ای میل درج کریں",
      passwordPlaceholder: "اپنا پاس ورڈ درج کریں",
      login: "لاگ اِن کریں",
      loggingIn: "لاگ اِن ہو رہا ہے...",
      noAccount: "اکاؤنٹ نہیں ہے؟",
      signup: "اکاؤنٹ بنائیں",
      forgot: "پاس ورڈ بھول گئے؟",
      genericError: "لاگ اِن نہیں ہو سکا، دوبارہ کوشش کریں۔",
      show: "پاس ورڈ دکھائیں",
      hide: "پاس ورڈ چھپائیں",
      secure: "آپ کے اسٹائل کا سفر جاری ہے۔",
      rights: "تمام حقوق محفوظ ہیں۔",
    },
    hi: {
      title: "वापसी पर स्वागत है",
      subtitle: "अपने SOLEORA खाते में लॉगिन करें।",
      email: "ईमेल पता",
      password: "पासवर्ड",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      login: "लॉगिन",
      loggingIn: "लॉगिन हो रहा है...",
      noAccount: "खाता नहीं है?",
      signup: "खाता बनाएँ",
      forgot: "पासवर्ड भूल गए?",
      genericError: "लॉगिन विफल हुआ। फिर से प्रयास करें।",
      show: "पासवर्ड दिखाएँ",
      hide: "पासवर्ड छिपाएँ",
      secure: "आपकी स्टाइल यात्रा जारी है।",
      rights: "सर्वाधिकार सुरक्षित।",
    },
    bn: {
      title: "আবার স্বাগতম",
      subtitle: "আপনার SOLEORA অ্যাকাউন্টে লগইন করুন।",
      email: "ইমেইল ঠিকানা",
      password: "পাসওয়ার্ড",
      emailPlaceholder: "আপনার ইমেইল লিখুন",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
      login: "লগইন",
      loggingIn: "লগইন হচ্ছে...",
      noAccount: "অ্যাকাউন্ট নেই?",
      signup: "অ্যাকাউন্ট তৈরি করুন",
      forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      genericError: "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      show: "পাসওয়ার্ড দেখান",
      hide: "পাসওয়ার্ড লুকান",
      secure: "আপনার স্টাইলের যাত্রা চলতে থাকুক।",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
    },
    ar: {
      title: "مرحبًا بعودتك",
      subtitle: "سجّل الدخول إلى حساب SOLEORA الخاص بك.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      login: "تسجيل الدخول",
      loggingIn: "جارٍ تسجيل الدخول...",
      noAccount: "ليس لديك حساب؟",
      signup: "إنشاء حساب",
      forgot: "هل نسيت كلمة المرور؟",
      genericError: "فشل تسجيل الدخول. حاول مرة أخرى.",
      show: "إظهار كلمة المرور",
      hide: "إخفاء كلمة المرور",
      secure: "رحلتك في عالم الأناقة مستمرة.",
      rights: "جميع الحقوق محفوظة.",
    },
    zh: {
      title: "欢迎回来",
      subtitle: "登录您的 SOLEORA 账户。",
      email: "电子邮箱",
      password: "密码",
      emailPlaceholder: "请输入电子邮箱",
      passwordPlaceholder: "请输入密码",
      login: "登录",
      loggingIn: "正在登录...",
      noAccount: "还没有账户？",
      signup: "创建账户",
      forgot: "忘记密码？",
      genericError: "登录失败，请重试。",
      show: "显示密码",
      hide: "隐藏密码",
      secure: "继续您的时尚之旅。",
      rights: "保留所有权利。",
    },
    ja: {
      title: "おかえりなさい",
      subtitle: "SOLEORA アカウントにログインしてください。",
      email: "メールアドレス",
      password: "パスワード",
      emailPlaceholder: "メールアドレスを入力",
      passwordPlaceholder: "パスワードを入力",
      login: "ログイン",
      loggingIn: "ログイン中...",
      noAccount: "アカウントをお持ちでないですか？",
      signup: "アカウント作成",
      forgot: "パスワードをお忘れですか？",
      genericError: "ログインに失敗しました。再試行してください。",
      show: "パスワードを表示",
      hide: "パスワードを非表示",
      secure: "あなたのスタイルの旅は続きます。",
      rights: "無断転載を禁じます。",
    },
    fr: {
      title: "Bon retour",
      subtitle: "Connectez-vous à votre compte SOLEORA.",
      email: "Adresse e-mail",
      password: "Mot de passe",
      emailPlaceholder: "Saisissez votre e-mail",
      passwordPlaceholder: "Saisissez votre mot de passe",
      login: "Se connecter",
      loggingIn: "Connexion...",
      noAccount: "Vous n'avez pas de compte ?",
      signup: "Créer un compte",
      forgot: "Mot de passe oublié ?",
      genericError: "Échec de connexion. Réessayez.",
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
      secure: "Votre aventure stylistique continue.",
      rights: "Tous droits réservés.",
    },
  };

  const text = translations[language] || translations.en;
  const isRTL = language === "ur" || language === "ar";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || text.genericError);
      }

      if (!data.token || !data.user) {
        throw new Error("Login response is missing user or token data.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/", { replace: true });
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError(
          "Unable to connect to the server. Check your backend, API URL, and CORS settings."
        );
      } else {
        setError(err.message || text.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10";

  const EyeIcon = ({ visible }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <path d="m3 3 18 18" />
        </>
      ) : (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-screen flex-col bg-white text-black"
    >
      <header className="w-full border-b border-gray-100 px-6 py-6">
        <Link to="/" className="flex items-center justify-center">
          <span className="text-3xl font-bold tracking-[4px] sm:text-4xl sm:tracking-[5px]">
            SOLEORA
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-center text-3xl font-semibold">
            {text.title}
          </h1>

          <p className="mt-3 text-center text-sm text-gray-500">
            {text.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                {text.email}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={text.emailPlaceholder}
                autoComplete="email"
                dir="ltr"
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  {text.password}
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 underline underline-offset-4 transition hover:text-black"
                >
                  {text.forgot}
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={text.passwordPlaceholder}
                  autoComplete="current-password"
                  dir="ltr"
                  required
                  className={`${inputClass} ${
                    isRTL ? "pl-12" : "pr-12"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={showPassword ? text.hide : text.show}
                  title={showPassword ? text.hide : text.show}
                  className={`absolute top-1/2 -translate-y-1/2 p-2 text-gray-500 transition hover:text-black focus:outline-none ${
                    isRTL ? "left-2" : "right-2"
                  }`}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-4 text-sm font-semibold text-white transition duration-300 hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? text.loggingIn : text.login}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-600">
            {text.noAccount}{" "}
            <Link
              to="/signup"
              className="font-semibold text-black underline underline-offset-4 transition-colors hover:text-gray-500"
            >
              {text.signup}
            </Link>
          </p>

          <p className="mt-7 text-center text-xs text-gray-400">
            {text.secure}
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-5 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SOLEORA. {text.rights}
      </footer>
    </div>
  );
};

export default Login;

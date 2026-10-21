
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_BASE =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/users";

const translations = {
  en: {
    title: "Create Account",
    subtitle: "Join SOLEORA and discover your style.",
    first: "First Name",
    last: "Last Name",
    email: "Email Address",
    password: "Password",
    confirm: "Confirm Password",
    firstPlaceholder: "Enter your first name",
    lastPlaceholder: "Enter your last name",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Create a password",
    confirmPlaceholder: "Confirm your password",
    signup: "Create Account",
    submitting: "Sending Verification Code...",
    haveAccount: "Already have an account?",
    login: "Login",
    mismatch: "Passwords do not match.",
    passwordError: "Password must be at least 8 characters.",
    nameError: "First and last name are required.",
    secure: "Your style journey starts here.",
    rights: "All rights reserved.",
    genericError: "Signup failed. Please try again.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    otpTitle: "Verify Your Email",
    otpSubtitle: "Enter the 6-digit code sent to your email.",
    otp: "Verification Code",
    verify: "Verify Email",
    verifying: "Verifying...",
    verified: "Email verified successfully!",
    otpError: "Enter a valid 6-digit code.",
    back: "Back to Signup",
    loginNow: "Email verified! You can now log in.",
  },
  ur: {
    title: "اکاؤنٹ بنائیں",
    subtitle: "SOLEORA میں شامل ہوں اور اپنا اسٹائل دریافت کریں۔",
    first: "پہلا نام",
    last: "آخری نام",
    email: "ای میل ایڈریس",
    password: "پاس ورڈ",
    confirm: "پاس ورڈ کی تصدیق",
    firstPlaceholder: "اپنا پہلا نام درج کریں",
    lastPlaceholder: "اپنا آخری نام درج کریں",
    emailPlaceholder: "اپنی ای میل درج کریں",
    passwordPlaceholder: "پاس ورڈ بنائیں",
    confirmPlaceholder: "پاس ورڈ دوبارہ درج کریں",
    signup: "اکاؤنٹ بنائیں",
    submitting: "تصدیقی کوڈ بھیجا جا رہا ہے...",
    haveAccount: "پہلے سے اکاؤنٹ ہے؟",
    login: "لاگ اِن کریں",
    mismatch: "دونوں پاس ورڈ ایک جیسے نہیں ہیں۔",
    passwordError: "پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔",
    nameError: "پہلا اور آخری نام درج کریں۔",
    secure: "آپ کے اسٹائل کا سفر یہاں سے شروع ہوتا ہے۔",
    rights: "تمام حقوق محفوظ ہیں۔",
    genericError: "اکاؤنٹ نہیں بن سکا، دوبارہ کوشش کریں۔",
    showPassword: "پاس ورڈ دکھائیں",
    hidePassword: "پاس ورڈ چھپائیں",
    otpTitle: "ای میل کی تصدیق کریں",
    otpSubtitle: "اپنی ای میل پر موصول ہونے والا 6 ہندسوں کا کوڈ درج کریں۔",
    otp: "تصدیقی کوڈ",
    verify: "ای میل کی تصدیق",
    verifying: "تصدیق ہو رہی ہے...",
    verified: "ای میل کی تصدیق کامیاب ہوگئی!",
    otpError: "درست 6 ہندسوں کا کوڈ درج کریں۔",
    back: "واپس سائن اپ پر",
    loginNow: "ای میل کی تصدیق ہوگئی! اب لاگ اِن کریں۔",
  },
  hi: {
    title: "खाता बनाएँ",
    subtitle: "SOLEORA से जुड़ें और अपना स्टाइल खोजें।",
    first: "पहला नाम",
    last: "अंतिम नाम",
    email: "ईमेल पता",
    password: "पासवर्ड",
    confirm: "पासवर्ड की पुष्टि करें",
    firstPlaceholder: "अपना पहला नाम दर्ज करें",
    lastPlaceholder: "अपना अंतिम नाम दर्ज करें",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordPlaceholder: "पासवर्ड बनाएँ",
    confirmPlaceholder: "पासवर्ड फिर से दर्ज करें",
    signup: "खाता बनाएँ",
    submitting: "कोड भेजा जा रहा है...",
    haveAccount: "पहले से खाता है?",
    login: "लॉगिन",
    mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    passwordError: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    nameError: "पहला और अंतिम नाम दर्ज करें।",
    secure: "आपकी स्टाइल यात्रा यहाँ से शुरू होती है।",
    rights: "सर्वाधिकार सुरक्षित।",
    genericError: "खाता नहीं बन सका। फिर से प्रयास करें।",
    showPassword: "पासवर्ड दिखाएँ",
    hidePassword: "पासवर्ड छिपाएँ",
    otpTitle: "ईमेल सत्यापित करें",
    otpSubtitle: "ईमेल पर आया 6 अंकों का कोड दर्ज करें।",
    otp: "सत्यापन कोड",
    verify: "ईमेल सत्यापित करें",
    verifying: "सत्यापन हो रहा है...",
    verified: "ईमेल सफलतापूर्वक सत्यापित हुआ!",
    otpError: "सही 6 अंकों का कोड दर्ज करें।",
    back: "साइनअप पर वापस जाएँ",
    loginNow: "ईमेल सत्यापित हुआ! अब लॉगिन करें।",
  },
  bn: {
    title: "অ্যাকাউন্ট তৈরি করুন",
    subtitle: "SOLEORA-তে যোগ দিন এবং আপনার স্টাইল আবিষ্কার করুন।",
    first: "নামের প্রথম অংশ",
    last: "নামের শেষ অংশ",
    email: "ইমেইল ঠিকানা",
    password: "পাসওয়ার্ড",
    confirm: "পাসওয়ার্ড নিশ্চিত করুন",
    firstPlaceholder: "আপনার নাম লিখুন",
    lastPlaceholder: "আপনার পদবি লিখুন",
    emailPlaceholder: "আপনার ইমেইল লিখুন",
    passwordPlaceholder: "একটি পাসওয়ার্ড তৈরি করুন",
    confirmPlaceholder: "পাসওয়ার্ড আবার লিখুন",
    signup: "অ্যাকাউন্ট তৈরি করুন",
    submitting: "কোড পাঠানো হচ্ছে...",
    haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    login: "লগইন",
    mismatch: "পাসওয়ার্ড দুটি মেলেনি।",
    passwordError: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    nameError: "নাম লিখুন।",
    secure: "আপনার স্টাইলের যাত্রা এখান থেকেই শুরু।",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    genericError: "আবার চেষ্টা করুন।",
    showPassword: "পাসওয়ার্ড দেখান",
    hidePassword: "পাসওয়ার্ড লুকান",
    otpTitle: "ইমেইল যাচাই করুন",
    otpSubtitle: "ইমেইলে পাঠানো ৬ সংখ্যার কোড লিখুন।",
    otp: "যাচাইকরণ কোড",
    verify: "ইমেইল যাচাই করুন",
    verifying: "যাচাই হচ্ছে...",
    verified: "ইমেইল যাচাই সম্পন্ন!",
    otpError: "সঠিক ৬ সংখ্যার কোড লিখুন।",
    back: "সাইনআপে ফিরে যান",
    loginNow: "ইমেইল যাচাই হয়েছে! এখন লগইন করুন।",
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "انضم إلى SOLEORA واكتشف أسلوبك.",
    first: "الاسم الأول",
    last: "اسم العائلة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirm: "تأكيد كلمة المرور",
    firstPlaceholder: "أدخل اسمك الأول",
    lastPlaceholder: "أدخل اسم العائلة",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أنشئ كلمة مرور",
    confirmPlaceholder: "أعد إدخال كلمة المرور",
    signup: "إنشاء حساب",
    submitting: "جارٍ إرسال الرمز...",
    haveAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    mismatch: "كلمتا المرور غير متطابقتين.",
    passwordError: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    nameError: "يرجى إدخال الاسم الأول واسم العائلة.",
    secure: "رحلتك في عالم الأناقة تبدأ هنا.",
    rights: "جميع الحقوق محفوظة.",
    genericError: "تعذر إنشاء الحساب. حاول مرة أخرى.",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    otpTitle: "تحقق من بريدك الإلكتروني",
    otpSubtitle: "أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك.",
    otp: "رمز التحقق",
    verify: "تحقق من البريد",
    verifying: "جارٍ التحقق...",
    verified: "تم التحقق من البريد بنجاح!",
    otpError: "أدخل رمزًا صحيحًا من 6 أرقام.",
    back: "العودة إلى التسجيل",
    loginNow: "تم التحقق! يمكنك تسجيل الدخول الآن.",
  },
  zh: {
    title: "创建账户",
    subtitle: "加入 SOLEORA，发现您的风格。",
    first: "名",
    last: "姓",
    email: "电子邮箱",
    password: "密码",
    confirm: "确认密码",
    firstPlaceholder: "请输入名字",
    lastPlaceholder: "请输入姓氏",
    emailPlaceholder: "请输入电子邮箱",
    passwordPlaceholder: "创建密码",
    confirmPlaceholder: "再次输入密码",
    signup: "创建账户",
    submitting: "正在发送验证码...",
    haveAccount: "已有账户？",
    login: "登录",
    mismatch: "两次输入的密码不一致。",
    passwordError: "密码至少需要 8 个字符。",
    nameError: "请输入名字和姓氏。",
    secure: "您的时尚之旅从这里开始。",
    rights: "保留所有权利。",
    genericError: "账户创建失败，请重试。",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    otpTitle: "验证您的邮箱",
    otpSubtitle: "请输入发送到邮箱的 6 位验证码。",
    otp: "验证码",
    verify: "验证邮箱",
    verifying: "正在验证...",
    verified: "邮箱验证成功！",
    otpError: "请输入正确的 6 位验证码。",
    back: "返回注册",
    loginNow: "邮箱已验证！现在可以登录。",
  },
  ja: {
    title: "アカウント作成",
    subtitle: "SOLEORA に参加して、自分らしいスタイルを見つけましょう。",
    first: "名",
    last: "姓",
    email: "メールアドレス",
    password: "パスワード",
    confirm: "パスワードの確認",
    firstPlaceholder: "名を入力してください",
    lastPlaceholder: "姓を入力してください",
    emailPlaceholder: "メールアドレスを入力",
    passwordPlaceholder: "パスワードを作成",
    confirmPlaceholder: "パスワードを再入力",
    signup: "アカウントを作成",
    submitting: "確認コードを送信中...",
    haveAccount: "すでにアカウントをお持ちですか？",
    login: "ログイン",
    mismatch: "パスワードが一致しません。",
    passwordError: "パスワードは8文字以上で入力してください。",
    nameError: "名と姓を入力してください。",
    secure: "あなたのスタイルの旅はここから始まります。",
    rights: "無断転載を禁じます。",
    genericError: "アカウントを作成できませんでした。再試行してください。",
    showPassword: "パスワードを表示",
    hidePassword: "パスワードを非表示",
    otpTitle: "メールアドレスを確認",
    otpSubtitle: "メールに届いた6桁のコードを入力してください。",
    otp: "確認コード",
    verify: "メールを確認",
    verifying: "確認中...",
    verified: "メール確認が完了しました！",
    otpError: "正しい6桁のコードを入力してください。",
    back: "登録に戻る",
    loginNow: "確認完了！ログインできます。",
  },
  fr: {
    title: "Créer un compte",
    subtitle: "Rejoignez SOLEORA et découvrez votre style.",
    first: "Prénom",
    last: "Nom",
    email: "Adresse e-mail",
    password: "Mot de passe",
    confirm: "Confirmer le mot de passe",
    firstPlaceholder: "Saisissez votre prénom",
    lastPlaceholder: "Saisissez votre nom",
    emailPlaceholder: "Saisissez votre e-mail",
    passwordPlaceholder: "Créez un mot de passe",
    confirmPlaceholder: "Confirmez votre mot de passe",
    signup: "Créer un compte",
    submitting: "Envoi du code...",
    haveAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
    mismatch: "Les mots de passe ne correspondent pas.",
    passwordError: "Le mot de passe doit contenir au moins 8 caractères.",
    nameError: "Le prénom et le nom sont obligatoires.",
    secure: "Votre aventure stylistique commence ici.",
    rights: "Tous droits réservés.",
    genericError: "Impossible de créer le compte. Réessayez.",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    otpTitle: "Vérifiez votre e-mail",
    otpSubtitle: "Saisissez le code à 6 chiffres reçu par e-mail.",
    otp: "Code de vérification",
    verify: "Vérifier l'e-mail",
    verifying: "Vérification...",
    verified: "E-mail vérifié avec succès !",
    otpError: "Saisissez un code valide à 6 chiffres.",
    back: "Retour à l'inscription",
    loginNow: "E-mail vérifié ! Vous pouvez vous connecter.",
  },
};

const Signup = () => {
  const { language } = useLanguage();
  const text = translations[language] || translations.en;
  const isRTL = language === "ur" || language === "ar";

  const [step, setStep] = useState("signup");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const firstname = formData.firstname.trim();
    const lastname = formData.lastname.trim();
    const email = formData.email.trim().toLowerCase();

    if (!firstname || !lastname) {
      setError(text.nameError);
      return;
    }

    if (formData.password.length < 8) {
      setError(text.passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(text.mismatch);
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || text.genericError);
      }

      setVerifiedEmail(email);
      setStep("otp");
      setOtp("");
      setMessage(data.message || text.otpSubtitle);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again."
          : err.message || text.genericError
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError(text.otpError);
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifiedEmail,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || text.otpError);
      }

      setStep("verified");
      setOtp("");
      setMessage(data.message || text.verified);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again."
          : err.message || text.otpError
      );
    } finally {
      setSubmitting(false);
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
            {step === "signup"
              ? text.title
              : step === "otp"
              ? text.otpTitle
              : text.verified}
          </h1>

          <p className="mt-3 text-center text-sm text-gray-500">
            {step === "signup"
              ? text.subtitle
              : step === "otp"
              ? `${text.otpSubtitle} ${verifiedEmail}`
              : text.loginNow}
          </p>

          {step === "signup" && (
            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
                    {text.first}
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder={text.firstPlaceholder}
                    autoComplete="given-name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
                    {text.last}
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder={text.lastPlaceholder}
                    autoComplete="family-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  {text.password}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={text.passwordPlaceholder}
                    autoComplete="new-password"
                    dir="ltr"
                    minLength={8}
                    required
                    className={`${inputClass} ${isRTL ? "pl-12" : "pr-12"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? text.hidePassword : text.showPassword}
                    className={`absolute top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black ${
                      isRTL ? "left-2" : "right-2"
                    }`}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  {text.confirm}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={text.confirmPlaceholder}
                    autoComplete="new-password"
                    dir="ltr"
                    minLength={8}
                    required
                    className={`${inputClass} ${isRTL ? "pl-12" : "pr-12"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((previous) => !previous)}
                    aria-label={showConfirmPassword ? text.hidePassword : text.showPassword}
                    className={`absolute top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black ${
                      isRTL ? "left-2" : "right-2"
                    }`}
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? text.submitting : text.signup}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="mt-9 space-y-5">
              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-medium">
                  {text.otp}
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setError("");
                    setMessage("");
                  }}
                  placeholder="000000"
                  dir="ltr"
                  required
                  className={`${inputClass} text-center text-2xl tracking-[10px]`}
                />
              </div>

              {error && (
                <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="w-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? text.verifying : text.verify}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("signup");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="w-full py-2 text-sm underline underline-offset-4"
              >
                {text.back}
              </button>
            </form>
          )}

          {step === "verified" && (
            <div className="mt-9 space-y-5">
              <p role="status" className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message || text.verified}
              </p>
              <Link
                to="/login"
                className="block w-full bg-black py-4 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {text.login}
              </Link>
            </div>
          )}

          {step !== "verified" && (
            <p className="mt-7 text-center text-sm text-gray-600">
              {text.haveAccount}{" "}
              <Link to="/login" className="font-semibold text-black underline underline-offset-4 hover:text-gray-500">
                {text.login}
              </Link>
            </p>
          )}

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

export default Signup;

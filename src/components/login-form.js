"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username wajib diisi";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (errors.form) {
      setErrors((prev) => ({
        ...prev,
        form: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ form: "Username atau password salah" });
      } else if (result?.ok) {
        setSuccessMessage("Login berhasil! Mengalihkan...");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      setErrors({ form: "Terjadi kesalahan saat login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 relative overflow-hidden items-center justify-center p-12"
        style={{
          backgroundImage: "url('/images/ilust.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* BLACK OVERLAY */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl z-0"></div>

        {/* Illustration container */}
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4 text-prett">
            Selamat Datang Kembali
          </h2>
          <p className="text-white/80 text-lg leading-relaxed text-pretty">
            Kelola semua kebutuhan Anda dengan mudah di satu platform yang
            intuitif dan modern
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-300">
        <div className="w-full max-w-md">
          {/* Form header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-3 text-pretty">
              Masuk
            </h1>
            <p className="text-muted-foreground text-lg">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Error message */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{errors.form}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username Anda"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ${
                    errors.username
                      ? "border-red-400"
                      : "border-border hover:border-border"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-cyan-700 transition ${
                    errors.password
                      ? "border-red-400"
                      : "border-border hover:border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-md hover:bg-red-900 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"></span>
                  <span>Loading...</span>
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-8 text-center text-gray-800 text-sm">
            <p>
              Dengan login, Anda menyetujui{" "}
              <a href="#" className="text-primary hover:text-accent transition">
                Kebijakan Privasi
              </a>{" "}
              kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

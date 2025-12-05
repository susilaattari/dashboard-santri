"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "WALISANTRI",
    // Data tambahan untuk walisantri
    nama: "",
    alamat: "",
    no_hp: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;

    // // Jika bukan guru → redirect
    // if (session?.user?.role !== "ADMIN" ) {
    //   router.replace("/");
    // }
  }, [session, status, router]);

  const validateForm = () => {
    const newErrors = {};

    // Validasi username
    if (!formData.username) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username minimal 4 karakter";
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validasi confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    // Validasi nama
    if (!formData.nama) {
      newErrors.nama = "Nama lengkap wajib diisi";
    }

    // Validasi berdasarkan role
    if (formData.role === "WALISANTRI") {
      if (!formData.alamat) {
        newErrors.alamat = "Alamat wajib diisi";
      }
      if (!formData.no_hp) {
        newErrors.no_hp = "Nomor HP wajib diisi";
      } else if (!/^08[0-9]{8,11}$/.test(formData.no_hp)) {
        newErrors.no_hp = "Format nomor HP tidak valid (08xxxxxxxxxx)";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
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
    console.log("Submitting registration with data:");
    setLoading(newErrors);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      console.log("Response from server:", res);
      if (!res.success) {
        setErrors({ form: res.error || "Registrasi gagal" });
        return;
      }

      setSuccessMessage("User Berhasil Ditambahkan....");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ form: "Terjadi kesalahan saat registrasi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl rounded-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Daftar Akun Baru
            </h1>
            <p className="text-blue-100">Buat akun untuk mengakses sistem</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">
                  {errors.form}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daftar Sebagai
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WALISANTRI">Wali Santri</option>
                  <option value="GURU">Guru</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Nama lengkap"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nama ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.nama && (
                    <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Conditional Fields - Walisantri */}
              {formData.role === "WALISANTRI" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Alamat lengkap"
                        rows="2"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.alamat ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.alamat && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.alamat}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor HP
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        placeholder="08123456789"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.no_hp ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.no_hp && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.no_hp}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Conditional Fields - Guru
              {formData.role === "GURU" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    name="mapel"
                    value={formData.mapel}
                    onChange={handleChange}
                    placeholder="Contoh: Tahfidz Al-Quran"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mapel ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.mapel && (
                    <p className="text-red-500 text-xs mt-1">{errors.mapel}</p>
                  )}
                </div>
              )} */}

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Saya setuju dengan{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    syarat dan ketentuan
                  </a>{" "}
                  yang berlaku
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Menambahkan...</span>
                  </>
                ) : (
                  "Tambah Akun"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

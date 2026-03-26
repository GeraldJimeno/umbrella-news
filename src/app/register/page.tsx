"use client";

import Link from "next/link";
import { Umbrella, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Toggle password visibility state 
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ 
        fullName?: string; 
        email?: string; 
        password?: string; 
        confirmPassword?: string;
        auth?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset errors
        const newErrors: typeof errors = {};
        
        // Validate full name
        if (!fullName.trim()) {
            newErrors.fullName = "El nombre completo es requerido";
        }

        // Validate email
        if (!email) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Ingresa un correo electrónico válido";
        }
        
        // Validate password
        if (!password) {
            newErrors.password = "La contraseña es requerida";
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Debes confirmar tu contraseña";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        setLoading(true);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                console.error("Error en registro:", error);
                
                // Translate common Supabase error messages
                let errorMessage = "Ocurrió un error al intentar crear la cuenta.";
                if (error.message.includes("User already registered") || error.message.includes("already exists")) {
                    errorMessage = "Este correo electrónico ya está registrado.";
                } else if (error.message.includes("Password should be")) {
                    errorMessage = "La contraseña es muy débil (mínimo 6 caracteres).";
                }
                
                setErrors({ auth: errorMessage });
                setLoading(false);
                return;
            }

            // Redirect to home upon successful registration
            router.push("/");
        } catch (error) {
            console.error("Error inesperado en registro:", error);
            setErrors({ auth: "Ocurrió un error inesperado al intentar crear la cuenta." });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header / Logo */}
            <header className="border-b border-gray-100 py-8">
                <div className="flex justify-center">
                    <Link href="/" className="flex flex-col items-center group">
                        <Umbrella className="w-6 h-6 text-umbrella-red mb-1 fill-current" />
                        <h1 className="font-serif text-3xl tracking-tighter sm:text-4xl font-black text-black leading-none">
                            UMBRELLA<span className="text-umbrella-red">NEWS</span>
                        </h1>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-[420px] mx-auto py-12">
                    {/* Titles */}
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="font-serif text-[32px] font-bold text-[#111111] leading-tight mb-2 tracking-tight flex justify-center md:justify-start">
                            Crear cuenta
                        </h2>
                        <p className="text-gray-600 text-sm font-sans flex justify-center md:justify-start">
                            Crea tu cuenta para acceder a Umbrella News.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {errors.auth && (
                            <div className="bg-red-50 text-umbrella-red p-3 rounded-sm text-sm border border-red-200">
                                {errors.auth}
                            </div>
                        )}
                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="name" 
                                className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]"
                            >
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={`w-full border p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 rounded-sm transition-colors ${
                                    errors.fullName 
                                        ? "border-umbrella-red focus:border-umbrella-red focus:ring-umbrella-red" 
                                        : "border-gray-300 focus:border-black focus:ring-black"
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-umbrella-red text-xs mt-1 font-sans">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email" 
                                className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 rounded-sm transition-colors ${
                                    errors.email 
                                        ? "border-umbrella-red focus:border-umbrella-red focus:ring-umbrella-red" 
                                        : "border-gray-300 focus:border-black focus:ring-black"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-umbrella-red text-xs mt-1 font-sans">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full border p-3 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 rounded-sm transition-colors ${
                                        errors.password 
                                            ? "border-umbrella-red focus:border-umbrella-red focus:ring-umbrella-red" 
                                            : "border-gray-300 focus:border-black focus:ring-black"
                                    }`}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-umbrella-red text-xs mt-1 font-sans">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="confirmPassword" 
                                className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]"
                            >
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full border p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 rounded-sm transition-colors ${
                                    errors.confirmPassword 
                                        ? "border-umbrella-red focus:border-umbrella-red focus:ring-umbrella-red" 
                                        : "border-gray-300 focus:border-black focus:ring-black"
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-umbrella-red text-xs mt-1 font-sans">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-bold text-xs tracking-widest uppercase py-4 mt-2 transition-colors rounded-sm flex items-center justify-center ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#111111] hover:bg-black"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center text-sm text-gray-600 font-sans">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-umbrella-red font-bold hover:text-red-700 transition-colors">Iniciar sesión</Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8 mt-auto">
                <div className="flex flex-col items-center justify-center space-y-4 px-4">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                        <Link href="#" className="hover:text-black transition-colors">Términos de venta</Link>
                        <Link href="#" className="hover:text-black transition-colors">Términos de servicio</Link>
                        <Link href="#" className="hover:text-black transition-colors">Política de privacidad</Link>
                        <Link href="#" className="hover:text-black transition-colors">Ayuda</Link>
                        <Link href="#" className="hover:text-black transition-colors">Contacto</Link>
                    </div>
                    <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-400 text-center max-w-2xl leading-relaxed">
                        © 2024 UMBRELLA NEWS. TODOS LOS DERECHOS RESERVADOS. UMBRELLA NEWS Y EL LOGO DE UMBRELLA SON MARCAS REGISTRADAS DE UMBRELLA NEWS.
                    </div>
                </div>
            </footer>
        </div>
    );
}

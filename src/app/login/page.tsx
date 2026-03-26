"use client";

import Link from "next/link";
import { Umbrella } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset errors
        const newErrors: { email?: string; password?: string; auth?: string } = {};
        
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
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        setLoading(true);
        
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setErrors({ auth: "Correo o contraseña incorrectos." });
                setLoading(false);
                return;
            }

            if (authData.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("role, status")
                    .eq("id", authData.user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching profile:", profileError);
                }

                const status = profileData?.status || "active";

                if (status === "inactive") {
                    await supabase.auth.signOut();
                    setErrors({ auth: "Tu cuenta ha sido desactivada. Por favor, contacta al administrador." });
                    setLoading(false);
                    return;
                }

                const role = profileData?.role || "reader";

                // Redirigir siempre a la portada
                router.push("/");
            }
        } catch (error) {
            console.error("Error inesperado en login:", error);
            setErrors({ auth: "Ocurrió un error inesperado al intentar iniciar sesión." });
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
                    <div className="mb-10">
                        <h2 className="font-serif text-[32px] font-bold text-[#111111] leading-tight mb-2 tracking-tight">
                            Inicia sesión
                        </h2>
                        <p className="text-gray-600 text-sm font-sans">
                            Accede a tu cuenta para continuar en Umbrella News.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {errors.auth && (
                            <div className="bg-red-50 text-umbrella-red p-3 rounded-sm text-sm border border-red-200">
                                {errors.auth}
                            </div>
                        )}
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
                                placeholder="Introduce tu correo electrónico"
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
                            <input
                                id="password"
                                type="password"
                                placeholder="Introduce tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full border p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 rounded-sm transition-colors ${
                                    errors.password 
                                        ? "border-umbrella-red focus:border-umbrella-red focus:ring-umbrella-red" 
                                        : "border-gray-300 focus:border-black focus:ring-black"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-umbrella-red text-xs mt-1 font-sans">{errors.password}</p>
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
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </button>
                    </form>

                    {/* Create Account Link */}
                    <div className="mt-8 text-center text-sm text-gray-600 font-sans">
                        ¿No tienes cuenta? <Link href="/register" className="text-black font-bold border-b border-black pb-[1px] hover:text-umbrella-red hover:border-umbrella-red transition-colors">Crear cuenta</Link>
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

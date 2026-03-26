"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";

export default function AdminEditUserPage() {
    const supabase = createClient();
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Basic User Fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    // "Perfil de Autor" Additional Fields
    const [publicName, setPublicName] = useState("");
    const [bio, setBio] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [trajectory, setTrajectory] = useState("");
    const [mainTopics, setMainTopics] = useState("");
    const [recognitions, setRecognitions] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true);
            try {
                // Fetch profiles
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();

                if (profileError || !profile) {
                    setFetchError("El usuario no existe o no se pudo cargar.");
                    return;
                }

                setName(profile.full_name || "");
                setEmail(profile.email || "");
                setRole(profile.role || "reader");
                setStatus(profile.status || "active");

                // Fetch author_profiles if author
                const { data: authorProfile } = await supabase
                    .from("author_profiles")
                    .select("*")
                    .eq("user_id", userId)
                    .single();

                if (authorProfile) {
                    setPublicName(authorProfile.public_name || "");
                    setBio(authorProfile.bio || "");
                    setContactEmail(authorProfile.contact_email || "");
                    setTrajectory(authorProfile.trajectory || "");
                    setMainTopics(authorProfile.main_topics || "");
                    setRecognitions(authorProfile.recognitions || "");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setFetchError("Error inesperado al cargar el usuario.");
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [userId, supabase]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!role) newErrors.role = "Debe asignar un rol al usuario";
        if (!status) newErrors.status = "El estado es obligatorio";

        if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
            newErrors.contactEmail = "Ingrese un correo electrónico válido";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setMessage(null);
        setSaving(true);
        
        try {
            // 1. Update profiles
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    full_name: name.trim(),
                    role: role,
                    status: status
                })
                .eq("id", userId);

            if (profileError) throw profileError;

            // 2. Upsert author_profiles if role is author
            if (role === "author") {
                const { error: authorError } = await supabase
                    .from("author_profiles")
                    .upsert({
                        user_id: userId,
                        public_name: publicName.trim() || null,
                        bio: bio.trim() || null,
                        contact_email: contactEmail.trim() || null,
                        trajectory: trajectory.trim() || null,
                        main_topics: mainTopics.trim() || null,
                        recognitions: recognitions.trim() || null,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                if (authorError) throw authorError;
            }

            setMessage({ type: 'success', text: 'Usuario actualizado correctamente.' });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (err: any) {
            console.error("Error saving user:", err);
            setMessage({ type: 'error', text: err.message || 'Error al guardar los cambios.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 w-full flex flex-col justify-center items-center h-[60vh]">
                <div className="animate-spin w-10 h-10 border-4 border-gray-100 border-t-umbrella-red rounded-full mb-4" />
                <p className="text-gray-500 font-bold text-sm">Cargando datos del usuario...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-12 max-w-lg mx-auto text-center">
                <AlertCircle className="w-16 h-16 text-umbrella-red mx-auto mb-6" />
                <h2 className="text-2xl font-black mb-2">Error</h2>
                <p className="text-gray-500 mb-8">{fetchError}</p>
                <Link href="/admin/usuarios" className="bg-umbrella-red text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm">
                    Volver a Usuarios
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 md:p-12 max-w-3xl mx-auto w-full">
            {/* Breadcrumb / Back Link */}
            <Link href="/admin/usuarios" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#a0b0ba] hover:text-[#597e96] uppercase mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Volver a Usuarios
            </Link>

            <div className="w-full pb-8">
                {/* Header Area */}
                <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                            Editar usuario
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1">
                            Gestiona datos y permisos del usuario: <span className="font-bold text-gray-900">{email}</span>
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-sm flex items-start gap-3 border ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-red-50 text-umbrella-red border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm font-medium pt-0.5">{message.text}</span>
                    </div>
                )}

                {/* Main Edit Form */}
                <div className="flex flex-col gap-10">

                    {/* Basic Data Section */}
                    <section className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 sm:p-8 md:p-10 flex flex-col gap-8">
                        <h2 className="text-[11px] font-bold tracking-widest text-[#a0b0ba] uppercase pb-2 border-b border-gray-100">
                            Datos del Sistema
                        </h2>
                        
                        {/* Nombre */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                Nombre completo
                            </label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({ ...errors, name: "" });
                                }}
                                className={`w-full appearance-none bg-white border ${errors.name ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all`}
                            />
                            {errors.name && <span className="text-umbrella-red text-[10px] font-bold">{errors.name}</span>}
                        </div>

                        {/* Email - Disabled */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                Correo electrónico (Identificador)
                            </label>
                            <input 
                                type="email"
                                value={email}
                                disabled
                                className="w-full appearance-none bg-gray-50 border border-gray-100 rounded text-sm text-gray-400 px-4 py-3 outline-none cursor-not-allowed"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Rol */}
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    Rol asignado
                                </label>
                                <div className="relative">
                                    <select 
                                        value={role}
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            if (errors.role) setErrors({ ...errors, role: "" });
                                        }}
                                        className={`w-full appearance-none bg-white border ${errors.role ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] pl-4 pr-10 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer`}
                                    >
                                        <option value="reader">Usuario</option>
                                        <option value="author">Autor</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.role && <span className="text-umbrella-red text-[10px] font-bold">{errors.role}</span>}
                            </div>

                            {/* Estado */}
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                                    Estado de cuenta
                                </label>
                                <div className="relative">
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full appearance-none bg-white border border-gray-200 rounded text-sm text-[#111111] pl-4 pr-10 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer"
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo / Bloqueado</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Author Profile Section - Only visible if role is author */}
                    {role === "author" && (
                        <section className="bg-[#fbfcff] rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-blue-100 p-6 sm:p-8 md:p-10 flex flex-col gap-8 transition-opacity duration-300">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-[11px] font-bold tracking-widest text-blue-600 uppercase pb-2 border-b border-blue-200/50">
                                    Perfil de Autor
                                </h2>
                                <p className="text-blue-500/60 text-[10px] italic">Información pública del redactor</p>
                            </div>

                            {/* Nombre Público & Correo Contacto */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                        Nombre público (Firma)
                                    </label>
                                    <input 
                                        type="text"
                                        value={publicName}
                                        onChange={(e) => setPublicName(e.target.value)}
                                        placeholder="Ej. E. Rodriguez"
                                        className="w-full appearance-none bg-white border border-blue-200/60 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                        Correo de contacto público
                                    </label>
                                    <input 
                                        type="text"
                                        value={contactEmail}
                                        onChange={(e) => {
                                            setContactEmail(e.target.value);
                                            if (errors.contactEmail) setErrors({ ...errors, contactEmail: "" });
                                        }}
                                        placeholder="contacto@autor.com"
                                        className={`w-full appearance-none bg-white border ${errors.contactEmail ? 'border-umbrella-red' : 'border-blue-200/60'} rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
                                    />
                                    {errors.contactEmail && <span className="text-umbrella-red text-[10px] font-bold">{errors.contactEmail}</span>}
                                </div>
                            </div>

                            {/* Biografía */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                    Biografía / Descripción
                                </label>
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Resumen del autor..."
                                    className="w-full appearance-none bg-white border border-blue-200/60 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Topics & Recognitions */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                        Temas principales
                                    </label>
                                    <input 
                                        type="text"
                                        value={mainTopics}
                                        onChange={(e) => setMainTopics(e.target.value)}
                                        placeholder="Ej. Arte, Economía, Crónica..."
                                        className="w-full appearance-none bg-white border border-blue-200/60 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                        Reconocimientos
                                    </label>
                                    <input 
                                        type="text"
                                        value={recognitions}
                                        onChange={(e) => setRecognitions(e.target.value)}
                                        placeholder="Premios o menciones..."
                                        className="w-full appearance-none bg-white border border-blue-200/60 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-blue-800/60 tracking-wide uppercase">
                                    Trayectoria profesional
                                </label>
                                <textarea 
                                    value={trajectory}
                                    onChange={(e) => setTrajectory(e.target.value)}
                                    className="w-full appearance-none bg-white border border-blue-200/60 rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-20"
                                    placeholder="Medios anteriores, carrera..."
                                />
                            </div>

                        </section>
                    )}

                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                    <Link href="/admin/usuarios" className="w-full sm:w-auto text-center px-6 py-3 text-sm font-bold text-gray-400 hover:text-[#111111] transition-colors rounded-sm hover:bg-gray-50">
                        Cancelar
                    </Link>
                    <button 
                        onClick={handleSubmit} 
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-umbrella-red hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20"
                    >
                        {saving ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, User as UserIcon, AlertCircle, CheckCircle2, Camera, Loader2, ArrowLeft, Globe, Shield } from "lucide-react";
import { ChangePasswordForm } from "@/components";
import Link from "next/link";
import Image from "next/image";

export default function AuthorProfilePage() {
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [userId, setUserId] = useState<string>("");
    
    // Profiles table fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    
    // Author Profiles table fields
    const [publicName, setPublicName] = useState("");
    const [bio, setBio] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [trajectory, setTrajectory] = useState("");
    const [mainTopics, setMainTopics] = useState("");
    const [recognitions, setRecognitions] = useState("");

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setUserId(user.id);
                setEmail(user.email || "");

                // Fetch public.profiles
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, role, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || "");
                    setAvatarUrl(profile.avatar_url);
                    setRole(profile.role === "author" ? "Autor / Redactor" : profile.role);
                }

                // Fetch public.author_profiles
                const { data: authorProfile } = await supabase
                    .from("author_profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (authorProfile) {
                    setPublicName(authorProfile.public_name || "");
                    setBio(authorProfile.bio || "");
                    setContactEmail(authorProfile.contact_email || "");
                    setTrajectory(authorProfile.trajectory || "");
                    setMainTopics(authorProfile.main_topics || "");
                    setRecognitions(authorProfile.recognitions || "");
                }
            }
            setLoading(false);
        }

        fetchProfileData();
    }, [supabase]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setMessage(null);
            setUploadingAvatar(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {upsert: true});

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            setMessage({ type: 'success', text: 'Foto de perfil actualizada con éxito.' });
            
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            setMessage({ type: 'error', text: error.message || 'Error al subir la imagen.' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (!fullName.trim()) {
            setMessage({ type: 'error', text: 'El nombre completo es obligatorio.' });
            return;
        }

        if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
            setMessage({ type: 'error', text: 'El correo de contacto público no tiene un formato válido.' });
            return;
        }

        setSaving(true);
        try {
            // Update profiles
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ full_name: fullName.trim() })
                .eq("id", userId);

            if (profileError) throw profileError;

            // Upsert author_profiles
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

            setMessage({ type: 'success', text: 'Perfil guardado correctamente.' });
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
            
        } catch (error: any) {
            console.error("Error saving profile:", error);
            setMessage({ type: 'error', text: error.message || 'Ocurrió un error al guardar el perfil.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 md:p-12 w-full flex justify-center items-center opacity-50">
                <div className="animate-spin w-8 h-8 border-2 border-umbrella-red border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
            {/* Back Button */}
            <div className="mb-8">
                <Link 
                    href="/autor/dashboard" 
                    className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-umbrella-red transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Dashboard
                </Link>
            </div>

            {/* Header Profile - Consistent with admin profile */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-100 pb-10 mb-10 text-center md:text-left">
                <div className="relative group shrink-0">
                    <div className="w-28 h-28 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300 overflow-hidden relative shadow-sm">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
                        ) : fullName ? (
                            <span className="text-4xl font-black text-[#111111]">{fullName.charAt(0).toUpperCase()}</span>
                        ) : (
                            <UserIcon className="w-12 h-12" />
                        )}
                        
                        <label className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-opacity z-10 ${uploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {uploadingAvatar ? (
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            ) : (
                                <>
                                    <Camera className="w-6 h-6 text-white mb-1" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">Cambiar</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                            />
                        </label>
                    </div>
                </div>
                
                <div className="pt-3">
                    <h1 className="font-serif text-[32px] md:text-4xl font-black text-[#111111] tracking-tight mb-2">
                        Mi Perfil Editorial
                    </h1>
                    <p className="text-gray-500 font-serif italic max-w-lg">
                        Gestiona tu información personal y los datos que verán tus lectores públicamente.
                    </p>
                </div>
            </div>

            {message && (
                <div className={`mb-10 p-5 rounded-sm flex items-start gap-4 border ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm' 
                        : 'bg-red-50 text-umbrella-red border-red-200 shadow-sm'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-medium pt-0.5">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-16">
                {/* SECTION 1: SYSTEM PROFILE */}
                <section>
                    <div className="mb-6">
                        <h2 className="font-serif text-xl font-bold text-[#111111] flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-400" />
                            Información de cuenta
                        </h2>
                    </div>
                    
                    <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Nombre completo (Interno) *
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border border-gray-200 bg-gray-50/30 p-3.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    Correo de acceso
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full border border-transparent bg-gray-50 p-3.5 text-sm text-gray-400 cursor-not-allowed rounded-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-50">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    Rol en plataforma
                                </label>
                                <div className="w-full border border-transparent bg-gray-50 p-3.5 text-sm text-gray-400 font-medium rounded-sm">
                                    {role}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    Estado de cuenta
                                </label>
                                <div className="w-full bg-emerald-50/50 border border-emerald-100 p-3.5 text-sm text-emerald-700 font-bold tracking-wider rounded-sm flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                    ACTIVA
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: PUBLIC AUTHOR PROFILE */}
                <section>
                    <div className="mb-6">
                        <h2 className="font-serif text-xl font-bold text-[#111111] flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-400" />
                            Perfil Editorial Público
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Esta información será visible para los lectores al final de tus artículos y en tu página de autor.
                        </p>
                    </div>
                    
                    <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Nombre público (Firma)
                                </label>
                                <input
                                    type="text"
                                    value={publicName}
                                    onChange={(e) => setPublicName(e.target.value)}
                                    placeholder="Dejar vacío para usar nombre interno"
                                    className="w-full border border-gray-200 bg-gray-50/30 p-3.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Correo de contacto (Público)
                                </label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    placeholder="contacto@umbrella.news"
                                    className="w-full border border-gray-200 bg-gray-50/30 p-3.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                Biografía 
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                placeholder="Escribe un breve resumen sobre ti y tu enfoque periodístico..."
                                className="w-full border border-gray-200 bg-gray-50/30 p-4 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all resize-none min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                Trayectoria (Experiencia)
                            </label>
                            <textarea
                                value={trajectory}
                                onChange={(e) => setTrajectory(e.target.value)}
                                rows={4}
                                placeholder="Medios anteriores en los que has trabajado, experiencia relevante..."
                                className="w-full border border-gray-200 bg-gray-50/30 p-4 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all resize-none min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Temas principales
                                </label>
                                <input
                                    type="text"
                                    value={mainTopics}
                                    onChange={(e) => setMainTopics(e.target.value)}
                                    placeholder="Ej: Política internacional, Medio ambiente..."
                                    className="w-full border border-gray-200 bg-gray-50/30 p-3.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Reconocimientos
                                </label>
                                <input
                                    type="text"
                                    value={recognitions}
                                    onChange={(e) => setRecognitions(e.target.value)}
                                    placeholder="Ej: Premio Pulitzer 2022..."
                                    className="w-full border border-gray-200 bg-gray-50/30 p-3.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Save block bottom */}
                <div className="flex justify-end pt-4 border-t border-gray-100 mt-12 pb-12">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex w-full md:w-auto items-center justify-center gap-2 bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white px-10 py-4 rounded-sm text-[11px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] active:scale-95"
                    >
                        {saving ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Guardar Perfil Editorial
                    </button>
                </div>
            </form>

            {/* Password Change Section */}
            <ChangePasswordForm className="mt-8 border-t border-gray-100 pt-12" />
        </div>
    );
}

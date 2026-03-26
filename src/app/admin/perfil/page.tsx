"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, User as UserIcon, AlertCircle, CheckCircle2, Camera, Loader2, ArrowLeft } from "lucide-react";
import { ChangePasswordForm } from "@/components";
import Link from "next/link";
import Image from "next/image";

export default function AdminProfilePage() {
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [userId, setUserId] = useState<string>("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setUserId(user.id);
                setEmail(user.email || "");

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, role, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || "");
                    setAvatarUrl(profile.avatar_url);
                    setRole(
                        profile.role === "admin" 
                            ? "Administrador Global" 
                            : (profile.role === "author" ? "Autor / Periodista" : profile.role)
                    );
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

        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ full_name: fullName.trim() })
                .eq("id", userId);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Perfil administrativo actualizado correctamente.' });
            setTimeout(() => setMessage(null), 3000);
            
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: error.message || 'Ocurrió un error al guardar.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 md:p-12 lg:p-16 flex justify-center items-center opacity-50">
                <div className="animate-spin w-8 h-8 border-2 border-umbrella-red border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
            {/* Back Button */}
            <div className="mb-8">
                <Link 
                    href="/admin/dashboard" 
                    className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-umbrella-red transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Dashboard
                </Link>
            </div>

            {/* Header Profile - Reusing layout from /perfil */}
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
                        Mi Perfil Admin
                    </h1>
                    <p className="text-gray-500 font-serif italic">
                        Gestiona tu información personal administrativa y de seguridad.
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

            {/* Profile Info Form */}
            <form onSubmit={handleSave} className="space-y-10">
                <section>
                    <div className="mb-6">
                        <h2 className="font-serif text-xl font-bold text-[#111111] flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            Información básica
                        </h2>
                    </div>
                    
                    <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                                    Nombre completo *
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
                                    className="w-full border border-gray-100 bg-gray-50 p-3.5 text-sm text-gray-400 cursor-not-allowed rounded-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-50">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    Rol de seguridad
                                </label>
                                <div className="w-full border border-gray-100 bg-gray-50 p-3.5 text-sm text-gray-500 font-medium rounded-sm">
                                    {role}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    Estado de sistema
                                </label>
                                <div className="w-full bg-emerald-50/50 border border-emerald-100 p-3.5 text-sm text-emerald-700 font-bold tracking-wider rounded-sm flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                    ACTIVA (SUPERUSUARIO)
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-10">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full md:w-auto items-center justify-center gap-2 bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white px-8 py-3.5 rounded-sm text-[11px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] active:scale-95"
                            >
                                {saving ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Guardar Perfil
                            </button>
                        </div>
                    </div>
                </section>
            </form>

            {/* Password Change Section - OUTSIDE main form to avoid nested forms error */}
            <ChangePasswordForm className="mt-8 border-t border-gray-100 pt-8" />
        </div>
    );
}

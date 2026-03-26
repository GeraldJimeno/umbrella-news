"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, User as UserIcon, AlertCircle, CheckCircle2, Camera, Loader2, ArrowLeft } from "lucide-react";
import { ChangePasswordForm } from "@/components";
import Link from "next/link";
import Image from "next/image";

export default function UserProfilePage() {
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
                        profile.role === "reader" 
                            ? "Lector (Usuario)" 
                            : (profile.role === "admin" ? "Administrador" : "Autor")
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
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            
            if (!allowedExtensions.includes(fileExt?.toLowerCase() || '')) {
                throw new Error("Formato inválido. Usa JPG, PNG o WEBP.");
            }

            if (file.size > 2 * 1024 * 1024) {
                throw new Error("La imagen es demasiado grande. Máximo 2MB.");
            }

            const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

            // Upload image to 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {upsert: true});

            if (uploadError) {
                if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("row-level security")) {
                    throw new Error("El sistema de almacenamiento no está configurado (Falta bucket 'avatars' o permisos).");
                }
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profiles table
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
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input
            }
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

            setMessage({ type: 'success', text: 'Tus datos se han actualizado correctamente.' });
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
            <div className="min-h-[50vh] flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-2 border-umbrella-red border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-2xl">
                {/* Back Button */}
                <div className="mb-6 text-center md:text-left">
                    <Link 
                        href="/" 
                        className="group inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-umbrella-red transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Volver al Inicio
                    </Link>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-100 pb-8 mb-8 text-center md:text-left">
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
                            ) : fullName ? (
                                <span className="text-3xl font-black text-gray-800">{fullName.charAt(0).toUpperCase()}</span>
                            ) : (
                                <UserIcon className="w-10 h-10" />
                            )}
                            
                            {/* Upload Overlay */}
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
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <h1 className="font-serif text-[28px] font-black text-[#111111] tracking-tight mb-1">
                            Mi Cuenta
                        </h1>
                        <p className="text-gray-500 font-sans text-sm">
                            Gestiona tu información personal en Umbrella News.
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

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">
                            Correo de acceso
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full border border-gray-100 bg-gray-50 p-3 text-sm text-gray-500 cursor-not-allowed rounded-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">
                                Tipo de cuenta
                            </label>
                            <div className="w-full border border-gray-100 bg-gray-50 p-3 text-sm text-gray-500 font-medium rounded-sm">
                                {role}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500">
                                Estado
                            </label>
                            <div className="w-full bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700 font-bold tracking-wider rounded-sm flex items-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                ACTIVA
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-8 flex justify-center md:justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex w-full md:w-auto items-center justify-center gap-2 bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white px-8 py-4 md:py-3.5 rounded-sm text-[11px] font-bold tracking-widest uppercase transition-colors shadow-sm"
                        >
                            {saving ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Guardar Cambios
                        </button>
                    </div>
                </form>

                {/* Password Change Section */}
                <ChangePasswordForm className="mt-6 pt-6 border-t border-gray-100" />
            </div>
            </div>
        </main>
    );
}

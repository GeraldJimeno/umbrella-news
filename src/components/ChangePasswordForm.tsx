"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, Save, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

interface ChangePasswordFormProps {
    className?: string;
}

export function ChangePasswordForm({ className = "" }: ChangePasswordFormProps) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // Form fields
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validations
        if (!newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'Ambos campos de contraseña son obligatorios.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Tu contraseña ha sido actualizada con éxito.' });
            setNewPassword("");
            setConfirmPassword("");
            
            // Clear success message after 5 seconds
            setTimeout(() => setMessage(null), 5000);
            
        } catch (error: any) {
            console.error("Error updating password:", error);
            setMessage({ type: 'error', text: error.message || 'Error al actualizar la contraseña.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={`mt-12 ${className}`}>
            <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-[#111111] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    Seguridad y Contraseña
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Cambia tu contraseña de acceso a la plataforma.
                </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {message && (
                    <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 border ${
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

                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                    <div className="space-y-2 relative">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full border border-gray-200 bg-gray-50/50 p-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-colors"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-[#111111]">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-sm transition-colors"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white px-6 py-2.5 rounded-sm text-[11px] font-bold tracking-widest uppercase transition-colors shadow-sm"
                        >
                            {saving ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Actualizar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";

export default function AdminNewUserPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Ingrese un correo electrónico válido";
        if (!role) newErrors.role = "Debe asignar un rol al usuario";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        console.log("Creando usuario", { name, email, role });
        alert(`Usuario ${name} creado exitosamente (Mock)`);
        // Here we'd typically redirect or clear the form
        setName("");
        setEmail("");
        setRole("");
    };

    return (
        <div className="p-6 sm:p-8 md:p-12 max-w-3xl mx-auto w-full">
            {/* Breadcrumb / Back Link */}
            <Link href="/admin/usuarios" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#a0b0ba] hover:text-[#597e96] uppercase mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Volver a Usuarios
            </Link>

            <div className="w-full pb-8">
                {/* Header Area */}
                <div className="mb-10 lg:mb-12 border-b border-gray-100 pb-8">
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                        Nuevo usuario
                    </h1>
                    <p className="text-[#597e96] font-sans text-sm pb-1">
                        Crea un acceso con el nivel de permisos adecuado para el sistema editorial.
                    </p>
                </div>

                {/* Form Area */}
                <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 sm:p-8 md:p-10 flex flex-col gap-8">
                    
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
                            placeholder="Ej. Ana García"
                            className={`w-full appearance-none bg-white border ${errors.name ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all`}
                        />
                        {errors.name && <span className="text-umbrella-red text-[10px] font-bold">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                            Correo electrónico
                        </label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: "" });
                            }}
                            placeholder="ana@umbrellanews.com"
                            className={`w-full appearance-none bg-white border ${errors.email ? 'border-umbrella-red' : 'border-gray-200'} rounded text-sm text-[#111111] px-4 py-3 outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all`}
                        />
                        {errors.email && <span className="text-umbrella-red text-[10px] font-bold">{errors.email}</span>}
                    </div>

                    {/* Rol */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#597e96] tracking-wide uppercase">
                            Rol del sistema
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
                                <option value="" disabled>Seleccionar nivel de acceso...</option>
                                <option value="USUARIO">Usuario (Solo lectura)</option>
                                <option value="AUTOR">Autor (Escribe y edita sus propias publicaciones)</option>
                                <option value="ADMINISTRADOR">Administrador (Acceso total al panel CMS)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.role && <span className="text-umbrella-red text-[10px] font-bold">{errors.role}</span>}
                        <p className="text-xs text-gray-400 mt-1">Este rol determinará a qué secciones del administrador y creador puede ingresar el usuario.</p>
                    </div>

                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                    <Link href="/admin/usuarios" className="w-full sm:w-auto text-center px-6 py-3 text-sm font-bold text-gray-400 hover:text-[#111111] transition-colors rounded-sm hover:bg-gray-50">
                        Cancelar
                    </Link>
                    <button onClick={handleSubmit} className="w-full sm:w-auto bg-umbrella-red hover:bg-red-700 text-white px-8 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20">
                        Crear usuario
                    </button>
                </div>

            </div>
        </div>
    );
}

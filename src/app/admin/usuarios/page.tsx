"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, Search, Edit3, Trash2, ChevronLeft, ChevronRight, ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'admin' | 'author' | 'reader';
    status: 'active' | 'inactive';
    avatar_url: string | null;
    created_at: string;
}

export default function AdminUsuariosPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("Todos los roles");
    const [activeTab, setActiveTab] = useState("Todos");

    const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) setCurrentUserId(authUser.id);

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            setError("No se pudieron cargar los usuarios. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getInitials = (name: string | null) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'ADMINISTRADOR';
            case 'author': return 'AUTOR';
            case 'reader': return 'USUARIO';
            default: return role.toUpperCase();
        }
    };

    const filteredUsers = users.filter(user => {
        // Tab filter (status)
        if (activeTab === "Activos" && user.status !== 'active') return false;
        if (activeTab === "Inactivos" && user.status !== 'inactive') return false;

        // Role filter
        if (selectedRole !== "Todos los roles") {
            const roleMatch = 
                (selectedRole === "Administradores" && user.role === "admin") ||
                (selectedRole === "Autores" && user.role === "author") ||
                (selectedRole === "Usuarios" && user.role === "reader");
            if (!roleMatch) return false;
        }

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = (user.full_name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const role = getRoleLabel(user.role).toLowerCase();
            
            return name.includes(q) || email.includes(q) || role.includes(q);
        }

        return true;
    });

    const openDeleteModal = (id: string, name: string) => {
        setActionMessage(null);
        setUserToDelete({ id, name });
    };

    const closeDeleteModal = () => {
        if (actionLoading) return;
        setUserToDelete(null);
        setActionMessage(null);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        
        // Safety check: Prevent self-deactivation
        if (userToDelete.id === currentUserId) {
            setActionMessage({ type: 'error', text: 'No puedes desactivar tu propia cuenta.' });
            return;
        }

        setActionLoading(true);
        setActionMessage(null);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ status: 'inactive' })
                .eq("id", userToDelete.id);

            if (error) throw error;

            setActionMessage({ type: 'success', text: 'Usuario desactivado correctamente.' });
            
            // Wait a moment and then refresh/close
            setTimeout(async () => {
                await fetchUsers(); // Refresh the list
                closeDeleteModal();
            }, 1500);

        } catch (err: any) {
            console.error("Error deactivating user:", err);
            setActionMessage({ type: 'error', text: 'Error al intentar desactivar el usuario.' });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <div className="w-full pb-8">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-2 md:mb-3">
                            Usuarios
                        </h1>
                        <p className="text-[#597e96] font-sans text-sm pb-1">
                            Gestiona los accesos y permisos del sistema editorial
                        </p>
                    </div>
                    
                    <div className="flex items-center shrink-0 pt-2 w-full md:w-auto">
                        <Link href="/admin/usuarios/nuevo" className="flex flex-1 md:flex-none justify-center items-center gap-2 bg-umbrella-red hover:bg-red-700 text-white px-6 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20">
                            <UserPlus className="w-4 h-4" />
                            Nuevo usuario
                        </Link>
                    </div>
                </div>

                {/* Filters Area */}
                <div className="mt-8 md:mt-10 flex flex-col md:flex-row gap-4 md:items-center justify-between border-b border-gray-100 pb-8">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por nombre, email o cargo..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all"
                            />
                        </div>

                        {/* Dropdown */}
                        <div className="relative w-full sm:w-auto shrink-0">
                            <select 
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="appearance-none w-full sm:w-40 pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#111111] outline-none focus:border-umbrella-red focus:ring-1 focus:ring-umbrella-red transition-all cursor-pointer"
                            >
                                <option>Todos los roles</option>
                                <option>Administradores</option>
                                <option>Autores</option>
                                <option>Usuarios</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Tabs / Pills */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar shrink-0 pt-2 md:pt-0">
                        {['Todos', 'Activos', 'Inactivos'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'bg-umbrella-red/10 text-umbrella-red' 
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-8 min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-umbrella-red rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-bold text-sm tracking-wide">Cargando usuarios...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="w-10 h-10 text-umbrella-red mb-4" />
                            <h3 className="text-red-900 font-bold mb-2">Error de conexión</h3>
                            <p className="text-red-700 text-sm max-w-md mb-6">{error}</p>
                            <button 
                                onClick={fetchUsers}
                                className="bg-umbrella-red text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-bold bg-white rounded-xl border border-gray-100">
                            No se encontraron usuarios con estos filtros.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-200 hover:shadow-md group">
                                
                                {/* User Info */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4f7f9] text-[#597e96] border border-gray-200 flex items-center justify-center shrink-0">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.full_name || ""} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold tracking-wider">{getInitials(user.full_name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex flex-col">
                                        <span className="font-bold text-[#111111] leading-tight truncate">
                                            {user.full_name || "Sin nombre"}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate mt-0.5 w-[200px] sm:w-[250px] overflow-hidden text-ellipsis">
                                            {user.email || "Sin email"}
                                        </span>
                                    </div>
                                </div>

                                {/* Attributes & Actions */}
                                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t border-gray-100 md:border-0 pt-4 md:pt-0 mt-2 md:mt-0 w-full md:w-auto">
                                    {/* Role Pill */}
                                    <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full whitespace-nowrap ${
                                        user.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-700' 
                                            : user.role === 'author' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                    }`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                    
                                    {/* Status */}
                                    <div className="flex items-center gap-2 shrink-0 w-[60px]">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                                            {user.status === 'active' ? 'Activo' : 'Inac.'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-4 shrink-0 border-l border-gray-100 pl-4">
                                        <Link href={`/admin/usuarios/${user.id}`} className="text-gray-400 hover:text-[#597e96] transition-colors" title="Editar" aria-label="Editar usuario">
                                            <Edit3 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                        </Link>
                                        <button onClick={() => openDeleteModal(user.id, user.full_name || "Usuario")} className="text-gray-400 hover:text-umbrella-red transition-colors" title="Eliminar" aria-label="Eliminar usuario">
                                            <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>
                                </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="mt-10 flex items-center justify-center pt-8">
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-transparent text-gray-400 hover:bg-gray-50 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-umbrella-red text-white font-bold text-sm shadow-sm transition-colors">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-transparent text-[#111111] hover:bg-gray-50 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {userToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity text-left">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6 sm:p-8">
                                <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2 leading-tight">
                                    Desactivar usuario
                                </h3>
                                <p className="text-[#597e96] text-sm mb-6 leading-relaxed">
                                    ¿Estás seguro de que deseas desactivar a <strong className="text-[#111111]">{userToDelete.name}</strong>? El usuario dejará de tener acceso a la plataforma (Backend no conectado a Auth).
                                </p>

                                {actionMessage && (
                                    <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 border ${
                                        actionMessage.type === 'success' 
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                            : 'bg-red-50 text-umbrella-red border-red-200'
                                    }`}>
                                        {actionMessage.type === 'success' ? (
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        )}
                                        <span className="text-sm font-medium pt-0.5">{actionMessage.text}</span>
                                    </div>
                                )}

                                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4 mt-2">
                                    <button 
                                        onClick={closeDeleteModal}
                                        disabled={actionLoading}
                                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors rounded-sm disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        disabled={actionLoading}
                                        className="w-full sm:w-auto bg-umbrella-red hover:bg-red-700 text-white px-6 py-2.5 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 disabled:bg-gray-400"
                                    >
                                        {actionLoading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                        {actionLoading ? "Desactivando..." : "Confirmar Desactivación"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

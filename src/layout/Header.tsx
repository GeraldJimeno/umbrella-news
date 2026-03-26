import { MapPin, Sun } from "lucide-react";
import { Button } from '@/components/ui';
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
    let role = "reader";
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
            role = data?.role || "reader";
        }
    } catch (error) {
        console.error("Error fetching session in Header:", error);
    }
    const today = new Date().toLocaleDateString('es-DO', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'America/Santo_Domingo'
    }).toUpperCase();

    return (
        <div className="bg-[#111111] text-gray-400 text-xs py-1.5 font-sans border-b border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="hidden md:block uppercase tracking-wider">
                        <span>{today}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6 uppercase tracking-wider font-semibold">
                    {role === "author" && (
                        <Link href="/autor/dashboard" className="hover:text-white transition-colors">
                            MODO AUTOR
                        </Link>
                    )}
                    {role === "admin" && (
                        <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                            MODO ADMIN
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

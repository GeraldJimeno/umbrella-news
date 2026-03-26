"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    category_id: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon_name?: string;
    subcategories: Subcategory[];
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);
                
                // Fetch all categories
                const { data: catData, error: catError } = await supabase
                    .from("categories")
                    .select("*")
                    .order("name", { ascending: true });

                if (catError) throw catError;

                // Fetch all subcategories
                const { data: subData, error: subError } = await supabase
                    .from("subcategories")
                    .select("*")
                    .order("name", { ascending: true });

                if (subError) throw subError;

                // Build hierarchy
                const structured: Category[] = (catData || []).map(cat => ({
                    ...cat,
                    subcategories: (subData || []).filter(sub => sub.category_id === cat.id)
                }));

                setCategories(structured);
            } catch (err: any) {
                console.error("Error fetching categories for navigation:", err);
                setError(err.message || "Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, [supabase]);

    return { categories, loading, error };
}

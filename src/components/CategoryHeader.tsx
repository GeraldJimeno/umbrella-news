import Link from "next/link";
import { Container } from "@/layout/Container";
import React from "react";

interface CategoryHeaderProps {
    title: string;
    subcategories?: { name: string; href: string }[];
    activeSubcategory?: string;
}

export function CategoryHeader({
    title,
    subcategories = [],
    activeSubcategory
}: CategoryHeaderProps) {
    return (
        <div className="bg-white">
            <Container className="pt-10 pb-2 flex flex-col items-start w-full">
                {/* Large Editorial Title */}
                <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] font-black text-black leading-none mb-4 -ml-1 tracking-tight">
                    {title}
                </h1>
                
                {/* Thin Subcategories Navbar */}
                <div className="w-full border-t border-b border-black border-t-gray-200 py-2.5 flex flex-wrap items-center gap-6">
                    {subcategories && subcategories.length > 0 && (
                        subcategories.map((sub) => (
                            <Link
                                key={sub.name}
                                href={sub.href}
                                className={`text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200 pb-1 border-b-2 -mb-[11px]
                                ${
                                    sub.name === activeSubcategory
                                        ? 'text-umbrella-red border-umbrella-red'
                                        : 'text-gray-500 hover:text-black border-transparent hover:border-black/30'
                                }`}
                            >
                                {sub.name}
                            </Link>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
}

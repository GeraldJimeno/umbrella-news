import { Mail } from "lucide-react";

interface AuthorContactProps {
    email?: string;
    description?: string;
}

export function AuthorContact({
    email = "erodriguez@umbrellanews.com",
    description = "Para colaboraciones, prensa o consultas sobre reportajes, puede contactar vía directa.",
}: AuthorContactProps) {
    return (
        <section className="bg-white border border-gray-200 rounded p-6">
            <h3 className="font-bold text-base mb-2">
                Contacto
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {description}
            </p>

            {/* Email */}
            <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-umbrella-red transition-colors mb-5"
            >
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{email}</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {/* X / Twitter */}
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
            </div>
        </section>
    );
}

interface NewsletterSignupProps {
    title?: string;
    description?: string;
    buttonText?: string;
    className?: string;
}

export function NewsletterSignup({
    title = "Mantente informado",
    description = "Recibe las noticias más importantes directamente en tu correo.",
    buttonText = "SUSCRIBIRME",
    className = "",
}: NewsletterSignupProps) {
    return (
        <div className={`bg-gray-800 rounded p-6 ${className}`}>
            <h3 className="text-white font-bold text-base mb-2">
                {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {description}
            </p>
            <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full bg-white text-sm text-gray-800 placeholder-gray-400 px-4 py-3 rounded mb-3 outline-none focus:ring-2 focus:ring-umbrella-red transition-shadow"
            />
            <button className="w-full bg-umbrella-red text-white text-xs font-bold tracking-widest uppercase py-3 rounded hover:bg-red-700 transition-colors">
                {buttonText}
            </button>
        </div>
    );
}

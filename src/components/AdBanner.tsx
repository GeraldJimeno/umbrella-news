interface AdBannerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    label?: string;
}

export function AdBanner({
    orientation = 'horizontal',
    className = '',
    label = 'PUBLICIDAD'
}: AdBannerProps) {
    const isHorizontal = orientation === 'horizontal';

    return (
        <div
            className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold tracking-widest uppercase
        ${isHorizontal ? 'w-full h-32 my-12' : 'w-full h-[600px] sticky top-32'} 
        ${className}`}
        >
            <span>{label} {isHorizontal ? 'HORIZONTAL BANNER' : 'VERTICAL'}</span>
        </div>
    );
}

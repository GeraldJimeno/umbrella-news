import Image from 'next/image';

interface ArticleHeroImageProps {
    imageUrl: string;
    altText: string;
    caption?: string;
}

export function ArticleHeroImage({ imageUrl, altText, caption }: ArticleHeroImageProps) {
    return (
        <figure className="my-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            {caption && (
                <figcaption className="mt-3 text-xs sm:text-sm text-gray-500 font-sans italic border-l-2 border-gray-300 pl-3">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

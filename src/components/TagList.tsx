import Link from "next/link";

interface TagListProps {
    tags: string[];
}

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

export function TagList({ tags }: TagListProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
            {tags.map((tag) => (
                <Link
                    key={tag}
                    href={`/tag/${toSlug(tag)}`}
                    className="bg-gray-100/80 hover:bg-gray-200 transition-colors text-gray-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
                >
                    #{tag}
                </Link>
            ))}
        </div>
    );
}

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';

/**
 * Server-side API route to fetch Sanity article metadata for saved articles.
 * Accepts an array of Sanity post IDs and returns title, slug, image, category, date.
 */
export async function POST(request: NextRequest) {
    try {
        const { postIds } = await request.json();

        if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
            return NextResponse.json({ articles: [] });
        }

        const safeIds = postIds.slice(0, 50);

        const query = `*[_type == "post" && _id in $ids] {
            _id,
            title,
            "slug": slug.current,
            mainImage,
            categorySlug,
            publishedAt
        }`;

        const articles = await client.fetch(query, { ids: safeIds });

        const mapped = (articles || []).map((a: any) => ({
            _id: a._id,
            title: a.title,
            slug: a.slug,
            imageUrl: a.mainImage ? urlFor(a.mainImage).width(320).height(240).url() : null,
            category: a.categorySlug || null,
            publishedAt: a.publishedAt
        }));

        return NextResponse.json({ articles: mapped });
    } catch (err) {
        console.error('[saved-articles-meta] Error:', err);
        return NextResponse.json({ articles: [] }, { status: 500 });
    }
}

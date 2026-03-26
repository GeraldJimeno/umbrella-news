"use server";

import { client } from "./client";

/**
 * Fetch all news for admin dashboard
 */
export async function getAdminNews() {
    try {
        const query = `*[_type == "post"] | order(_createdAt desc) {
            _id,
            title,
            status,
            categorySlug,
            publishedAt,
            "author": coalesce(author->name, authorName, "Redacción Umbrella"),
            "slug": slug.current
        }`;
        return await client.fetch(query);
    } catch (error) {
        console.error("Error fetching admin news from server:", error);
        throw error;
    }
}

/**
 * Fetch news for a specific author
 */
export async function getAuthorNews(userId: string) {
    try {
        const query = `*[_type == "post" && author->supabaseUserId == $userId] | order(_createdAt desc) {
            _id,
            title,
            status,
            categorySlug,
            publishedAt,
            "slug": slug.current
        }`;
        return await client.fetch(query, { userId });
    } catch (error) {
        console.error("Error fetching author news from server:", error);
        throw error;
    }
}

/**
 * Fetch multiple data points for the author dashboard summary
 */
export async function getAuthorDashboardData(userId: string) {
    try {
        const query = `{
            "latestPosts": *[_type == "post" && author->supabaseUserId == $userId] | order(_createdAt desc)[0...4] {
                _id,
                title,
                status,
                publishedAt,
                mainImage,
                "slug": slug.current
            },
            "pendingCount": count(*[_type == "post" && author->supabaseUserId == $userId && status != 'published'])
        }`;
        return await client.fetch(query, { userId });
    } catch (error) {
        console.error("Error fetching author dashboard data from server:", error);
        throw error;
    }
}
/**
 * Fetch stats and latest news for the admin dashboard
 */
export async function getAdminDashboardData() {
    try {
        const query = `{
            "totalArticles": count(*[_type == "post"]),
            "publishedArticles": count(*[_type == "post" && status == "published"]),
            "draftArticles": count(*[_type == "post" && status == "draft"]),
            "latestArticles": *[_type == "post"] | order(_createdAt desc)[0...5] {
                _id,
                title,
                status,
                "author": coalesce(author->name, authorName, "Redacción Umbrella"),
                publishedAt,
                _createdAt,
                "slug": slug.current
            }
        }`;
        return await client.fetch(query);
    } catch (error) {
        console.error("Error fetching admin dashboard data from server:", error);
        throw error;
    }
}

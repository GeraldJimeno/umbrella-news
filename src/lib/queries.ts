// Sanity GROQ Queries for fetching content
// Replace these placeholders with actual queries during implementation

export const ALL_ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc)`;
export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0]`;
export const CATEGORIES_QUERY = `*[_type == "category"]`;
export const TAGS_QUERY = `*[_type == "tag"]`;

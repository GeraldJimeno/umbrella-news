// Core TypeScript definitions for the Umbrella News project

export interface Author {
    _id: string;
    name: string;
    slug: { current: string };
    image?: any;
    bio?: any;
}

export interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
}

export interface Tag {
    _id: string;
    title: string;
    slug: { current: string };
}

export interface Article {
    _id: string;
    title: string;
    subtitle?: string;
    slug: { current: string };
    excerpt?: string;
    body?: any;
    featuredImage?: any;
    author?: Author;
    category?: Category;
    tags?: Tag[];
    publishedAt: string;
    readingTime?: number;
}

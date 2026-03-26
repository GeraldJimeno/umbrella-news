// Shared utility functions

/**
 * Formats a given date string into a localized, human-readable format.
 * Example outputs: "March 15, 2026" or "15 de marzo de 2026" depending on locale.
 */
export function formatDate(dateString: string, locale: string = 'es-ES'): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

/**
 * Calculates a rough reading time based on text length (assuming ~200 words per minute).
 */
export function calculateReadingTime(text: string): number {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
}

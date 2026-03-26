export interface Subcategory {
    name: string;
    slug: string;
}

export interface NavCategory {
    name: string;
    href: string;
    icon?: string;
    subcategories?: Subcategory[];
}

/**
 * Shared navigation data used by both the desktop navbar dropdown
 * and the mobile hamburger drawer.
 */
export const NAV_CATEGORIES: NavCategory[] = [
    { name: "Portada", href: "/", icon: "umbrella" },
    {
        name: "País",
        href: "/categoria/pais",
        subcategories: [
            { name: "Política", slug: "politica" },
            { name: "Gobierno", slug: "gobierno" },
            { name: "Justicia", slug: "justicia" },
            { name: "Comunidades", slug: "comunidades" },
        ],
    },
    {
        name: "Global",
        href: "/categoria/global",
        subcategories: [
            { name: "EE.UU.", slug: "eeuu" },
            { name: "Europa", slug: "europa" },
            { name: "Asia", slug: "asia" },
            { name: "Latinoamérica", slug: "latinoamerica" },
        ],
    },
    {
        name: "Economía",
        href: "/categoria/economia",
        subcategories: [
            { name: "Finanzas", slug: "finanzas" },
            { name: "Energía", slug: "energia" },
            { name: "Empleo", slug: "empleo" },
            { name: "Industria", slug: "industria" },
        ],
    },
    {
        name: "Educación",
        href: "/categoria/educacion",
        subcategories: [
            { name: "Universidades", slug: "universidades" },
            { name: "Escuelas", slug: "escuelas" },
            { name: "EdTech", slug: "edtech" },
            { name: "Becas", slug: "becas" },
        ],
    },
    {
        name: "Salud",
        href: "/categoria/salud",
        subcategories: [
            { name: "Bienestar", slug: "bienestar" },
            { name: "Nutrición", slug: "nutricion" },
            { name: "Investigación", slug: "investigacion" },
            { name: "Salud Mental", slug: "salud-mental" },
        ],
    },
    {
        name: "Deportes",
        href: "/categoria/deportes",
        subcategories: [
            { name: "Béisbol", slug: "beisbol" },
            { name: "Baloncesto", slug: "baloncesto" },
            { name: "Fútbol", slug: "futbol" },
            { name: "Voleibol", slug: "voleibol" },
        ],
    },
    {
        name: "Entretenimiento",
        href: "/categoria/entretenimiento",
        subcategories: [
            { name: "Cine", slug: "cine" },
            { name: "Música", slug: "musica" },
            { name: "Series", slug: "series" },
            { name: "Farándula", slug: "farandula" },
        ],
    },
    {
        name: "Negocios",
        href: "/categoria/negocios",
        subcategories: [
            { name: "Emprendimiento", slug: "emprendimiento" },
            { name: "Empresas", slug: "empresas" },
            { name: "Mercados", slug: "mercados" },
            { name: "Innovación", slug: "innovacion" },
        ],
    },
    {
        name: "Tecnología",
        href: "/categoria/tecnologia",
        subcategories: [
            { name: "IA", slug: "ia" },
            { name: "Software", slug: "software" },
            { name: "Ciberseguridad", slug: "ciberseguridad" },
            { name: "Gadgets", slug: "gadgets" },
        ],
    },
];

/**
 * Desktop navbar uses a subset of categories (no Opinión, Videos, Fotogalerías).
 * The uppercase names match the existing navbar style.
 */
export const DESKTOP_CATEGORIES = NAV_CATEGORIES.map((cat) => ({
    ...cat,
    displayName: cat.name.toUpperCase(),
}));

interface AuthorBioProps {
    trajectory?: string;
    closingParagraph?: string;
    mainTopics?: string[];
    recognitions?: string[];
}

export function AuthorBio({
    trajectory,
    closingParagraph,
    mainTopics = [],
    recognitions = [],
}: AuthorBioProps) {
    if (!trajectory && !closingParagraph && mainTopics.length === 0 && recognitions.length === 0) {
        return null;
    }

    const hasInfoBlocks = mainTopics.length > 0 || recognitions.length > 0;

    return (
        <section>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-black italic mb-6">
                Trayectoria Profesional
            </h2>

            {trajectory && (
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
                    {trajectory}
                </p>
            )}

            {/* Info Blocks */}
            {hasInfoBlocks && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded overflow-hidden mb-8">
                    {/* Main Topics */}
                    <div className="bg-white p-5">
                        <h4 className="font-bold text-sm tracking-wide mb-3">
                            Temas principales
                        </h4>
                        {mainTopics.length > 0 ? (
                            <ul className="space-y-1.5">
                                {mainTopics.map((topic) => (
                                    <li key={topic} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-gray-400 mt-0.5">•</span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No especificado</p>
                        )}
                    </div>

                    {/* Recognitions */}
                    <div className="bg-white p-5">
                        <h4 className="font-bold text-sm tracking-wide mb-3">
                            Reconocimientos
                        </h4>
                        {recognitions.length > 0 ? (
                            <ul className="space-y-1.5">
                                {recognitions.map((item) => (
                                    <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-gray-400 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No especificado</p>
                        )}
                    </div>
                </div>
            )}

            {/* Closing Paragraph */}
            {closingParagraph && (
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {closingParagraph}
                </p>
            )}
        </section>
    );
}

import { Share2, MessageSquare } from 'lucide-react';
import { BookmarkButton } from './BookmarkButton';

interface ShareButtonsProps {
    onCommentClick?: () => void;
    sanityPostId?: string;
}

export function ShareButtons({ onCommentClick, sanityPostId }: ShareButtonsProps) {
    const buttonClass = "w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700";

    return (
        <div className="flex items-center space-x-2">
            <button className={buttonClass} aria-label="Compartir">
                <Share2 className="w-4 h-4" />
            </button>
            <button className={buttonClass} aria-label="Comentar" onClick={onCommentClick}>
                <MessageSquare className="w-4 h-4" />
            </button>
            {sanityPostId ? (
                <BookmarkButton sanityPostId={sanityPostId} className={buttonClass} />
            ) : (
                <button className={buttonClass} aria-label="Guardar">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
            )}
        </div>
    );
}

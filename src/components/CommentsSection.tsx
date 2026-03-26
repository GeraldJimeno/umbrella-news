"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Trash2, ShieldAlert, Loader2, User as UserIcon, X, AlertTriangle } from "lucide-react";
import { Button } from "./ui";
import Image from "next/image";

interface CommentProfile {
    id: string;
    full_name: string;
    avatar_url: string;
    role: string;
}

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    status: 'visible' | 'hidden' | 'deleted';
    profiles?: CommentProfile | null;
}

interface CommentsSectionProps {
    sanityPostId: string;
}

interface ConfirmState {
    show: boolean;
    commentId: string;
    commentUserId: string; // the owner of the comment being acted on
    message: string;
}

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

export function CommentsSection({ sanityPostId }: CommentsSectionProps) {
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
    const [userRole, setUserRole] = useState<string>("reader");
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({ show: false, commentId: '', commentUserId: '', message: '' });
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
    }, []);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role, full_name, avatar_url")
                    .eq("id", authUser.id)
                    .single();
                if (profile) {
                    setUserRole(profile.role);
                    setUserProfile({
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url
                    });
                }
            }

            await fetchComments();
            setLoading(false);
        }

        loadData();
    }, [sanityPostId]);

    async function fetchComments() {
        // Step 1: Fetch comments (no join)
        const { data: commentsData, error: fetchError } = await supabase
            .from("comments")
            .select("id, content, created_at, user_id, status")
            .eq("sanity_post_id", sanityPostId)
            .eq("status", "visible")
            .order("created_at", { ascending: false });

        if (fetchError) {
            console.error("Error fetching comments:", fetchError);
            setError("No se pudieron cargar los comentarios.");
            return;
        }

        if (!commentsData || commentsData.length === 0) {
            setComments([]);
            return;
        }

        // Step 2: Fetch profiles via server-side API route (bypasses profiles RLS)
        const userIds = Array.from(new Set(commentsData.map(c => c.user_id)));

        let profilesMap: Record<string, CommentProfile> = {};
        try {
            const res = await fetch('/api/comment-profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds })
            });
            if (res.ok) {
                const { profiles } = await res.json();
                if (profiles) {
                    profiles.forEach((p: CommentProfile) => {
                        profilesMap[p.id] = p;
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching comment profiles:", err);
        }

        // Step 3: Merge
        const mergedComments: Comment[] = commentsData.map(comment => ({
            ...comment,
            profiles: profilesMap[comment.user_id] || null
        }));

        setComments(mergedComments);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const content = newComment.trim();
        if (!content || !user) return;

        setSubmitting(true);
        setError(null);

        const { error: insertError } = await supabase
            .from("comments")
            .insert({
                sanity_post_id: sanityPostId,
                user_id: user.id,
                content,
                status: 'visible'
            });

        if (insertError) {
            console.error("Error posting comment:", insertError);
            setError("Error al publicar el comentario.");
        } else {
            setNewComment("");
            await fetchComments();
            showToast("Comentario publicado.", "success");
        }
        setSubmitting(false);
    }

    // Unified: show confirm dialog, storing both commentId AND commentUserId
    function requestAction(commentId: string, commentUserId: string, isOwner: boolean) {
        setConfirmDialog({
            show: true,
            commentId,
            commentUserId,
            message: isOwner
                ? '¿Estás seguro de que quieres eliminar este comentario?'
                : '¿Ocultar este comentario (Moderación)?'
        });
    }

    function cancelConfirm() {
        setConfirmDialog({ show: false, commentId: '', commentUserId: '', message: '' });
    }

    async function executeConfirmAction() {
        const { commentId, commentUserId } = confirmDialog;
        cancelConfirm();

        // PRIORITY: ownership ALWAYS wins over admin role
        const isOwner = user?.id === commentUserId;
        // Owner → soft delete (status='deleted'), Non-owner admin → hide (status='hidden')
        const newStatus = isOwner ? 'deleted' : 'hidden';
        const actionLabel = isOwner ? 'eliminar' : 'ocultar';

        // Build update query
        let query = supabase
            .from("comments")
            .update({ status: newStatus })
            .eq("id", commentId);

        // For ownership-based delete, explicitly scope to own user_id
        if (isOwner) {
            query = query.eq("user_id", user.id);
        }

        const result = await query;

        // PostgREST may return an empty error object {} after a successful UPDATE
        // because the RLS SELECT policy (status='visible') can't see the now-hidden/deleted row.
        // We check for a REAL error (has .message) to distinguish.
        const isRealError = result.error
            && typeof result.error === 'object'
            && ('message' in result.error && result.error.message);

        if (isRealError) {
            console.error(`Error al ${actionLabel} comentario:`, JSON.stringify(result.error));
            showToast(`No se pudo ${actionLabel} el comentario.`, "error");
        } else {
            setComments(prev => prev.filter(c => c.id !== commentId));
            showToast(
                isOwner ? "Comentario eliminado." : "Comentario ocultado.",
                "success"
            );
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto relative">
            {/* Custom Confirm Dialog */}
            {confirmDialog.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6">
                        <div className="flex items-start gap-3 mb-5">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{confirmDialog.message}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelConfirm}
                                className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-gray-500 hover:text-gray-800 border border-gray-200 rounded-sm transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeConfirmAction}
                                className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-white bg-umbrella-red hover:bg-red-700 rounded-sm transition-colors shadow-sm"
                            >
                                {user?.id === confirmDialog.commentUserId ? 'Eliminar' : 'Ocultar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-bold tracking-wide transition-all ${toast.type === 'success'
                    ? 'bg-black text-white'
                    : 'bg-umbrella-red text-white'
                    }`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="opacity-60 hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-6">
                <MessageSquare className="w-6 h-6 text-umbrella-red" />
                <h2 className="font-serif text-2xl font-black text-black">
                    Comentarios <span className="text-gray-400 font-sans text-lg ml-2">{comments.length}</span>
                </h2>
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                            {userProfile?.avatar_url ? (
                                <Image
                                    src={userProfile.avatar_url}
                                    alt="Tu avatar"
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            ) : (
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="w-full border border-gray-200 rounded-sm p-4 text-sm focus:outline-none focus:border-black min-h-[100px] bg-white transition-colors"
                            />
                            {error && <p className="text-xs text-umbrella-red font-bold">{error}</p>}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="bg-black text-white px-8 py-2 rounded-sm text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 disabled:bg-gray-200 transition-all shadow-sm"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar Comentario"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 border border-gray-100 p-8 text-center rounded-lg mb-12">
                    <p className="text-gray-600 mb-6 font-medium">Inicia sesión para participar en la conversación.</p>
                    <Button
                        onClick={() => window.location.href = '/login'}
                        className="bg-black text-white px-8 py-3 rounded-sm text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-shadow shadow-md"
                    >
                        Iniciar Sesión
                    </Button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-10">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-400 font-serif italic py-8">
                        No hay comentarios todavía. Sé el primero en opinar.
                    </p>
                ) : (
                    comments.map((comment) => {
                        const isOwner = user?.id === comment.user_id;
                        const isAdmin = userRole === 'admin';
                        // Show delete for own comments, hide for admin on others' comments
                        const canDelete = isOwner;
                        const canModerate = isAdmin && !isOwner;

                        return (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                                    {comment.profiles?.avatar_url ? (
                                        <img
                                            src={comment.profiles.avatar_url}
                                            alt={comment.profiles.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-400">
                                            {(comment.profiles?.full_name || "U").charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-black tracking-tight">
                                                {comment.profiles?.full_name || "Usuario de Umbrella"}
                                            </span>
                                            {comment.profiles?.role === 'admin' && (
                                                <span className="text-[9px] font-black bg-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                                    Staff
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                                                {formatDate(comment.created_at)}
                                            </span>
                                        </div>

                                        {/* Actions — owner delete always takes priority over admin moderate */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canDelete && (
                                                <button
                                                    onClick={() => requestAction(comment.id, comment.user_id, true)}
                                                    className="p-1.5 text-gray-400 hover:text-umbrella-red transition-colors"
                                                    title="Eliminar mi comentario"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {canModerate && (
                                                <button
                                                    onClick={() => requestAction(comment.id, comment.user_id, false)}
                                                    className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                                                    title="Ocultar (Moderación)"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}

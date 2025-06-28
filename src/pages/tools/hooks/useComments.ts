// src/pages/tools/hooks/useComments.ts
import {
    createComment as apiCreateComment,
    deleteComment as apiDeleteComment,
    reportComment as apiReportComment,
    updateComment as apiUpdateComment,
    voteComment as apiVoteComment,
    getComments,
} from '@/lib/api';
import { type Comment, type CommentFilters, type CommentReportData, type CommentResponse } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useComments(toolId: string, initialFilters: CommentFilters = {}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<CommentResponse['pagination'] | null>(null);
    const [filters, setFilters] = useState<CommentFilters>({
        page: 1,
        limit: 20,
        sort: 'newest',
        ...initialFilters,
    });

    const fetchComments = useCallback(async (resetComments = true) => {
        try {
            setIsLoading(true);
            const response = await getComments(toolId, filters);
            
            if (resetComments) {
                setComments(response.comments);
            } else {
                setComments(prev => [...prev, ...response.comments]);
            }
            
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            setError('Failed to load comments');
            console.log(err)
            toast.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    }, [toolId, filters]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const createComment = async (content: string, parentComment?: string) => {
        try {
            const newComment = await apiCreateComment(toolId, { content, parentComment });
            
            if (parentComment) {
                // Update replies for parent comment
                setComments(prev => prev.map(comment => {
                    if (comment._id === parentComment) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newComment],
                            replyCount: comment.replyCount + 1,
                        };
                    }
                    return comment;
                }));
            } else {
                // Add new top-level comment
                setComments(prev => [newComment, ...prev]);
                setPagination(prev => prev ? {
                    ...prev,
                    totalComments: prev.totalComments + 1,
                } : null);
            }
            
            toast.success('Comment posted successfully!');
        } catch (err) {
            toast.error('Failed to post comment');
            throw err;
        }
    };

    const updateComment = async (commentId: string, content: string) => {
        try {
            const updatedComment = await apiUpdateComment(toolId, commentId, { content });
            
            setComments(prev => prev.map(comment => {
                if (comment._id === commentId) {
                    return updatedComment;
                }
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply => 
                            reply._id === commentId ? updatedComment : reply
                        ),
                    };
                }
                return comment;
            }));
            
            toast.success('Comment updated successfully!');
        } catch (err) {
            toast.error('Failed to update comment');
            throw err;
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await apiDeleteComment(toolId, commentId);
            
            setComments(prev => prev.filter(comment => {
                if (comment._id === commentId) {
                    return false;
                }
                if (comment.replies) {
                    comment.replies = comment.replies.filter(reply => reply._id !== commentId);
                    if (comment.replies.length !== comment.replyCount) {
                        comment.replyCount = comment.replies.length;
                    }
                }
                return true;
            }));
            
            setPagination(prev => prev ? {
                ...prev,
                totalComments: prev.totalComments - 1,
            } : null);
            
            toast.success('Comment deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete comment');
            throw err;
        }
    };

    const voteComment = async (commentId: string, voteType: 'upvote' | 'downvote') => {
        try {
            const response = await apiVoteComment(toolId, commentId, voteType);
            
            setComments(prev => prev.map(comment => {
                if (comment._id === commentId) {
                    const newVotes = { ...comment.votes };
                    if (response.action === 'added') {
                        newVotes[voteType === 'upvote' ? 'upvotes' : 'downvotes']++;
                    } else if (response.action === 'removed') {
                        newVotes[voteType === 'upvote' ? 'upvotes' : 'downvotes']--;
                    } else if (response.action === 'changed') {
                        if (voteType === 'upvote') {
                            newVotes.upvotes++;
                            newVotes.downvotes--;
                        } else {
                            newVotes.downvotes++;
                            newVotes.upvotes--;
                        }
                    }
                    return { ...comment, votes: newVotes };
                }
                
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply => {
                            if (reply._id === commentId) {
                                const newVotes = { ...reply.votes };
                                if (response.action === 'added') {
                                    newVotes[voteType === 'upvote' ? 'upvotes' : 'downvotes']++;
                                } else if (response.action === 'removed') {
                                    newVotes[voteType === 'upvote' ? 'upvotes' : 'downvotes']--;
                                } else if (response.action === 'changed') {
                                    if (voteType === 'upvote') {
                                        newVotes.upvotes++;
                                        newVotes.downvotes--;
                                    } else {
                                        newVotes.downvotes++;
                                        newVotes.upvotes--;
                                    }
                                }
                                return { ...reply, votes: newVotes };
                            }
                            return reply;
                        }),
                    };
                }
                
                return comment;
            }));
        } catch (err) {
            toast.error('Failed to vote on comment');
            throw err;
        }
    };

    const reportComment = async (commentId: string, reportData:CommentReportData) => {
        try {
            await apiReportComment(toolId, commentId, reportData as CommentReportData);
            toast.success('Comment reported successfully');
        } catch (err) {
            toast.error('Failed to report comment');
            throw err;
        }
    };

    const loadMore = async () => {
        if (!pagination?.hasNextPage) return;
        
        setFilters(prev => ({
            ...prev,
            page: (prev.page || 1) + 1,
        }));
        
        await fetchComments(false);
    };

    const refreshComments = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchComments(true);
    };

    return {
        comments,
        isLoading,
        error,
        pagination,
        createComment,
        updateComment,
        deleteComment,
        voteComment,
        reportComment,
        loadMore,
        refreshComments,
        setFilters,
    };
}

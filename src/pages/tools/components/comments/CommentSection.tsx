import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reportComment, voteComment } from '@/lib/api';
import { type Comment, type CommentReportData } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	createCommentThunk,
	deleteCommentThunk,
	fetchComments,
	updateCommentThunk,
	updateCommentVotes,
} from '@/store/slice/commentsSlice';
import { Loader2, MessageSquare } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { ReportDialog } from './ReportDialog';
import { type CommentSectionProps } from './types';

export function CommentSection({ toolId }: CommentSectionProps) {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const { commentsByTool, paginationByTool, isLoading } = useAppSelector(
		(state) => state.comments
	);

	const comments = useMemo(() => {
		return commentsByTool[toolId] || [];
	}, [commentsByTool, toolId]);

	const pagination = paginationByTool[toolId];

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [votingState, setVotingState] = useState<Record<string, boolean>>({});
	const [reportDialog, setReportDialog] = useState({
		open: false,
		commentId: null as string | null,
	});

	useEffect(() => {
		dispatch(fetchComments({ toolId }));
	}, [dispatch, toolId]);

	const handleSubmitComment = async (content: string) => {
		if (!user) {
			toast.error('Please sign in to comment');
			return;
		}

		setIsSubmitting(true);
		try {
			await dispatch(
				createCommentThunk({
					toolId,
					content,
				})
			).unwrap();

			toast.success('Comment posted successfully!');
		} catch (error) {
			console.error('Failed to submit comment:', error);
			toast.error('Failed to post comment');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReply = async (parentCommentId: string, content: string) => {
		if (!user) {
			toast.error('Please sign in to reply');
			return;
		}

		try {
			await dispatch(
				createCommentThunk({
					toolId,
					content,
					parentComment: parentCommentId,
				})
			).unwrap();

			toast.success('Reply posted successfully!');
		} catch (error) {
			console.error('Failed to submit reply:', error);
			toast.error('Failed to post reply');
		}
	};

	const handleEditComment = async (commentId: string, content: string) => {
		try {
			await dispatch(
				updateCommentThunk({
					toolId,
					commentId,
					content,
				})
			).unwrap();

			toast.success('Comment updated successfully!');
		} catch (error) {
			console.error('Failed to edit comment:', error);
			toast.error('Failed to edit comment');
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		if (!window.confirm('Are you sure you want to delete this comment?')) {
			return;
		}

		try {
			await dispatch(deleteCommentThunk({ toolId, commentId })).unwrap();
			toast.success('Comment deleted successfully!');
		} catch (error) {
			console.error('Failed to delete comment:', error);
			toast.error('Failed to delete comment');
		}
	};

	const handleVoteComment = async (
		commentId: string,
		voteType: 'upvote' | 'downvote'
	) => {
		if (!user) {
			toast.info('Please sign in to vote on comments');
			return;
		}

		if (votingState[commentId]) return;

		setVotingState((prev) => ({ ...prev, [commentId]: true }));

		try {
			const response = await voteComment(toolId, commentId, voteType);

			const findCommentRecursively = (
				comments: Comment[],
				targetId: string
			): Comment | null => {
				for (const comment of comments) {
					if (comment._id === targetId) return comment;
					if (comment.replies) {
						const found = findCommentRecursively(comment.replies, targetId);
						if (found) return found;
					}
				}
				return null;
			};

			const comment = findCommentRecursively(comments, commentId);

			if (comment) {
				const newVotes = { ...comment.votes };

				if (voteType === 'upvote') {
					if (response.action === 'added') {
						newVotes.upvotes = (newVotes.upvotes || 0) + 1;
						if (
							'previousVote' in response &&
							response.previousVote === 'downvote'
						) {
							newVotes.downvotes = Math.max((newVotes.downvotes || 0) - 1, 0);
						}
					} else if (response.action === 'removed') {
						newVotes.upvotes = Math.max((newVotes.upvotes || 0) - 1, 0);
					}
				} else {
					if (response.action === 'added') {
						newVotes.downvotes = (newVotes.downvotes || 0) + 1;
						if (
							'previousVote' in response &&
							response.previousVote === 'upvote'
						) {
							newVotes.upvotes = Math.max((newVotes.upvotes || 0) - 1, 0);
						}
					} else if (response.action === 'removed') {
						newVotes.downvotes = Math.max((newVotes.downvotes || 0) - 1, 0);
					}
				}

				dispatch(
					updateCommentVotes({
						toolId,
						commentId,
						votes: newVotes,
					})
				);

				const actionText = response.action === 'added' ? 'added' : 'removed';
				toast.success(`${voteType} ${actionText}`);
			}
		} catch (error) {
			console.error('Failed to vote on comment:', error);
			toast.error('Failed to vote on comment');
		} finally {
			setVotingState((prev) => ({ ...prev, [commentId]: false }));
		}
	};

	const handleReportComment = async (
		commentId: string,
		reason: string,
		description?: string
	) => {
		try {
			await reportComment(toolId, commentId, {
				reason: reason as CommentReportData['reason'],
				description: description || '',
			});

			setReportDialog({ open: false, commentId: null });
			toast.success('Comment reported successfully');
		} catch (error) {
			console.error('Failed to report comment:', error);
			toast.error('Failed to report comment. Please try again.');
		}
	};

	const loadMore = () => {
		if (pagination?.hasNextPage) {
			dispatch(
				fetchComments({
					toolId,
					page: pagination.currentPage + 1,
				})
			);
		}
	};

	return (
		<div className="space-y-6">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					Comments ({pagination?.totalComments || 0})
				</CardTitle>
			</CardHeader>

			<CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />

			{isLoading ? (
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="animate-pulse">
							<div className="h-32 bg-muted rounded-lg" />
						</div>
					))}
				</div>
			) : comments.length > 0 ? (
				<div className="space-y-4">
					{comments.map((comment) => (
						<CommentItem
							key={comment._id}
							comment={comment}
							toolId={toolId}
							onVoteComment={handleVoteComment}
							onReply={handleReply}
							onEdit={handleEditComment}
							onDelete={handleDeleteComment}
							onReport={(commentId) =>
								setReportDialog({ open: true, commentId })
							}
							votingState={votingState}
						/>
					))}

					{pagination?.hasNextPage && (
						<Button
							variant="outline"
							onClick={loadMore}
							className="w-full"
							disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Loading...
								</>
							) : (
								'Load More Comments'
							)}
						</Button>
					)}
				</div>
			) : (
				<Card>
					<CardContent className="p-8 text-center">
						<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No comments yet</h3>
						<p className="text-muted-foreground">
							Be the first to share your thoughts!
						</p>
					</CardContent>
				</Card>
			)}

			<ReportDialog
				open={reportDialog.open}
				commentId={reportDialog.commentId}
				onClose={() => setReportDialog({ open: false, commentId: null })}
				onReport={handleReportComment}
			/>
		</div>
	);
}

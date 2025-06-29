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
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, MessageSquare } from 'lucide-react';
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
		<div className="space-y-8">
			{/* Section Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardHeader className="border-b border-gray-800/50">
						<CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<MessageSquare className="h-5 w-5 text-white" />
							</div>
							<span>Comments ({pagination?.totalComments || 0})</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<CommentForm
							onSubmit={handleSubmitComment}
							isSubmitting={isSubmitting}
						/>
					</CardContent>
				</Card>
			</motion.div>

			{/* Comments List */}
			<div className="space-y-6">
				{isLoading && comments.length === 0 ? (
					// Loading Skeleton
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<Card key={i} className="bg-gray-900/30 border-gray-800/30">
								<CardContent className="p-6">
									<div className="animate-pulse">
										<div className="flex items-start space-x-4">
											<div className="w-10 h-10 bg-gray-700 rounded-full"></div>
											<div className="flex-1 space-y-3">
												<div className="h-4 bg-gray-700 rounded w-1/4"></div>
												<div className="h-4 bg-gray-700 rounded w-3/4"></div>
												<div className="h-4 bg-gray-700 rounded w-1/2"></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : comments.length > 0 ? (
					<>
						{/* Comments */}
						<motion.div
							className="space-y-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}>
							{comments.map((comment, index) => (
								<motion.div
									key={comment._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}>
									<CommentItem
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
								</motion.div>
							))}
						</motion.div>

						{/* Load More Button */}
						{pagination?.hasNextPage && (
							<motion.div
								className="text-center pt-6"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.5 }}>
								<Button
									onClick={loadMore}
									disabled={isLoading}
									variant="outline"
									className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-xl">
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Loading...
										</>
									) : (
										<>
											<ChevronDown className="mr-2 h-4 w-4" />
											Load More Comments
										</>
									)}
								</Button>
							</motion.div>
						)}
					</>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<Card className="bg-gray-900/30 border-gray-800/30">
							<CardContent className="p-12 text-center">
								<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
									<MessageSquare className="h-10 w-10 text-gray-500" />
								</div>
								<h3 className="text-2xl font-bold text-gray-400 mb-2">
									No comments yet
								</h3>
								<p className="text-gray-500 text-lg mb-6">
									Be the first to share your thoughts!
								</p>
								{user && (
									<Button
										variant="outline"
										className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
										onClick={() => document.querySelector('textarea')?.focus()}>
										Start the conversation
									</Button>
								)}
							</CardContent>
						</Card>
					</motion.div>
				)}
			</div>
			<ReportDialog
				open={reportDialog.open}
				commentId={reportDialog.commentId}
				onClose={() => setReportDialog({ open: false, commentId: null })}
				onReport={handleReportComment}
			/>
		</div>
	);
}

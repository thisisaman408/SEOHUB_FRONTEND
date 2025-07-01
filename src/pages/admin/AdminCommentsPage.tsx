import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	getCommentById,
	getReportedComments,
	moderateComment,
} from '@/lib/api';
import { type Comment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
	AlertTriangle,
	Check,
	Clock,
	Eye,
	Flag,
	MessageSquare,
	Shield,
	ThumbsDown,
	ThumbsUp,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const getCommentStatusBadge = (comment: Comment) => {
	if (comment.status === 'reported') {
		return (
			<Badge className="bg-red-500/20 text-red-400 border-red-500/30">
				<Flag className="h-3 w-3 mr-1" />
				Reported ({comment.reports?.length || 0})
			</Badge>
		);
	}
	if (comment.status === 'approved') {
		return (
			<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
				<Check className="h-3 w-3 mr-1" />
				Approved
			</Badge>
		);
	}
	if (comment.status === 'rejected') {
		return (
			<Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
				<X className="h-3 w-3 mr-1" />
				Rejected
			</Badge>
		);
	}
	return (
		<Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
			<Clock className="h-3 w-3 mr-1" />
			Pending
		</Badge>
	);
};

const truncateText = (text: string, maxLength: number = 100) => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

const getReportReasonBadgeColor = (reason: string) => {
	switch (reason) {
		case 'spam':
			return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
		case 'inappropriate':
			return 'bg-red-500/20 text-red-400 border-red-500/30';
		case 'harassment':
			return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
		case 'misinformation':
			return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
		default:
			return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
	}
};

const getToolName = (tool: string | { _id: string; name: string }): string => {
	return typeof tool === 'object' ? tool.name : 'Unknown Tool';
};

export function AdminCommentsPage() {
	const [reportedComments, setReportedComments] = useState<Comment[]>([]);
	const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isModerating, setIsModerating] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('reported');

	// Fetch reported comments
	const fetchReportedCommentsData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const comments = await getReportedComments();
			setReportedComments(comments);
		} catch (error: unknown) {
			setError(
				error instanceof Error
					? error.message
					: 'Failed to fetch reported comments'
			);
			toast.error('Failed to fetch reported comments');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReportedCommentsData();
	}, [fetchReportedCommentsData]);

	const handleViewComment = useCallback(async (commentId: string) => {
		try {
			const comment = await getCommentById(commentId);
			setSelectedComment(comment);
			setIsDetailModalOpen(true);
		} catch (error: unknown) {
			console.error('Failed to fetch comment:', error);
			toast.error('Failed to load comment details');
		}
	}, []);

	const handleModerateComment = useCallback(
		async (commentId: string, status: 'approved' | 'rejected') => {
			try {
				setIsModerating(commentId);
				await moderateComment(commentId, status);
				toast.success(
					`Comment ${
						status === 'approved' ? 'approved' : 'rejected'
					} successfully`
				);
				
				await fetchReportedCommentsData();
			} catch (error: unknown) {
				console.error('Failed to moderate comment:', error);
				toast.error(
					error instanceof Error ? error.message : 'Failed to moderate comment'
				);
			} finally {
				setIsModerating(null);
			}
		},
		[fetchReportedCommentsData]
	);

	const handleCloseDetailModal = useCallback(() => {
		setIsDetailModalOpen(false);
		setSelectedComment(null);
	}, []);

	const filteredComments = reportedComments.filter((comment) => {
		switch (activeTab) {
			case 'reported':
				return comment.status === 'reported';
			case 'approved':
				return (
					comment.status === 'approved' &&
					comment.reports &&
					comment.reports.length > 0
				);
			case 'rejected':
				return comment.status === 'rejected';
			case 'all':
			default:
				return comment.reports && comment.reports.length > 0;
		}
	});

	// Calculate stats
	const stats = {
		total: reportedComments.filter((c) => c.reports && c.reports.length > 0)
			.length,
		reported: reportedComments.filter((c) => c.status === 'reported').length,
		approved: reportedComments.filter(
			(c) => c.status === 'approved' && c.reports && c.reports.length > 0
		).length,
		rejected: reportedComments.filter((c) => c.status === 'rejected').length,
	};

	return (
		<div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="flex flex-col space-y-2 sm:space-y-4">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
							Comment Moderation
						</h1>
						<p className="text-gray-400 text-sm sm:text-base">
							Review and moderate reported comments from users
						</p>
					</div>
				</motion.div>

				{/* Stats Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
										<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-400">
											Total Reports
										</p>
										<p className="text-xl sm:text-2xl font-bold text-white">
											{stats.total}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
										<Flag className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-400">
											Pending Review
										</p>
										<p className="text-xl sm:text-2xl font-bold text-white">
											{stats.reported}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
										<Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-400">
											Approved
										</p>
										<p className="text-xl sm:text-2xl font-bold text-white">
											{stats.approved}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
										<X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-400">
											Rejected
										</p>
										<p className="text-xl sm:text-2xl font-bold text-white">
											{stats.rejected}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-white">Comments Management</CardTitle>
							<CardDescription>
								Review and moderate comments that have been reported by users
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<div className="px-4 sm:px-6 pt-6">
									<TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
										<TabsTrigger
											value="reported"
											className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
											Pending ({stats.reported})
										</TabsTrigger>
										<TabsTrigger
											value="approved"
											className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
											Approved ({stats.approved})
										</TabsTrigger>
										<TabsTrigger
											value="rejected"
											className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
											Rejected ({stats.rejected})
										</TabsTrigger>
										<TabsTrigger
											value="all"
											className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
											All ({stats.total})
										</TabsTrigger>
									</TabsList>
								</div>

								<TabsContent value={activeTab} className="p-0 mt-6">
									{isLoading ? (
										<div className="flex items-center justify-center py-8 sm:py-12">
											<div className="flex items-center space-x-3 text-gray-400">
												<div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
												<span className="text-sm sm:text-base">
													Loading comments...
												</span>
											</div>
										</div>
									) : error ? (
										<div className="flex items-center justify-center py-8 sm:py-12">
											<div className="text-center">
												<AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
												<p className="text-red-400 mb-2">
													Failed to load comments
												</p>
												<p className="text-gray-400 text-sm">{error}</p>
											</div>
										</div>
									) : filteredComments.length === 0 ? (
										<div className="flex items-center justify-center py-8 sm:py-12">
											<div className="text-center">
												<Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
												<p className="text-white font-semibold mb-2">
													All clean!
												</p>
												<p className="text-gray-400 text-sm">
													No {activeTab === 'all' ? '' : activeTab + ' '}
													comments to review at the moment.
												</p>
											</div>
										</div>
									) : (
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="border-gray-800/50 hover:bg-gray-800/30">
														<TableHead className="text-gray-300">
															Comment
														</TableHead>
														<TableHead className="text-gray-300 hidden sm:table-cell">
															Author
														</TableHead>
														<TableHead className="text-gray-300 hidden md:table-cell">
															Tool
														</TableHead>
														<TableHead className="text-gray-300">
															Status
														</TableHead>
														<TableHead className="text-gray-300 hidden lg:table-cell">
															Reports
														</TableHead>
														<TableHead className="text-gray-300 hidden lg:table-cell">
															Date
														</TableHead>
														<TableHead className="text-gray-300">
															Actions
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{filteredComments.map((comment, index) => (
														<motion.tr
															key={comment._id}
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: index * 0.05 }}
															className="border-gray-800/50 hover:bg-gray-800/30">
															<TableCell className="max-w-xs">
																<div>
																	<p className="text-white text-sm leading-relaxed">
																		{truncateText(comment.content, 80)}
																	</p>
																	<div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
																		<div className="flex items-center space-x-1">
																			<ThumbsUp className="h-3 w-3" />
																			<span>{comment.votes?.upvotes || 0}</span>
																		</div>
																		<div className="flex items-center space-x-1">
																			<ThumbsDown className="h-3 w-3" />
																			<span>
																				{comment.votes?.downvotes || 0}
																			</span>
																		</div>
																	</div>
																</div>
															</TableCell>
															<TableCell className="hidden sm:table-cell">
																<div className="flex items-center space-x-3">
																	<Avatar className="h-8 w-8">
																		<AvatarImage
																			src={comment.user?.companyLogoUrl}
																			alt={comment.user?.companyName || 'User'}
																		/>
																		<AvatarFallback className="bg-gray-700 text-gray-300">
																			{(comment.user?.companyName || 'U')
																				.charAt(0)
																				.toUpperCase()}
																		</AvatarFallback>
																	</Avatar>
																	<div>
																		<p className="text-white text-sm font-medium">
																			{comment.user?.companyName || 'Unknown'}
																		</p>
																	</div>
																</div>
															</TableCell>
															<TableCell className="hidden md:table-cell">
																<div>
																	<p className="text-white text-sm font-medium">
																		{getToolName(comment.tool)}
																	</p>
																</div>
															</TableCell>
															<TableCell>
																{getCommentStatusBadge(comment)}
															</TableCell>
															<TableCell className="hidden lg:table-cell">
																<div className="space-y-1">
																	{comment.reports &&
																	comment.reports.length > 0 ? (
																		comment.reports
																			.slice(0, 2)
																			.map((report, idx) => (
																				<div key={idx} className="text-xs">
																					<Badge
																						variant="outline"
																						className={getReportReasonBadgeColor(
																							report.reason
																						)}>
																						{report.reason}
																					</Badge>
																				</div>
																			))
																	) : (
																		<span className="text-gray-500 text-xs">
																			No reports
																		</span>
																	)}
																	{comment.reports &&
																		comment.reports.length > 2 && (
																			<div className="text-xs text-gray-400">
																				+{comment.reports.length - 2} more
																			</div>
																		)}
																</div>
															</TableCell>
															<TableCell className="hidden lg:table-cell">
																<span className="text-gray-400 text-xs">
																	{formatDistanceToNow(
																		new Date(comment.createdAt),
																		{
																			addSuffix: true,
																		}
																	)}
																</span>
															</TableCell>
															<TableCell>
																<div className="flex items-center space-x-2">
																	<Button
																		size="sm"
																		variant="outline"
																		onClick={() =>
																			handleViewComment(comment._id)
																		}
																		className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
																		<Eye className="h-3 w-3" />
																		<span className="hidden sm:inline ml-1">
																			View
																		</span>
																	</Button>
																	{comment.status === 'reported' && (
																		<>
																			<Button
																				size="sm"
																				onClick={() =>
																					handleModerateComment(
																						comment._id,
																						'approved'
																					)
																				}
																				disabled={isModerating === comment._id}
																				className="bg-green-600 hover:bg-green-700 text-white">
																				<Check className="h-3 w-3" />
																				<span className="hidden sm:inline ml-1">
																					Approve
																				</span>
																			</Button>
																			<Button
																				size="sm"
																				onClick={() =>
																					handleModerateComment(
																						comment._id,
																						'rejected'
																					)
																				}
																				disabled={isModerating === comment._id}
																				className="bg-red-600 hover:bg-red-700 text-white">
																				<X className="h-3 w-3" />
																				<span className="hidden sm:inline ml-1">
																					Reject
																				</span>
																			</Button>
																		</>
																	)}
																</div>
															</TableCell>
														</motion.tr>
													))}
												</TableBody>
											</Table>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</motion.div>

				{/* Comment Detail Modal */}
				<Dialog open={isDetailModalOpen} onOpenChange={handleCloseDetailModal}>
					<DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-white">Comment Details</DialogTitle>
							<DialogDescription className="text-gray-400">
								Review the full comment and its reports
							</DialogDescription>
						</DialogHeader>
						{selectedComment && (
							<div className="space-y-6">
								{/* Comment Content */}
								<div className="space-y-3">
									<h4 className="font-semibold text-white">Comment Content</h4>
									<div className="bg-gray-800/50 rounded-lg p-4">
										<p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
											{selectedComment.content}
										</p>
									</div>
								</div>

								{/* Author Information */}
								<div className="space-y-3">
									<h4 className="font-semibold text-white">Author</h4>
									<div className="flex items-center space-x-3">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={selectedComment.user?.companyLogoUrl}
												alt={selectedComment.user?.companyName || 'User'}
											/>
											<AvatarFallback className="bg-gray-700 text-gray-300">
												{(selectedComment.user?.companyName || 'U')
													.charAt(0)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-white font-medium">
												{selectedComment.user?.companyName || 'Unknown User'}
											</p>
										</div>
									</div>
								</div>

								{/* Tool Information */}
								<div className="space-y-3">
									<h4 className="font-semibold text-white">Tool</h4>
									<div>
										<p className="text-white font-medium">
											{getToolName(selectedComment.tool)}
										</p>
									</div>
								</div>

								{/* Reports */}
								{selectedComment.reports &&
									selectedComment.reports.length > 0 && (
										<div className="space-y-3">
											<h4 className="font-semibold text-white">
												Reports ({selectedComment.reports.length})
											</h4>
											<div className="space-y-3">
												{selectedComment.reports.map((report, index) => (
													<div
														key={index}
														className="bg-gray-800/50 rounded-lg p-4">
														<div className="flex items-center justify-between mb-2">
															<Badge
																variant="outline"
																className={getReportReasonBadgeColor(
																	report.reason
																)}>
																{report.reason}
															</Badge>
															<span className="text-gray-400 text-xs">
																{formatDistanceToNow(
																	new Date(report.reportedAt),
																	{
																		addSuffix: true,
																	}
																)}
															</span>
														</div>
														{report.description && (
															<p className="text-gray-300 text-sm">
																{report.description}
															</p>
														)}
													</div>
												))}
											</div>
										</div>
									)}

								{/* Comment Status and Actions */}
								<div className="space-y-3">
									<h4 className="font-semibold text-white">Current Status</h4>
									<div className="flex items-center justify-between">
										{getCommentStatusBadge(selectedComment)}
										{selectedComment.status === 'reported' && (
											<div className="flex space-x-2">
												<Button
													onClick={() => {
														handleModerateComment(
															selectedComment._id,
															'approved'
														);
														handleCloseDetailModal();
													}}
													disabled={isModerating === selectedComment._id}
													className="bg-green-600 hover:bg-green-700 text-white">
													<Check className="h-4 w-4 mr-2" />
													Approve
												</Button>
												<Button
													onClick={() => {
														handleModerateComment(
															selectedComment._id,
															'rejected'
														);
														handleCloseDetailModal();
													}}
													disabled={isModerating === selectedComment._id}
													className="bg-red-600 hover:bg-red-700 text-white">
													<X className="h-4 w-4 mr-2" />
													Reject
												</Button>
											</div>
										)}
									</div>
								</div>

								{/* Comment Metadata */}
								<div className="space-y-3 pt-4 border-t border-gray-800">
									<h4 className="font-semibold text-white">Metadata</h4>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<p className="text-gray-400">Created</p>
											<p className="text-white">
												{formatDistanceToNow(
													new Date(selectedComment.createdAt),
													{
														addSuffix: true,
													}
												)}
											</p>
										</div>
										<div>
											<p className="text-gray-400">Votes</p>
											<p className="text-white">
												{selectedComment.votes?.upvotes || 0} up,{' '}
												{selectedComment.votes?.downvotes || 0} down
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	clearSelectedComment,
	fetchCommentById,
	fetchReportedComments,
	moderateCommentThunk,
} from '@/store/slice/adminSlice';
import { formatDistanceToNow } from 'date-fns';
import {
	AlertTriangle,
	Check,
	Clock,
	Eye,
	Flag,
	MessageSquare,
	X,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export function AdminCommentsPage() {
	const dispatch = useAppDispatch();
	const {
		comments: reportedComments,
		selectedComment,
		isCommentsLoading: isLoading,
		isModerating: moderatingId,
	} = useAppSelector((state) => state.admin);

	const fetchReportedCommentsData = useCallback(async () => {
		try {
			await dispatch(fetchReportedComments()).unwrap();
		} catch (error) {
			toast.error('Failed to fetch reported comments');
			console.error(error);
		}
	}, [dispatch]);

	useEffect(() => {
		fetchReportedCommentsData();
	}, [fetchReportedCommentsData]);

	const handleModerate = async (
		commentId: string,
		status: 'approved' | 'rejected'
	) => {
		try {
			await dispatch(moderateCommentThunk({ commentId, status })).unwrap();
			toast.success(`Comment ${status} successfully`);
		} catch (error) {
			toast.error(`Failed to ${status} comment`);
			console.error(error);
		}
	};

	const viewCommentDetails = async (commentId: string) => {
		try {
			await dispatch(fetchCommentById(commentId)).unwrap();
		} catch (error) {
			toast.error('Failed to load comment details');
			console.error(error);
		}
	};

	const handleCloseDialog = () => {
		dispatch(clearSelectedComment());
	};

	const getReportReasonBadgeColor = (reason: string) => {
		switch (reason) {
			case 'spam':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
			case 'inappropriate':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			case 'harassment':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
			case 'misinformation':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
		}
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold mb-2">Comment Moderation</h1>
				<p className="text-muted-foreground">
					Review and moderate reported comments from users
				</p>
			</div>

			<Tabs defaultValue="reported" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="reported" className="flex items-center gap-2">
						<Flag className="h-4 w-4" />
						Reported Comments ({reportedComments.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="reported">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-orange-500" />
								Reported Comments
							</CardTitle>
							<CardDescription>
								Comments that have been flagged by users and require moderation
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="text-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
									<p className="text-muted-foreground">
										Loading reported comments...
									</p>
								</div>
							) : reportedComments.length > 0 ? (
								<div className="border rounded-md overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Comment</TableHead>
												<TableHead>Author</TableHead>
												<TableHead>Reports</TableHead>
												<TableHead>Tool</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{reportedComments.map((comment) => (
												<TableRow key={comment._id}>
													<TableCell className="max-w-xs">
														<p className="line-clamp-2 text-sm">
															{comment.content}
														</p>
														{comment.isEdited && (
															<Badge variant="outline" className="mt-1 text-xs">
																Edited
															</Badge>
														)}
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Avatar className="w-6 h-6">
																<AvatarImage
																	src={comment.user.companyLogoUrl}
																/>
																<AvatarFallback className="text-xs">
																	{comment.user.companyName?.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<span className="text-sm">
																{comment.user.companyName}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="space-y-1">
															{comment.reports
																.slice(0, 2)
																.map((report, index) => (
																	<Badge
																		key={index}
																		variant="outline"
																		className={`text-xs ${getReportReasonBadgeColor(
																			report.reason
																		)}`}>
																		{report.reason}
																	</Badge>
																))}
															{comment.reports.length > 2 && (
																<Badge variant="outline" className="text-xs">
																	+{comment.reports.length - 2} more
																</Badge>
															)}
														</div>
													</TableCell>
													<TableCell>
														<span className="text-sm text-muted-foreground">
															{typeof comment.tool === 'string'
																? `Tool #${comment.tool.slice(-6)}`
																: comment.tool.name ||
																  `Tool #${comment.tool._id.slice(-6)}`}
														</span>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1 text-sm text-muted-foreground">
															<Clock className="h-3 w-3" />
															{formatDistanceToNow(
																new Date(comment.createdAt),
																{ addSuffix: true }
															)}
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() => viewCommentDetails(comment._id)}>
																<Eye className="h-3 w-3" />
															</Button>
															<Button
																variant="outline"
																size="sm"
																className="text-green-600 hover:text-green-700 hover:border-green-600"
																onClick={() =>
																	handleModerate(comment._id, 'approved')
																}
																disabled={moderatingId === comment._id}>
																<Check className="h-3 w-3" />
															</Button>
															<Button
																variant="outline"
																size="sm"
																className="text-red-600 hover:text-red-700 hover:border-red-600"
																onClick={() =>
																	handleModerate(comment._id, 'rejected')
																}
																disabled={moderatingId === comment._id}>
																<X className="h-3 w-3" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							) : (
								<div className="text-center py-12">
									<MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
									<h3 className="text-lg font-medium mb-2">
										No reported comments
									</h3>
									<p className="text-muted-foreground">
										All comments are clean! No reports to review at the moment.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Comment Details Modal */}
			<Dialog
				open={!!selectedComment}
				onOpenChange={(open) => !open && handleCloseDialog()}>
				<DialogContent className="max-w-2xl">
					{selectedComment && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<Flag className="h-5 w-5" />
									Comment Details
								</DialogTitle>
								<DialogDescription>
									Review the full comment and all reports before making a
									moderation decision
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-6">
								{/* Comment Content */}
								<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div className="flex items-start gap-3 mb-3">
										<Avatar className="w-8 h-8">
											<AvatarImage src={selectedComment.user.companyLogoUrl} />
											<AvatarFallback>
												{selectedComment.user.companyName?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												{selectedComment.user.companyName}
											</p>
											<p className="text-sm text-muted-foreground">
												{formatDistanceToNow(
													new Date(selectedComment.createdAt),
													{ addSuffix: true }
												)}
											</p>
										</div>
									</div>
									<p className="text-sm leading-relaxed">
										{selectedComment.content}
									</p>
								</div>

								{/* Reports */}
								<div>
									<h4 className="font-medium mb-3">
										Reports ({selectedComment.reports.length})
									</h4>
									<div className="space-y-3">
										{selectedComment.reports.map((report, index) => (
											<div key={index} className="border rounded-lg p-3">
												<div className="flex items-center justify-between mb-2">
													<Badge
														className={getReportReasonBadgeColor(
															report.reason
														)}>
														{report.reason}
													</Badge>
													<span className="text-xs text-muted-foreground">
														{formatDistanceToNow(new Date(report.reportedAt), {
															addSuffix: true,
														})}
													</span>
												</div>
												{report.description && (
													<p className="text-sm text-muted-foreground">
														{report.description}
													</p>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3 pt-4 border-t">
									<Button
										className="flex-1"
										onClick={() =>
											handleModerate(selectedComment._id, 'approved')
										}
										disabled={moderatingId === selectedComment._id}>
										<Check className="h-4 w-4 mr-2" />
										Approve Comment
									</Button>
									<Button
										variant="destructive"
										className="flex-1"
										onClick={() =>
											handleModerate(selectedComment._id, 'rejected')
										}
										disabled={moderatingId === selectedComment._id}>
										<X className="h-4 w-4 mr-2" />
										Reject Comment
									</Button>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

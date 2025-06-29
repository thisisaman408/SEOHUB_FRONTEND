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
import { motion } from 'framer-motion';
import {
	Check,
	Clock,
	Eye,
	Flag,
	MessageSquare,
	Shield,
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

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<motion.div
					className="text-center space-y-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="flex items-center justify-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
							<Shield className="h-6 w-6 text-white" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-white">Comment Moderation</h1>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Review and moderate reported comments from users
					</p>
				</motion.div>

				{/* Stats Cards */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Total Reports</p>
									<p className="text-3xl font-bold text-white">
										{reportedComments.length}
									</p>
								</div>
								<Flag className="h-8 w-8 text-red-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Pending Review</p>
									<p className="text-3xl font-bold text-yellow-400">
										{
											reportedComments.filter((c) => c.status === 'pending')
												.length
										}
									</p>
								</div>
								<Clock className="h-8 w-8 text-yellow-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Resolved Today</p>
									<p className="text-3xl font-bold text-green-400">
										{
											reportedComments.filter((c) => c.status !== 'pending')
												.length
										}
									</p>
								</div>
								<Check className="h-8 w-8 text-green-400" />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
								<MessageSquare className="h-6 w-6 text-blue-400" />
								<span>Reported Comments</span>
							</CardTitle>
							<CardDescription className="text-gray-400">
								Review and take action on comments reported by the community
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<Tabs defaultValue="pending" className="w-full">
								<TabsList className="w-full justify-start border-b border-gray-800/50 bg-transparent rounded-none h-auto p-0">
									<TabsTrigger
										value="pending"
										className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-6 py-4">
										Pending (
										{
											reportedComments.filter((c) => c.status === 'pending')
												.length
										}
										)
									</TabsTrigger>
									<TabsTrigger
										value="approved"
										className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 border-b-2 border-transparent data-[state=active]:border-green-500 rounded-none px-6 py-4">
										Approved (
										{
											reportedComments.filter((c) => c.status === 'approved')
												.length
										}
										)
									</TabsTrigger>
									<TabsTrigger
										value="rejected"
										className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 border-b-2 border-transparent data-[state=active]:border-red-500 rounded-none px-6 py-4">
										Rejected (
										{
											reportedComments.filter((c) => c.status === 'rejected')
												.length
										}
										)
									</TabsTrigger>
								</TabsList>

								<TabsContent value="pending" className="mt-0">
									{isLoading ? (
										<div className="flex items-center justify-center py-16">
											<div className="flex items-center space-x-3 text-gray-400">
												<div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
												<span>Loading reported comments...</span>
											</div>
										</div>
									) : reportedComments.filter((c) => c.status === 'pending')
											.length === 0 ? (
										<div className="text-center py-16">
											<div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
												<Check className="h-10 w-10 text-green-400" />
											</div>
											<h3 className="text-xl font-bold text-gray-400 mb-2">
												All Clear!
											</h3>
											<p className="text-gray-500">
												All comments are clean! No reports to review at the
												moment.
											</p>
										</div>
									) : (
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="border-gray-800/50 hover:bg-gray-800/30">
														<TableHead className="text-gray-300">
															Comment
														</TableHead>
														<TableHead className="text-gray-300">
															Author
														</TableHead>
														<TableHead className="text-gray-300">
															Report Reason
														</TableHead>
														<TableHead className="text-gray-300">
															Reported
														</TableHead>
														<TableHead className="text-gray-300">
															Actions
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{reportedComments
														.filter((comment) => comment.status === 'pending')
														.map((comment) => (
															<TableRow
																key={comment._id}
																className="border-gray-800/50 hover:bg-gray-800/30">
																<TableCell className="max-w-md">
																	<div className="space-y-2">
																		<p className="text-gray-300 line-clamp-2">
																			{comment.content}
																		</p>
																		<Button
																			variant="link"
																			size="sm"
																			onClick={() =>
																				viewCommentDetails(comment._id)
																			}
																			className="p-0 h-auto text-blue-400 hover:text-blue-300">
																			<Eye className="h-3 w-3 mr-1" />
																			View Details
																		</Button>
																	</div>
																</TableCell>
																<TableCell>
																	<div className="flex items-center space-x-3">
																		<Avatar className="h-8 w-8">
																			<AvatarImage
																				src={comment?.user?.companyLogoUrl}
																			/>
																			<AvatarFallback className="bg-gray-700 text-gray-300">
																				{comment.user?.companyName?.[0] || 'U'}
																			</AvatarFallback>
																		</Avatar>
																		<span className="text-gray-300">
																			{comment.user?.companyName || 'Anonymous'}
																		</span>
																	</div>
																</TableCell>
																<TableCell>
																	<Badge
																		className={getReportReasonBadgeColor(
																			comment.content
																		)}>
																		{comment.content}
																	</Badge>
																</TableCell>
																<TableCell className="text-gray-400">
																	{formatDistanceToNow(
																		new Date(comment.createdAt),
																		{ addSuffix: true }
																	)}
																</TableCell>
																<TableCell>
																	<div className="flex items-center space-x-2">
																		<Button
																			size="sm"
																			onClick={() =>
																				handleModerate(comment._id, 'approved')
																			}
																			disabled={moderatingId === comment._id}
																			className="bg-green-600 hover:bg-green-700 text-white">
																			<Check className="h-3 w-3 mr-1" />
																			Approve
																		</Button>
																		<Button
																			size="sm"
																			variant="destructive"
																			onClick={() =>
																				handleModerate(comment._id, 'rejected')
																			}
																			disabled={moderatingId === comment._id}
																			className="bg-red-600 hover:bg-red-700">
																			<X className="h-3 w-3 mr-1" />
																			Reject
																		</Button>
																	</div>
																</TableCell>
															</TableRow>
														))}
												</TableBody>
											</Table>
										</div>
									)}
								</TabsContent>

								<TabsContent value="approved">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="border-gray-800/50">
													<TableHead className="text-gray-300">
														Comment
													</TableHead>
													<TableHead className="text-gray-300">
														Author
													</TableHead>
													<TableHead className="text-gray-300">
														Approved
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{reportedComments
													.filter((comment) => comment.status === 'approved')
													.map((comment) => (
														<TableRow
															key={comment._id}
															className="border-gray-800/50 hover:bg-gray-800/30">
															<TableCell className="text-gray-300">
																{comment.content}
															</TableCell>
															<TableCell className="text-gray-300">
																{comment.user?.companyName || 'Anonymous'}
															</TableCell>
															<TableCell className="text-gray-400">
																{formatDistanceToNow(
																	new Date(comment.updatedAt),
																	{ addSuffix: true }
																)}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>

								<TabsContent value="rejected">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="border-gray-800/50">
													<TableHead className="text-gray-300">
														Comment
													</TableHead>
													<TableHead className="text-gray-300">
														Author
													</TableHead>
													<TableHead className="text-gray-300">
														Rejected
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{reportedComments
													.filter((comment) => comment.status === 'rejected')
													.map((comment) => (
														<TableRow
															key={comment._id}
															className="border-gray-800/50 hover:bg-gray-800/30">
															<TableCell className="text-gray-300 opacity-60">
																{comment.content}
															</TableCell>
															<TableCell className="text-gray-300">
																{comment.user?.companyName || 'Anonymous'}
															</TableCell>
															<TableCell className="text-gray-400">
																{formatDistanceToNow(
																	new Date(comment.updatedAt),
																	{ addSuffix: true }
																)}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</motion.div>

				{/* Comment Details Dialog */}
				<Dialog open={!!selectedComment} onOpenChange={handleCloseDialog}>
					<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold text-white">
								Comment Details
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								Full comment information and moderation options
							</DialogDescription>
						</DialogHeader>
						{selectedComment && (
							<div className="space-y-6">
								<div className="space-y-4">
									<div>
										<h4 className="text-sm font-medium text-gray-300 mb-2">
											Comment Content
										</h4>
										<div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
											<p className="text-gray-300 leading-relaxed">
												{selectedComment.content}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="text-sm font-medium text-gray-300 mb-2">
												Author
											</h4>
											<div className="flex items-center space-x-3">
												<Avatar>
													<AvatarImage
														src={selectedComment.user?.companyLogoUrl}
													/>
													<AvatarFallback className="bg-gray-700 text-gray-300">
														{selectedComment.user?.companyName?.[0] || 'U'}
													</AvatarFallback>
												</Avatar>
												<span className="text-gray-300">
													{selectedComment.user?.companyName || 'Anonymous'}
												</span>
											</div>
										</div>
										<div>
											<h4 className="text-sm font-medium text-gray-300 mb-2">
												Report Reason
											</h4>
											<Badge
												className={getReportReasonBadgeColor(
													selectedComment.content
												)}>
												{selectedComment.content}
											</Badge>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-end space-x-3">
									<Button
										variant="outline"
										onClick={handleCloseDialog}
										className="border-gray-600 text-gray-300 hover:bg-gray-800">
										Close
									</Button>
									<Button
										onClick={() => {
											handleModerate(selectedComment._id, 'approved');
											handleCloseDialog();
										}}
										className="bg-green-600 hover:bg-green-700">
										<Check className="h-4 w-4 mr-2" />
										Approve
									</Button>
									<Button
										variant="destructive"
										onClick={() => {
											handleModerate(selectedComment._id, 'rejected');
											handleCloseDialog();
										}}
										className="bg-red-600 hover:bg-red-700">
										<X className="h-4 w-4 mr-2" />
										Reject
									</Button>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

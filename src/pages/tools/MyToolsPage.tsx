import { EditableToolCardModal } from '@/components/tools/ToolEditModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { getMyTools } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Edit, Eye, Plus, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const statusColorMap: { [key: string]: string } = {
	pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
	approved: 'bg-green-500/20 text-green-400 border-green-500/30',
	rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function MyToolsPage() {
	const [tools, setTools] = useState<Tool[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();

	const fetchMyTools = useCallback(async () => {
		try {
			const data = await getMyTools();
			setTools(data);
		} catch (error) {
			if (user) {
				toast.error('Failed to fetch your tools. Please try again.');
			}
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	useEffect(() => {
		const loadTools = async () => {
			setIsLoading(true);
			if (user) {
				await fetchMyTools();
			} else {
				setTools([]);
				setIsLoading(false);
			}
		};
		loadTools();
	}, [user, fetchMyTools]);

	const handleToolUpdate = useCallback(() => {
		fetchMyTools();
	}, [fetchMyTools]);

	const MobileToolCard = ({ tool }: { tool: Tool }) => (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2 }}>
			<Card
				className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
				onClick={() => setSelectedTool(tool)}>
				<CardContent className="p-6">
					<div className="flex items-start space-x-4">
						{/* Logo */}
						<div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700 ring-2 ring-gray-600 flex-shrink-0">
							{tool.logoUrl ? (
								<img
									src={tool.logoUrl}
									alt={tool.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
									{tool.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between mb-2">
								<h3 className="font-bold text-white text-lg line-clamp-1">
									{tool.name}
								</h3>
								{tool.isFeatured && (
									<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs ml-2">
										<Star className="h-3 w-3 mr-1 fill-current" />
										Featured
									</Badge>
								)}
							</div>
							<p className="text-gray-400 text-sm line-clamp-2 mb-4">
								{tool.tagline}
							</p>

							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="flex items-center space-x-2">
									<Eye className="h-4 w-4 text-blue-400" />
									<span className="text-gray-300 text-sm">
										{tool.analytics?.totalViews || 0}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-purple-400" />
									<span className="text-gray-300 text-sm">
										{new Date(tool.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>

							<Badge className={statusColorMap[tool.status]} variant="outline">
								{tool.status}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);

	return (
		<div className="min-h-screen bg-gray-950">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-white mb-2">
								My Tool Submissions
							</h1>
							<p className="text-xl text-gray-400">
								Here is the status of all the tools you have submitted for
								review.
							</p>
						</div>
						<Button
							onClick={() => navigate('/submit-tool')}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
							<Plus className="mr-2 h-5 w-5" />
							Submit New Tool
						</Button>
					</div>

					{/* Stats */}
					{tools.length > 0 && (
						<motion.div
							className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-400">Total Tools</p>
											<p className="text-3xl font-bold text-white">
												{tools.length}
											</p>
										</div>
										<BarChart3 className="h-8 w-8 text-blue-400" />
									</div>
								</CardContent>
							</Card>
							<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-400">Approved</p>
											<p className="text-3xl font-bold text-green-400">
												{tools.filter((t) => t.status === 'approved').length}
											</p>
										</div>
										<div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
											<Star className="h-5 w-5 text-green-400" />
										</div>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-400">Pending</p>
											<p className="text-3xl font-bold text-yellow-400">
												{tools.filter((t) => t.status === 'pending').length}
											</p>
										</div>
										<div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
											<Calendar className="h-5 w-5 text-yellow-400" />
										</div>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-400">Total Views</p>
											<p className="text-3xl font-bold text-blue-400">
												{tools
													.reduce(
														(sum, tool) =>
															sum + (tool.analytics?.totalViews || 0),
														0
													)
													.toLocaleString()}
											</p>
										</div>
										<Eye className="h-8 w-8 text-blue-400" />
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</motion.div>

				{/* Content */}
				{isLoading ? (
					<motion.div
						className="flex items-center justify-center py-16"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}>
						<div className="flex items-center space-x-3 text-gray-400">
							<div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg">Loading your tools...</span>
						</div>
					</motion.div>
				) : (
					<>
						{/* Desktop Table View */}
						<motion.div
							className="hidden lg:block"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}>
							<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
								<CardHeader className="border-b border-gray-800/50">
									<CardTitle className="text-2xl font-bold text-white">
										Your Tools
									</CardTitle>
								</CardHeader>
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow className="border-gray-800/50 hover:bg-gray-800/30">
												<TableHead className="text-gray-300">
													Tool Name
												</TableHead>
												<TableHead className="text-gray-300">Status</TableHead>
												<TableHead className="text-gray-300">Views</TableHead>
												<TableHead className="text-gray-300">
													Comments
												</TableHead>
												<TableHead className="text-gray-300">
													Submitted On
												</TableHead>
												<TableHead className="text-gray-300">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{tools.length > 0 ? (
												tools.map((tool, index) => (
													<motion.tr
														key={tool._id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.05 }}
														className="border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
														onClick={() => setSelectedTool(tool)}>
														<TableCell className="font-medium">
															<div className="flex items-center space-x-3">
																<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 ring-2 ring-gray-600">
																	{tool.logoUrl ? (
																		<img
																			src={tool.logoUrl}
																			alt={tool.name}
																			className="w-full h-full object-cover"
																		/>
																	) : (
																		<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
																			{tool.name.charAt(0)}
																		</div>
																	)}
																</div>
																<div>
																	<div className="flex items-center space-x-2">
																		<p className="font-semibold text-white">
																			{tool.name}
																		</p>
																		{tool.isFeatured && (
																			<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">
																				Featured
																			</Badge>
																		)}
																	</div>
																	<p className="text-gray-400 text-sm">
																		{tool.tagline}
																	</p>
																</div>
															</div>
														</TableCell>
														<TableCell>
															<Badge
																className={statusColorMap[tool.status]}
																variant="outline">
																{tool.status}
															</Badge>
														</TableCell>
														<TableCell className="text-gray-300">
															{tool.analytics?.totalViews || 0}
														</TableCell>
														<TableCell className="text-gray-300">
															{tool.commentStats?.totalComments || 0}
														</TableCell>
														<TableCell className="text-gray-300">
															{new Date(tool.createdAt).toLocaleDateString()}
														</TableCell>
														<TableCell>
															<Button
																variant="ghost"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation();
																	setSelectedTool(tool);
																}}
																className="text-gray-400 hover:text-white hover:bg-gray-800/50">
																<Edit className="h-4 w-4" />
															</Button>
														</TableCell>
													</motion.tr>
												))
											) : (
												<TableRow>
													<TableCell colSpan={6} className="text-center py-12">
														<div className="flex flex-col items-center space-y-4">
															<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center">
																<Plus className="h-10 w-10 text-gray-500" />
															</div>
															<div>
																<h3 className="text-xl font-bold text-gray-400 mb-2">
																	You haven't submitted any tools yet.
																</h3>
																<Button
																	onClick={() => navigate('/submit-tool')}
																	className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
																	Submit Your First Tool
																</Button>
															</div>
														</div>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</motion.div>

						{/* Mobile Card View */}
						<motion.div
							className="lg:hidden space-y-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}>
							{tools.length > 0 ? (
								tools.map((tool, index) => (
									<motion.div
										key={tool._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}>
										<MobileToolCard tool={tool} />
									</motion.div>
								))
							) : (
								<Card className="bg-gray-900/30 border-gray-800/30">
									<CardContent className="p-12 text-center">
										<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
											<Plus className="h-10 w-10 text-gray-500" />
										</div>
										<h3 className="text-2xl font-bold text-gray-400 mb-2">
											No tools submitted yet
										</h3>
										<p className="text-gray-500 mb-6">
											Get started by submitting your first tool for review.
										</p>
										<Button
											onClick={() => navigate('/submit-tool')}
											className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
											Submit Your First Tool
										</Button>
									</CardContent>
								</Card>
							)}
						</motion.div>
					</>
				)}

				{/* Edit Modal */}
				{selectedTool && (
					<EditableToolCardModal
						tool={selectedTool}
						onClose={() => setSelectedTool(null)}
						onUpdate={handleToolUpdate}
					/>
				)}
			</div>
		</div>
	);
}

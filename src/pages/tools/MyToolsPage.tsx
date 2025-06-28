import { EditableToolCardModal } from '@/components/tools/ToolEditModal';
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
import { Calendar, Edit, ExternalLink, Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const statusColorMap: { [key: string]: string } = {
	pending:
		'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400',
	approved:
		'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400',
	rejected:
		'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400',
};

export function MyToolsPage() {
	const [tools, setTools] = useState<Tool[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();

	// ✅ Wrap fetchMyTools in useCallback to memoize it
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
	}, [user]); // ✅ Include user as dependency since it's used inside

	// ✅ Now fetchMyTools can be safely included in useEffect dependencies
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
	}, [user, fetchMyTools]); // ✅ Include fetchMyTools in dependencies

	const handleToolUpdate = useCallback(() => {
		fetchMyTools();
	}, [fetchMyTools]); // ✅ Also wrap handleToolUpdate for consistency

	// ✅ Mobile card component for better responsive design
	const MobileToolCard = ({ tool }: { tool: Tool }) => (
		<Card
			key={tool._id}
			className="cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => setSelectedTool(tool)}>
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					{/* Logo */}
					<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
						{tool.logoUrl ? (
							<img
								src={tool.logoUrl}
								alt={`${tool.name} logo`}
								className="w-full h-full object-cover rounded-lg"
							/>
						) : (
							<span className="text-lg font-bold text-gray-500">
								{tool.name.charAt(0).toUpperCase()}
							</span>
						)}
					</div>

					{/* Content */}
					<div className="flex-grow min-w-0">
						<div className="flex items-start justify-between gap-2 mb-2">
							<h3 className="font-semibold text-base line-clamp-1">
								{tool.name}
							</h3>
							{/* ✅ Featured badge positioned properly for mobile */}
							{tool.isFeatured && (
								<Badge variant="secondary" className="text-xs flex-shrink-0">
									Featured
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
							<div className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								<span>{tool.analytics?.totalViews || 0}</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>{new Date(tool.createdAt).toLocaleDateString()}</span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<Badge
								variant="outline"
								className={`text-xs ${statusColorMap[tool.status]}`}>
								{tool.status}
							</Badge>
							<Button variant="ghost" size="sm">
								<Edit className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<>
			<div className="container mx-auto py-12 px-4">
				<Card className="w-full max-w-6xl mx-auto">
					<CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
						<div>
							<CardTitle className="text-3xl">My Tool Submissions</CardTitle>
							<CardDescription>
								Here is the status of all the tools you have submitted for
								review.
								{tools.length > 0 && (
									<span className="block mt-1 text-sm font-medium">
										Total: {tools.length} tool{tools.length !== 1 ? 's' : ''}
										{' • '}
										Approved:{' '}
										{tools.filter((t) => t.status === 'approved').length}
										{' • '}
										Pending:{' '}
										{tools.filter((t) => t.status === 'pending').length}
										{' • '}
										Rejected:{' '}
										{tools.filter((t) => t.status === 'rejected').length}
									</span>
								)}
							</CardDescription>
						</div>
						<Button
							onClick={() => navigate('/submit-tool')}
							className="flex-shrink-0">
							Submit New Tool
						</Button>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="text-center p-8 text-muted-foreground">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
								Loading your tools...
							</div>
						) : (
							<>
								{/* ✅ Desktop Table View */}
								<div className="hidden lg:block border rounded-md">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[40%]">Tool Name</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Views</TableHead>
												<TableHead>Comments</TableHead>
												<TableHead className="text-right">
													Submitted On
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{tools.length > 0 ? (
												tools.map((tool) => (
													<TableRow
														key={tool._id}
														onClick={() => setSelectedTool(tool)}
														className="cursor-pointer hover:bg-muted/50">
														<TableCell className="font-medium">
															<div className="flex items-center gap-3">
																<div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
																	{tool.logoUrl ? (
																		<img
																			src={tool.logoUrl}
																			alt={tool.name}
																			className="w-full h-full object-cover rounded"
																		/>
																	) : (
																		<span className="text-sm font-bold">
																			{tool.name.charAt(0)}
																		</span>
																	)}
																</div>
																<div>
																	<div className="flex items-center gap-2">
																		<span>{tool.name}</span>
																		{tool.isFeatured && (
																			<Badge
																				variant="secondary"
																				className="text-xs">
																				Featured
																			</Badge>
																		)}
																	</div>
																	<div className="text-xs text-muted-foreground">
																		{tool.tagline}
																	</div>
																</div>
															</div>
														</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className={`capitalize ${
																	statusColorMap[tool.status]
																}`}>
																{tool.status}
															</Badge>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-1 text-sm">
																<Eye className="h-3 w-3" />
																{tool.analytics?.totalViews || 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="text-sm">
																{tool.commentStats?.totalComments || 0}
															</div>
														</TableCell>
														<TableCell className="text-right text-sm">
															{new Date(tool.createdAt).toLocaleDateString()}
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={5}
														className="text-center h-24 text-muted-foreground">
														<div className="flex flex-col items-center gap-2">
															<ExternalLink className="h-8 w-8 opacity-50" />
															<p>You haven't submitted any tools yet.</p>
															<Button
																variant="outline"
																size="sm"
																onClick={() => navigate('/submit-tool')}>
																Submit Your First Tool
															</Button>
														</div>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>

								{/* ✅ Mobile Card View */}
								<div className="lg:hidden space-y-4">
									{tools.length > 0 ? (
										tools.map((tool) => (
											<MobileToolCard key={tool._id} tool={tool} />
										))
									) : (
										<div className="text-center py-12">
											<ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<h3 className="text-lg font-medium mb-2">
												No tools submitted yet
											</h3>
											<p className="text-muted-foreground mb-4">
												Get started by submitting your first tool for review.
											</p>
											<Button onClick={() => navigate('/submit-tool')}>
												Submit Your First Tool
											</Button>
										</div>
									)}
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{selectedTool && (
				<EditableToolCardModal
					tool={selectedTool}
					onClose={() => setSelectedTool(null)}
					onUpdate={handleToolUpdate}
				/>
			)}
		</>
	);
}

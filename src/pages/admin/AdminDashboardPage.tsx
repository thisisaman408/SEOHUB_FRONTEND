import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
import { useMediaQuery } from '@/hooks/use-media-query';
import { deleteTool, updateToolStatus } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	fetchAdminStats,
	fetchAdminTools,
	fetchApprovedTools,
	fetchPendingTools,
	fetchRejectedTools,
	removeTool,
	updateToolStatus as updateToolStatusInStore,
} from '@/store/slice/adminSlice';
import { openConfirmDialog } from '@/store/slice/uiSlice';
import { isAxiosError } from 'axios';
import { motion, useAnimation } from 'framer-motion';
import {
	Activity,
	BarChart3,
	Check,
	Crown,
	List,
	Loader2,
	Rocket,
	Star,
	ThumbsUp,
	Trash2,
	Users,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type FilterType = 'pending' | 'approved' | 'rejected' | 'all';

export function AdminDashboardPage() {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const dispatch = useAppDispatch();
	const { stats, isLoading } = useAppSelector((state) => state.admin);
	const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
	const [activeFilter, setActiveFilter] = useState<FilterType>('pending');
	const [isUpdating, setIsUpdating] = useState<string | null>(null);
	const controls = useAnimation();
	const [hasAnimated, setHasAnimated] = useState(false);

	const fetchInitialData = useCallback(async () => {
		try {
			await dispatch(fetchAdminStats()).unwrap();
			const pendingTools = await dispatch(fetchPendingTools()).unwrap();
			setDisplayedTools(pendingTools);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to fetch dashboard data.');
			}
		}
	}, [dispatch]);

	useEffect(() => {
		fetchInitialData();
	}, [fetchInitialData]);

	const fetchToolsByFilter = useCallback(
		async (filter: FilterType) => {
			try {
				let toolsData: Tool[] = [];
				switch (filter) {
					case 'pending':
						toolsData = await dispatch(fetchPendingTools()).unwrap();
						break;
					case 'approved':
						toolsData = await dispatch(fetchApprovedTools()).unwrap();
						break;
					case 'rejected':
						toolsData = await dispatch(fetchRejectedTools()).unwrap();
						break;
					case 'all':
						toolsData = await dispatch(fetchAdminTools()).unwrap();
						break;
				}
				setDisplayedTools(toolsData);
			} catch (error) {
				if (isAxiosError(error)) {
					toast.error(`Failed to fetch ${filter} tools.`);
				}
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (isMobile && !hasAnimated && displayedTools.length > 0) {
			const sequence = async () => {
				await controls.start({
					x: -120,
					transition: { duration: 0.5, delay: 0.5 },
				});
				await controls.start({
					x: 0,
					transition: { duration: 0.5, delay: 1.5 },
				});
			};
			sequence();
			setHasAnimated(true);
		}
	}, [displayedTools, isMobile, hasAnimated, controls]);

	const handleFilterClick = (filter: FilterType) => {
		setActiveFilter(filter);
		fetchToolsByFilter(filter);
	};

	const handleFeatureToggle = async (tool: Tool) => {
		if (tool.status !== 'approved') {
			toast.error('Only approved tools can be featured.');
			return;
		}

		setIsUpdating(tool._id);
		try {
			await updateToolStatus(tool._id, 'approved', !tool.isFeatured);
			dispatch(
				updateToolStatusInStore({
					toolId: tool._id,
					status: 'approved',
					isFeatured: !tool.isFeatured,
				})
			);
			toast.success(`Tool ${!tool.isFeatured ? 'featured' : 'unfeatured'}.`);
			await fetchToolsByFilter(activeFilter);
			dispatch(fetchAdminStats());
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to update feature status.');
			}
		} finally {
			setIsUpdating(null);
		}
	};

	const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
		setIsUpdating(id);
		try {
			await updateToolStatus(id, status, false);
			dispatch(
				updateToolStatusInStore({
					toolId: id,
					status,
					isFeatured: false,
				})
			);
			toast.success(`Tool has been ${status}.`);
			fetchToolsByFilter(activeFilter);
			dispatch(fetchAdminStats());
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to update tool status.');
			}
		} finally {
			setIsUpdating(null);
		}
	};

	const handleDeleteClick = (tool: Tool) => {
		dispatch(
			openConfirmDialog({
				title: 'Confirm Deletion',
				description: `Are you sure you want to permanently delete "${tool.name}"? This action cannot be undone.`,
				onConfirm: () => handleConfirmDelete(tool),
			})
		);
	};

	const handleConfirmDelete = async (tool: Tool) => {
		setIsUpdating(tool._id);
		try {
			await deleteTool(tool._id);
			dispatch(removeTool(tool._id));
			toast.success(`Tool "${tool.name}" has been deleted.`);
			fetchToolsByFilter(activeFilter);
			dispatch(fetchAdminStats());
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to delete tool.');
			}
			console.error('Deletion error:', error);
		} finally {
			setIsUpdating(null);
		}
	};

	const StatCard = ({
		title,
		value,
		icon,
		filter,
		color = 'blue',
	}: {
		title: string;
		value: number | string;
		icon: React.ReactNode;
		filter: FilterType;
		color?: string;
	}) => (
		<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
			<Card
				onClick={() => handleFilterClick(filter)}
				className={`cursor-pointer transition-all duration-300 bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/70 hover:shadow-lg ${
					activeFilter === filter
						? `ring-2 ring-${color}-500/50 shadow-${color}-500/20`
						: ''
				}`}>
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-400">{title}</p>
							<p className="text-3xl font-bold text-white">{value}</p>
						</div>
						<div className={`text-${color}-400`}>{icon}</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);

	const ToolActions = ({ tool }: { tool: Tool }) => (
		<div className="flex items-center space-x-2">
			{tool.status === 'pending' && (
				<>
					<Button
						size="sm"
						onClick={() => handleUpdate(tool._id, 'approved')}
						disabled={isUpdating === tool._id}
						className="bg-green-600 hover:bg-green-700 text-white">
						{isUpdating === tool._id ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<>
								<Check className="h-3 w-3 mr-1" />
								Approve
							</>
						)}
					</Button>
					<Button
						size="sm"
						variant="destructive"
						onClick={() => handleUpdate(tool._id, 'rejected')}
						disabled={isUpdating === tool._id}
						className="bg-red-600 hover:bg-red-700">
						<X className="h-3 w-3 mr-1" />
						Reject
					</Button>
				</>
			)}
			{tool.status === 'approved' && (
				<Button
					size="sm"
					variant={tool.isFeatured ? 'destructive' : 'secondary'}
					onClick={() => handleFeatureToggle(tool)}
					disabled={isUpdating === tool._id}
					className={
						tool.isFeatured
							? 'bg-yellow-600 hover:bg-yellow-700 text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-white'
					}>
					<Crown className="h-3 w-3 mr-1" />
					{tool.isFeatured ? 'Unfeature' : 'Feature'}
				</Button>
			)}
			<Button
				size="sm"
				variant="destructive"
				onClick={() => handleDeleteClick(tool)}
				disabled={isUpdating === tool._id}
				className="bg-red-600/80 hover:bg-red-600">
				<Trash2 className="h-3 w-3" />
			</Button>
		</div>
	);

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
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<BarChart3 className="h-6 w-6 text-white" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Manage tools, users, and platform analytics
					</p>
				</motion.div>

				{/* Stats Grid */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<StatCard
						title="All Tools"
						value={stats?.tools.all ?? '...'}
						icon={<List className="h-8 w-8" />}
						filter="all"
						color="blue"
					/>
					<StatCard
						title="Approved"
						value={stats?.tools.approved ?? '...'}
						icon={<ThumbsUp className="h-8 w-8" />}
						filter="approved"
						color="green"
					/>
					<StatCard
						title="Pending"
						value={stats?.tools.pending ?? '...'}
						icon={<Rocket className="h-8 w-8" />}
						filter="pending"
						color="yellow"
					/>
					<StatCard
						title="Total Users"
						value={stats?.users.total ?? '...'}
						icon={<Users className="h-8 w-8" />}
						filter="all"
						color="purple"
					/>
				</motion.div>

				{/* Tools Management */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
								<Activity className="h-6 w-6 text-blue-400" />
								<span>
									{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}{' '}
									Tools
								</span>
							</CardTitle>
							<CardDescription className="text-gray-400">
								Review and manage all tool submissions
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							{isLoading ? (
								<div className="flex items-center justify-center py-16">
									<div className="flex items-center space-x-3 text-gray-400">
										<div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
										<span>Loading tools...</span>
									</div>
								</div>
							) : (
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow className="border-gray-800/50 hover:bg-gray-800/30">
												<TableHead className="text-gray-300">Tool</TableHead>
												<TableHead className="text-gray-300">
													Submitted By
												</TableHead>
												<TableHead className="text-gray-300">Status</TableHead>
												<TableHead className="text-gray-300">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{displayedTools.length > 0 ? (
												displayedTools.map((tool, index) => (
													<motion.tr
														key={tool._id}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.05 }}
														className="border-gray-800/50 hover:bg-gray-800/30 transition-colors">
														<TableCell className="font-medium">
															<div className="space-y-1">
																<div className="flex items-center space-x-3">
																	<img
																		src={
																			tool.logoUrl ||
																			`https://placehold.co/40x40/374151/9CA3AF?text=${tool.name.charAt(
																				0
																			)}`
																		}
																		alt={tool.name}
																		className="w-10 h-10 rounded-lg object-cover"
																	/>
																	<div>
																		<p className="text-white font-semibold">
																			{tool.name}
																		</p>
																		<p className="text-gray-400 text-sm">
																			{tool.tagline}
																		</p>
																	</div>
																</div>
															</div>
														</TableCell>
														<TableCell className="text-gray-300">
															{tool.submittedBy?.companyName ?? 'N/A'}
														</TableCell>
														<TableCell>
															<div className="flex items-center space-x-2">
																<span
																	className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																		tool.status === 'approved'
																			? 'bg-green-500/20 text-green-400'
																			: tool.status === 'pending'
																			? 'bg-yellow-500/20 text-yellow-400'
																			: 'bg-red-500/20 text-red-400'
																	}`}>
																	{tool.status}
																</span>
																{tool.isFeatured && (
																	<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
																		<Star className="h-3 w-3 mr-1" />
																		Featured
																	</span>
																)}
															</div>
														</TableCell>
														<TableCell>
															<ToolActions tool={tool} />
														</TableCell>
													</motion.tr>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={4}
														className="text-center py-12 text-gray-400">
														No tools found for this filter.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<ConfirmDialog />
			</div>
		</div>
	);
}

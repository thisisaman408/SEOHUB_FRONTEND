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
import { useMediaQuery } from '@/hooks/use-media-query';
import {
	deleteTool,
	getAdminStats,
	getAllToolsAdmin,
	getApprovedTools,
	getPendingTools,
	getRejectedTools,
	updateToolStatus,
} from '@/lib/api';
import { type Tool } from '@/lib/types';
import { isAxiosError } from 'axios';
import { motion, useAnimation } from 'framer-motion';
import {
	Check,
	List,
	Loader2,
	Rocket,
	ThumbsUp,
	Trash2,
	Users,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define types for clarity
type FilterType = 'pending' | 'approved' | 'rejected' | 'all';
interface AdminStats {
	tools: {
		approved: number;
		pending: number;
		rejected: number;
		featured: number;
		all: number;
	};
	users: { total: number };
}

export function AdminDashboardPage() {
	const { logout } = useAuth();
	const isMobile = useMediaQuery('(max-width: 768px)');

	// State management
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
	const [activeFilter, setActiveFilter] = useState<FilterType>('pending');
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState<string | null>(null);

	// Animation state
	const controls = useAnimation();
	const [hasAnimated, setHasAnimated] = useState(false);

	// Fetch stats and initial tool list
	useEffect(() => {
		const fetchInitialData = async () => {
			setIsLoading(true);
			try {
				const statsData = await getAdminStats();
				setStats(statsData);
				await fetchToolsByFilter('pending', true);
			} catch (error) {
				if (isAxiosError(error)) {
					toast.error('Failed to fetch dashboard data.');
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchInitialData();
	}, []);

	const fetchToolsByFilter = async (
		filter: FilterType,
		initialLoad = false
	) => {
		if (!initialLoad) setIsLoading(true);
		try {
			let toolsData: Tool[] = [];
			switch (filter) {
				case 'pending':
					toolsData = await getPendingTools();
					break;
				case 'approved':
					toolsData = await getApprovedTools();
					break;
				case 'rejected':
					toolsData = await getRejectedTools();
					break;
				case 'all':
					toolsData = await getAllToolsAdmin();
					break;
			}
			setDisplayedTools(toolsData);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(`Failed to fetch ${filter} tools.`);
			}
		} finally {
			if (!initialLoad) setIsLoading(false);
		}
	};

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
			toast.success(`Tool ${!tool.isFeatured ? 'featured' : 'unfeatured'}.`);
			await fetchToolsByFilter(activeFilter);
			const statsData = await getAdminStats();
			setStats(statsData);
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
			toast.success(`Tool has been ${status}.`);
			fetchToolsByFilter(activeFilter);
			const statsData = await getAdminStats();
			setStats(statsData);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to update tool status.');
			}
		} finally {
			setIsUpdating(null);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!window.confirm('Are you sure you want to permanently delete this tool?')
		)
			return;
		setIsUpdating(id);
		try {
			await deleteTool(id);
			toast.success('Tool has been deleted.');
			fetchToolsByFilter(activeFilter);
			const statsData = await getAdminStats();
			setStats(statsData);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error('Failed to delete tool.');
			}
		} finally {
			setIsUpdating(null);
		}
	};

	// --- UI Components ---
	const StatCard = ({
		title,
		value,
		icon,
		filter,
	}: {
		title: string;
		value: number | string;
		icon: React.ReactNode;
		filter: FilterType;
	}) => (
		<Card
			onClick={() => handleFilterClick(filter)}
			className={`cursor-pointer transition-all ${
				activeFilter === filter ? 'border-primary' : ''
			}`}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);

	const ToolActions = ({ tool }: { tool: Tool }) => (
		<div className="text-right space-x-2 flex justify-end">
			{tool.status === 'pending' && (
				<>
					<Button
						size="sm"
						variant="outline"
						className="bg-green-100 text-green-700 hover:bg-green-200"
						onClick={() => handleUpdate(tool._id, 'approved')}
						disabled={isUpdating === tool._id}>
						{isUpdating === tool._id ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Check className="h-4 w-4 mr-1" />
								Approve
							</>
						)}
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleUpdate(tool._id, 'rejected')}
						disabled={isUpdating === tool._id}>
						<X className="h-4 w-4 mr-1" />
						Reject
					</Button>
				</>
			)}
			{tool.status === 'approved' && (
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleFeatureToggle(tool)}
					disabled={isUpdating === tool._id}>
					<Rocket className="h-4 w-4 mr-1" />
					{tool.isFeatured ? 'Unfeature' : 'Feature'}
				</Button>
			)}
			<Button
				size="sm"
				variant="destructive"
				onClick={() => handleDelete(tool._id)}
				disabled={isUpdating === tool._id}>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
				<h1 className="text-xl font-semibold">Admin Dashboard</h1>
				<Button variant="outline" onClick={logout}>
					Logout
				</Button>
			</header>
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<StatCard
						title="All Tools"
						value={stats?.tools.all ?? '...'}
						icon={<List className="h-4 w-4 text-muted-foreground" />}
						filter="all"
					/>
					<StatCard
						title="Approved"
						value={stats?.tools.approved ?? '...'}
						icon={<ThumbsUp className="h-4 w-4 text-muted-foreground" />}
						filter="approved"
					/>
					<StatCard
						title="Pending"
						value={stats?.tools.pending ?? '...'}
						icon={<Loader2 className="h-4 w-4 text-muted-foreground" />}
						filter="pending"
					/>
					<StatCard
						title="Rejected"
						value={stats?.tools.rejected ?? '...'}
						icon={<X className="h-4 w-4 text-muted-foreground" />}
						filter="rejected"
					/>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Users</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats?.users.total ?? '...'}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="capitalize">{activeFilter} Tools</CardTitle>
						<CardDescription>
							Review and manage all tool submissions.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="flex justify-center items-center p-8">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : (
							<div className="border rounded-md overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[40%]">Tool</TableHead>
											<TableHead>Submitted By</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{displayedTools.length > 0 ? (
											displayedTools.map((tool, index) => (
												<TableRow key={tool._id}>
													<TableCell>
														<motion.div
															animate={index === 0 ? controls : undefined}
															className="flex flex-col">
															<a
																href={tool.websiteUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="font-medium hover:underline">
																{tool.name}
															</a>
															<div className="text-sm text-muted-foreground">
																{tool.tagline}
															</div>
														</motion.div>
													</TableCell>
													<TableCell>
														{tool.submittedBy?.companyName ?? 'N/A'}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 text-xs rounded-full ${
																tool.status === 'approved'
																	? 'bg-green-100 text-green-800'
																	: tool.status === 'pending'
																	? 'bg-yellow-100 text-yellow-800'
																	: 'bg-red-100 text-red-800'
															}`}>
															{tool.status} {tool.isFeatured && '(Featured)'}
														</span>
													</TableCell>
													<TableCell className="min-w-[250px]">
														<ToolActions tool={tool} />
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={4} className="text-center h-24">
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
			</main>
		</div>
	);
}

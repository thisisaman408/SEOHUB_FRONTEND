// src/pages/tools/components/ToolAnalytics.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getToolAnalytics } from '@/lib/api';
import { type ToolAnalytics as ToolAnalyticsType } from '@/lib/types';
import { motion } from 'framer-motion';
import {
	Activity,
	Calendar,
	Download,
	Eye,
	Globe,
	MousePointer,
	Share,
	TrendingUp,
	Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { toast } from 'sonner';

interface ToolAnalyticsProps {
	toolId: string;
	isOwner: boolean;
}

export function ToolAnalytics({ toolId, isOwner }: ToolAnalyticsProps) {
	const [analytics, setAnalytics] = useState<ToolAnalyticsType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

	useEffect(() => {
		const loadAnalytics = async () => {
			if (!isOwner) return;

			setIsLoading(true);
			try {
				const data = await getToolAnalytics(toolId, timeRange);
				setAnalytics(data);
			} catch (error) {
				console.error('Failed to load analytics:', error);
				toast.error('Failed to load analytics data');
			} finally {
				setIsLoading(false);
			}
		};

		loadAnalytics();
	}, [toolId, timeRange, isOwner]);

	if (!isOwner) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="space-y-8">
				{/* Header Skeleton */}
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<div className="h-8 bg-gray-700 rounded w-48 animate-pulse" />
						<div className="h-4 bg-gray-700 rounded w-64 animate-pulse" />
					</div>
					<div className="h-10 bg-gray-700 rounded w-32 animate-pulse" />
				</div>

				{/* Stats Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<Card key={i} className="bg-gray-900/30 border-gray-800/30">
							<CardContent className="p-6">
								<div className="animate-pulse space-y-3">
									<div className="h-4 bg-gray-700 rounded w-20" />
									<div className="h-8 bg-gray-700 rounded w-16" />
									<div className="h-3 bg-gray-700 rounded w-24" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Chart Skeleton */}
				<Card className="bg-gray-900/30 border-gray-800/30">
					<CardContent className="p-6">
						<div className="h-80 bg-gray-700 rounded animate-pulse" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!analytics) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<Card className="bg-gray-900/30 border-gray-800/30">
					<CardContent className="p-12 text-center">
						<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
							<Activity className="h-10 w-10 text-gray-500" />
						</div>
						<h3 className="text-xl font-bold text-gray-400 mb-2">
							No analytics data
						</h3>
						<p className="text-gray-500">
							Analytics data will appear once your tool gets some traffic.
						</p>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	};

	const getChangeColor = (change: number) => {
		if (change > 0) return 'text-green-400';
		if (change < 0) return 'text-red-400';
		return 'text-gray-400';
	};

	const getChangeIcon = (change: number) => {
		if (change > 0) return <TrendingUp className="h-3 w-3" />;
		if (change < 0) return <TrendingUp className="h-3 w-3 rotate-180" />;
		return null;
	};

	return (
		<motion.div
			className="space-y-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-2xl font-bold text-white flex items-center space-x-3">
						<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<Activity className="h-5 w-5 text-white" />
						</div>
						<span>Analytics Dashboard</span>
					</h3>
					<p className="text-gray-400 mt-1">
						Track your tool's performance and engagement
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Select
						value={timeRange}
						onValueChange={(value: '7d' | '30d' | '90d') =>
							setTimeRange(value)
						}>
						<SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-gray-800 border-gray-700">
							<SelectItem value="7d">Last 7 days</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
							<SelectItem value="90d">Last 90 days</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Views */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
									<Eye className="h-6 w-6 text-blue-400" />
								</div>
								<Badge
									variant="outline"
									className="border-gray-600 text-gray-300">
									Views
								</Badge>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold text-white">
									{formatNumber(analytics.totalViews)}
								</div>
								<div
									className={`flex items-center space-x-1 text-sm ${getChangeColor(
										analytics.viewsChange
									)}`}>
									{getChangeIcon(analytics.viewsChange)}
									<span>
										{analytics.viewsChange > 0 ? '+' : ''}
										{analytics.viewsChange.toFixed(1)}% vs last period
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Unique Visitors */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
									<Users className="h-6 w-6 text-green-400" />
								</div>
								<Badge
									variant="outline"
									className="border-gray-600 text-gray-300">
									Visitors
								</Badge>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold text-white">
									{formatNumber(analytics.uniqueVisitors)}
								</div>
								<div
									className={`flex items-center space-x-1 text-sm ${getChangeColor(
										analytics.visitorsChange
									)}`}>
									{getChangeIcon(analytics.visitorsChange)}
									<span>
										{analytics.visitorsChange > 0 ? '+' : ''}
										{analytics.visitorsChange.toFixed(1)}% vs last period
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Click-through Rate */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
									<MousePointer className="h-6 w-6 text-purple-400" />
								</div>
								<Badge
									variant="outline"
									className="border-gray-600 text-gray-300">
									CTR
								</Badge>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold text-white">
									{analytics.clickThroughRate.toFixed(1)}%
								</div>
								<div
									className={`flex items-center space-x-1 text-sm ${getChangeColor(
										analytics.ctrChange
									)}`}>
									{getChangeIcon(analytics.ctrChange)}
									<span>
										{analytics.ctrChange > 0 ? '+' : ''}
										{analytics.ctrChange.toFixed(1)}% vs last period
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* External Clicks */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
									<Globe className="h-6 w-6 text-orange-400" />
								</div>
								<Badge
									variant="outline"
									className="border-gray-600 text-gray-300">
									Clicks
								</Badge>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold text-white">
									{formatNumber(analytics.externalClicks)}
								</div>
								<div
									className={`flex items-center space-x-1 text-sm ${getChangeColor(
										analytics.clicksChange
									)}`}>
									{getChangeIcon(analytics.clicksChange)}
									<span>
										{analytics.clicksChange > 0 ? '+' : ''}
										{analytics.clicksChange.toFixed(1)}% vs last period
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Views Over Time */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
								<TrendingUp className="h-5 w-5 text-blue-400" />
								<span>Views Over Time</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={analytics.dailyData}>
									<defs>
										<linearGradient
											id="viewsGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
									<XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
									<YAxis stroke="#9ca3af" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: '#1f2937',
											border: '1px solid #374151',
											borderRadius: '8px',
											color: '#ffffff',
										}}
									/>
									<Area
										type="monotone"
										dataKey="views"
										stroke="#3b82f6"
										fillOpacity={1}
										fill="url(#viewsGradient)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</motion.div>

				{/* Traffic Sources */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
								<Share className="h-5 w-5 text-green-400" />
								<span>Traffic Sources</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={analytics.trafficSources}>
									<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
									<XAxis dataKey="source" stroke="#9ca3af" fontSize={12} />
									<YAxis stroke="#9ca3af" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: '#1f2937',
											border: '1px solid #374151',
											borderRadius: '8px',
											color: '#ffffff',
										}}
									/>
									<Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Additional Metrics */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.7 }}>
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardHeader className="border-b border-gray-800/50">
						<CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-purple-400" />
							<span>Performance Metrics</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center p-4 bg-gray-800/30 rounded-lg">
								<div className="text-2xl font-bold text-white mb-1">
									{analytics.averageTimeOnPage.toFixed(1)}s
								</div>
								<div className="text-sm text-gray-400">Avg. Time on Page</div>
							</div>
							<div className="text-center p-4 bg-gray-800/30 rounded-lg">
								<div className="text-2xl font-bold text-white mb-1">
									{analytics.bounceRate.toFixed(1)}%
								</div>
								<div className="text-sm text-gray-400">Bounce Rate</div>
							</div>
							<div className="text-center p-4 bg-gray-800/30 rounded-lg">
								<div className="text-2xl font-bold text-white mb-1">
									{analytics.returnVisitors.toFixed(1)}%
								</div>
								<div className="text-sm text-gray-400">Return Visitors</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
}

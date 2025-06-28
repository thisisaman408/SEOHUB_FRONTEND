// src/pages/tools/components/ToolAnalytics.tsx
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getToolAnalytics } from '@/lib/api';
import { type ToolAnalytics as ToolAnalyticsType } from '@/lib/types';
import { Calendar, Eye, Globe, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface ToolAnalyticsProps {
	toolId: string;
}

export function ToolAnalytics({ toolId }: ToolAnalyticsProps) {
	// ✅ Removed unused 'user' variable
	const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
	const [analytics, setAnalytics] = useState<ToolAnalyticsType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

	// ✅ Memoized refreshAnalytics to fix useEffect dependency
	const refreshAnalytics = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getToolAnalytics(toolId, period);
			setAnalytics(data);
		} catch (error) {
			console.error('Failed to fetch analytics:', error);
		} finally {
			setIsLoading(false);
		}
	}, [toolId, period]);

	// ✅ Added refreshAnalytics to dependency array
	useEffect(() => {
		if (toolId) {
			refreshAnalytics();
		}
	}, [toolId, refreshAnalytics]);

	if (isLoading) {
		return (
			<div className="space-y-6">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<div className="h-4 bg-muted rounded animate-pulse" />
						</CardHeader>
						<CardContent>
							<div className="h-32 bg-muted rounded animate-pulse" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!analytics) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="font-semibold mb-2">Unable to load analytics data.</h3>
					<Button onClick={refreshAnalytics} variant="outline">
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Analytics Dashboard</h2>
					<p className="text-muted-foreground">
						Track your tool's performance and user engagement
					</p>
				</div>
				{/* ✅ Fixed: Use proper type instead of 'any' */}
				<Select
					value={period}
					onValueChange={(value) => setPeriod(value as '7d' | '30d' | '90d')}>
					<SelectTrigger className="w-32">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="7d">Last 7 days</SelectItem>
						<SelectItem value="30d">Last 30 days</SelectItem>
						<SelectItem value="90d">Last 90 days</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							All time views
						</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.totalViews.toLocaleString()}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Unique users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.uniqueViews.toLocaleString()}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Last 7 days</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.weeklyViews.toLocaleString()}
						</div>
						<Badge variant="secondary" className="mt-1">
							<TrendingUp className="h-3 w-3 mr-1" />
							Weekly
						</Badge>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Last 30 days</CardTitle>
						<Globe className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.monthlyViews.toLocaleString()}
						</div>
						<Badge variant="secondary" className="mt-1">
							<Calendar className="h-3 w-3 mr-1" />
							Monthly
						</Badge>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Daily Views</CardTitle>
					<CardDescription>Views over the selected time period</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={analytics.dailyBreakdown}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="_id" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="totalViews"
								stroke="#8884d8"
								strokeWidth={2}
							/>
							<Line
								type="monotone"
								dataKey="uniqueViews"
								stroke="#82ca9d"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{analytics.topCountries.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Top Countries</CardTitle>
						<CardDescription>Views by country</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<ResponsiveContainer width="100%" height={250}>
								<PieChart>
									<Pie
										data={analytics.topCountries}
										cx="50%"
										cy="50%"
										outerRadius={80}
										fill="#8884d8"
										dataKey="views"
										label={({ _id, percent }) =>
											`${_id} ${percent ? (percent * 100).toFixed(0) : '0'}%`
										}>
										{analytics.topCountries.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
							<div className="space-y-2">
								{analytics.topCountries.map((country, index) => (
									<div
										key={country._id}
										className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{
													backgroundColor: COLORS[index % COLORS.length],
												}}
											/>
											<span className="text-sm">{country._id}</span>
										</div>
										<span className="text-sm font-medium">
											{country.views} views
										</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

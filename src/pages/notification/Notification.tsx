import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	AlertCircle,
	Archive,
	Bell,
	Check,
	Filter,
	MoreVertical,
	Star,
	Trash2,
	TrendingUp,
	X,
} from 'lucide-react';
import { useState } from 'react';

interface Notification {
	id: string;
	type: 'info' | 'success' | 'warning' | 'error';
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
	category: 'tool' | 'account' | 'system' | 'billing';
	actionable?: boolean;
}

export function NotificationPage() {
	// Dummy data and logic as per your file, unchanged
	const [filter, setFilter] = useState<
		'all' | 'unread' | 'tool' | 'account' | 'system' | 'billing'
	>('all');
	const [notifications, setNotifications] = useState<Notification[]>([
		// ...your notification data
	]);

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'success':
				return <Check className="h-5 w-5 text-green-400" />;
			case 'warning':
				return <AlertCircle className="h-5 w-5 text-yellow-400" />;
			case 'error':
				return <X className="h-5 w-5 text-red-400" />;
			default:
				return <Bell className="h-5 w-5 text-blue-400" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'success':
				return 'border-l-green-500 bg-green-900/30';
			case 'warning':
				return 'border-l-yellow-500 bg-yellow-900/30';
			case 'error':
				return 'border-l-red-500 bg-red-900/30';
			default:
				return 'border-l-blue-500 bg-blue-900/30';
		}
	};

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	const deleteNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const filteredNotifications = notifications.filter((notification) => {
		if (filter === 'all') return true;
		if (filter === 'unread') return !notification.read;
		return notification.category === filter;
	});

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<div className="min-h-screen bg-gray-950">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<Bell className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-white">Notifications</h1>
								<p className="text-gray-400">
									Stay updated with your SEO progress and system alerts
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<Button
								variant="outline"
								size="sm"
								onClick={markAllAsRead}
								className="bg-gray-700 text-gray-300 hover:bg-gray-800">
								<Check className="h-4 w-4 mr-2" />
								Mark All Read
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="bg-gray-700 text-gray-300 hover:bg-gray-800">
								<Filter className="h-4 w-4 mr-2" />
								Filter
							</Button>
						</div>
					</div>
					{/* Stats Cards */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">Total</p>
										<p className="text-2xl font-bold text-white">
											{notifications.length}
										</p>
									</div>
									<Bell className="h-7 w-7 text-blue-400" />
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">Unread</p>
										<p className="text-2xl font-bold text-red-400">
											{unreadCount}
										</p>
									</div>
									<AlertCircle className="h-7 w-7 text-red-400" />
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">Tools</p>
										<p className="text-2xl font-bold text-white">
											{
												notifications.filter((n) => n.category === 'tool')
													.length
											}
										</p>
									</div>
									<Star className="h-7 w-7 text-yellow-400" />
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">Performance</p>
										<p className="text-2xl font-bold text-blue-400">
											{
												notifications.filter((n) => n.category === 'account')
													.length
											}
										</p>
									</div>
									<TrendingUp className="h-7 w-7 text-green-400" />
								</div>
							</CardContent>
						</Card>
					</div>
					{/* Filters */}
					<div className="flex flex-wrap gap-2">
						{[
							{ key: 'all', label: 'All' },
							{ key: 'unread', label: 'Unread' },
							{ key: 'tool', label: 'Tools' },
							{ key: 'account', label: 'Performance' },
							{ key: 'billing', label: 'Billing' },
							{ key: 'system', label: 'System' },
						].map((filterOption) => (
							<Button
								key={filterOption.key}
								variant={filter === filterOption.key ? 'default' : 'outline'}
								size="sm"
								onClick={() =>
									setFilter(
										filterOption.key as
											| 'all'
											| 'unread'
											| 'tool'
											| 'account'
											| 'system'
											| 'billing'
									)
								}
								className={`flex items-center ${
									filter === filterOption.key
										? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-400'
								}`}>
								<span>{filterOption.label}</span>¯
								{filterOption.key === 'unread' && unreadCount > 0 && (
									<Badge
										variant="destructive"
										className="ml-2 px-1.5 py-0.5 text-xs">
										{unreadCount}
									</Badge>
								)}
							</Button>
						))}
					</div>
				</div>
				<div className="space-y-4">
					{filteredNotifications.length === 0 ? (
						<Card className="bg-gray-900 border-gray-800">
							<CardContent className="p-12 text-center">
								<Bell className="h-16 w-16 text-gray-700 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-400 mb-2">
									You're all caught up! Check back later for updates.
								</h3>
							</CardContent>
						</Card>
					) : (
						filteredNotifications.map((notification) => (
							<Card
								key={notification.id}
								className={`border-l-4 ${getTypeColor(
									notification.type
								)} bg-gray-900 border-gray-800 transition-all duration-200 hover:shadow-md`}>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-4 flex-1">
											<div className="flex-shrink-0 mt-1">
												{getTypeIcon(notification.type)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-2 mb-2">
													<h3
														className={`font-semibold ${
															!notification.read
																? 'text-white'
																: 'text-gray-400'
														}`}>
														{notification.title}
													</h3>
													{!notification.read && (
														<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
													)}
													<Badge
														variant="outline"
														className="text-xs border-gray-700 text-gray-400">
														{notification.category}
													</Badge>
												</div>
												<p
													className={`${
														!notification.read
															? 'text-gray-200'
															: 'text-gray-400'
													} mb-2`}>
													{notification.message}
												</p>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-500">
														{notification.timestamp}
													</span>
													{notification.actionable && (
														<Button
															variant="link"
															size="sm"
															className="p-0 h-auto text-blue-400 hover:text-blue-300">
															Take Action →
														</Button>
													)}
												</div>
											</div>
										</div>
										{/* Actions */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="flex-shrink-0 text-gray-400 hover:text-white">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-gray-900 border-gray-800">
												{!notification.read && (
													<DropdownMenuItem
														onClick={() => markAsRead(notification.id)}
														className="text-gray-300 hover:bg-gray-800">
														<Check className="h-4 w-4 mr-2" />
														Mark as Read
													</DropdownMenuItem>
												)}
												<DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
													<Archive className="h-4 w-4 mr-2" />
													Archive
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => deleteNotification(notification.id)}
													className="text-red-400 hover:bg-red-900/30">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</div>
	);
}

// Create src/app/AdminLayout.tsx
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { logout as apiLogout } from '@/lib/api';
import { BarChart3, LogOut, MessageSquare, Settings } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function AdminLayout() {
	const { logout } = useAuth();
	const location = useLocation();

	const handleLogout = () => {
		apiLogout();
		logout();
	};

	const isActive = (path: string) => location.pathname.includes(path);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="bg-white dark:bg-gray-800 shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center gap-8">
							<Link to="/admin/dashboard" className="flex items-center gap-2">
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
									<Settings className="h-5 w-5 text-white" />
								</div>
								<h1 className="text-xl font-bold">Admin Panel</h1>
							</Link>

							{/* Navigation */}
							<nav className="hidden md:flex gap-1">
								<Link
									to="/admin/dashboard"
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
										isActive('dashboard')
											? 'bg-primary/10 text-primary'
											: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
									}`}>
									<BarChart3 className="h-4 w-4" />
									Dashboard
								</Link>
								<Link
									to="/admin/comments"
									className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
										isActive('comments')
											? 'bg-primary/10 text-primary'
											: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
									}`}>
									<MessageSquare className="h-4 w-4" />
									Comments
								</Link>
							</nav>
						</div>

						{/* User Actions */}
						<div className="flex items-center gap-4">
							<Button variant="outline" onClick={handleLogout} size="sm">
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			<div className="md:hidden bg-white dark:bg-gray-800 border-b">
				<div className="px-4 py-2 space-y-1">
					<Link
						to="/admin/dashboard"
						className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							isActive('dashboard')
								? 'bg-primary/10 text-primary'
								: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
						}`}>
						<BarChart3 className="h-4 w-4 inline mr-2" />
						Dashboard
					</Link>
					<Link
						to="/admin/comments"
						className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							isActive('comments')
								? 'bg-primary/10 text-primary'
								: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
						}`}>
						<MessageSquare className="h-4 w-4 inline mr-2" />
						Comments
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<Outlet />
			</main>
		</div>
	);
}

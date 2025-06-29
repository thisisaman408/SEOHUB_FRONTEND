import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slice/authSlice';
import { motion } from 'framer-motion';
import {
	BarChart3,
	Bell,
	CreditCard,
	Crown,
	LifeBuoy,
	LogOut,
	Settings,
	Star,
	User as UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useAppSelector((state) => state.auth);

	if (!user) return null;

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-12 w-12 rounded-full hover:bg-gray-800/50 transition-all duration-200 group">
					<Avatar className="h-10 w-10 ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300">
						<AvatarImage src={user.companyLogoUrl} alt={user.companyName} />
						<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
							{user.companyName?.[0]?.toUpperCase() ?? 'U'}
						</AvatarFallback>
					</Avatar>
					{/* Enhanced notification dot */}
					<motion.div
						className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-gray-900 shadow-lg"
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Infinity }}>
						<div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" />
					</motion.div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80 p-0 bg-gray-900 border-gray-700/50 shadow-2xl"
				align="end"
				forceMount>
				{/* Enhanced User Info Header */}
				<div className="relative p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-b border-gray-700/50 overflow-hidden">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
					<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16" />

					<div className="relative flex items-center space-x-4">
						<Avatar className="h-14 w-14 ring-2 ring-gray-600 shadow-lg">
							<AvatarImage src={user.companyLogoUrl} alt={user.companyName} />
							<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
								{user.companyName?.[0]?.toUpperCase() ?? 'U'}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="font-bold text-white text-lg truncate">
								{user.companyName}
							</p>
							<p className="text-gray-400 text-sm truncate">{user.email}</p>
							<div className="flex items-center mt-2">
								<Crown className="h-4 w-4 text-yellow-400 mr-2" />
								<span className="text-yellow-400 text-sm font-semibold">
									Pro Plan
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced Usage Stats */}
				<div className="p-4 bg-gray-800/30 border-b border-gray-700/50">
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
							<div className="text-2xl font-bold text-green-400">250</div>
							<div className="text-xs text-gray-400 font-medium">
								Credits Left
							</div>
							<div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
								<div
									className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
									style={{ width: '75%' }}
								/>
							</div>
						</div>
						<div className="text-center p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
							<div className="text-2xl font-bold text-blue-400">12</div>
							<div className="text-xs text-gray-400 font-medium">
								Tools Used
							</div>
							<div className="flex items-center justify-center mt-2">
								<Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
								<span className="text-xs text-gray-400">This Month</span>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced Menu Items */}
				<div className="p-2">
					{/* Primary Actions */}
					<div className="space-y-1">
						<DropdownMenuItem
							onClick={() => navigate('/profile')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<UserIcon className="mr-3 h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">My Profile</span>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => navigate('/dashboard')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<BarChart3 className="mr-3 h-5 w-5 text-green-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">Dashboard</span>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => navigate('/my-tools')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<Star className="mr-3 h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">My Tools</span>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => navigate('/submit-tool')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<Settings className="mr-3 h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">Submit New Tool</span>
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator className="my-2 bg-gray-700/50" />

					{/* Secondary Actions */}
					<div className="space-y-1">
						<DropdownMenuItem
							onClick={() => navigate('/billing')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<CreditCard className="mr-3 h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">Billing & Usage</span>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => navigate('/notifications')}
							className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<Bell className="mr-3 h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">Notifications</span>
							<motion.span
								className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 1.5, repeat: Infinity }}>
								3
							</motion.span>
						</DropdownMenuItem>

						<DropdownMenuItem className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/70 cursor-pointer text-gray-300 hover:text-white transition-all duration-200 group">
							<LifeBuoy className="mr-3 h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
							<span className="font-medium">Help & Support</span>
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator className="my-2 bg-gray-700/50" />

					{/* Logout */}
					<DropdownMenuItem
						onClick={handleLogout}
						className="flex items-center px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer transition-all duration-200 group">
						<LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
						<span className="font-medium">Log out</span>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

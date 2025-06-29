import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserNav } from './UserNav';

interface HeaderProps {
	onOpenLogin: () => void;
	onOpenSignup: () => void;
}

export function Header({ onOpenLogin, onOpenSignup }: HeaderProps) {
	const { user } = useAppSelector((state) => state.auth);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/90 border-b border-gray-800/50 shadow-lg shadow-black/5">
			<div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50 pointer-events-none" />

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 sm:h-18 items-center justify-between">
					<motion.div
						className="flex items-center space-x-4"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}>
						<Link to="/" className="flex items-center space-x-3 group">
							<div className="relative">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 transform group-hover:scale-105">
									<span className="text-white font-bold text-lg">GT</span>
								</div>

								<div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
							</div>
							<span className="font-bold text-xl text-white hidden sm:block group-hover:text-blue-300 transition-colors duration-300">
								GT Motion
							</span>
						</Link>
					</motion.div>

					<motion.nav
						className="hidden md:flex items-center space-x-8"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}>
						{[
							{ to: '/tools', label: 'Tools' },
							{ to: '/dashboard', label: 'Dashboard' },
							{ to: '/analytics', label: 'Analytics' },
							{ to: '/pricing', label: 'Pricing' },
						].map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className="relative text-gray-300 hover:text-white font-medium transition-colors duration-300 group px-3 py-2 rounded-lg hover:bg-gray-800/50">
								{link.label}
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
							</Link>
						))}
					</motion.nav>

					<motion.div
						className="flex items-center space-x-4"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}>
						{user ? (
							<div className="flex items-center space-x-3">
								<div className="hidden sm:flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
									<span className="text-gray-300 text-sm font-medium">
										Credits: 250
									</span>
								</div>
								<UserNav />
							</div>
						) : (
							<div className="flex items-center space-x-3">
								<Button
									variant="ghost"
									onClick={onOpenLogin}
									className="hidden sm:inline-flex font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg transition-all duration-200">
									Sign In
								</Button>
								<Button
									onClick={onOpenSignup}
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
									Get Started
								</Button>
							</div>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
							<AnimatePresence mode="wait">
								{isMobileMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}>
										<X className="w-5 h-5" />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}>
										<Menu className="w-5 h-5" />
									</motion.div>
								)}
							</AnimatePresence>
						</Button>
					</motion.div>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}>
							<div className="py-6 space-y-4">
								<div className="relative px-4">
									<Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Search SEO tools..."
										className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-white placeholder:text-gray-400"
									/>
								</div>
								<nav className="px-4 space-y-2">
									{[
										{ to: '/tools', label: 'Tools' },
										{ to: '/dashboard', label: 'Dashboard' },
										{ to: '/analytics', label: 'Analytics' },
										{ to: '/pricing', label: 'Pricing' },
									].map((link) => (
										<Link
											key={link.to}
											to={link.to}
											className="block text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
											onClick={() => setIsMobileMenuOpen(false)}>
											{link.label}
										</Link>
									))}
								</nav>

								{!user && (
									<div className="px-4 pt-4 border-t border-gray-800/50 space-y-3">
										<Button
											variant="ghost"
											onClick={() => {
												onOpenLogin();
												setIsMobileMenuOpen(false);
											}}
											className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 py-3">
											Sign In
										</Button>
										<Button
											onClick={() => {
												onOpenSignup();
												setIsMobileMenuOpen(false);
											}}
											className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl">
											Get Started
										</Button>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}

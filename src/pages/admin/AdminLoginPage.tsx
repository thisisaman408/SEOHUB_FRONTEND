import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminLogin as apiAdminLogin } from '@/lib/api';
import { type LoginCredentials } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	clearError,
	loginFailure,
	loginStart,
	loginSuccess,
} from '@/store/slice/authSlice';
import { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminLoginPageProps {
	onAdminLogin: () => void;
}

export function AdminLoginPage({ onAdminLogin }: AdminLoginPageProps) {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);

	// Clear any existing errors when component mounts
	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	// Show error toast when error changes
	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Clear error when user starts typing
		if (error) {
			dispatch(clearError());
		}
		setCredentials({ ...credentials, [e.target.id]: e.target.value });
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		// Dispatch login start action
		dispatch(loginStart());
		try {
			const adminData = await apiAdminLogin(credentials);
			// Dispatch login success action
			dispatch(loginSuccess(adminData));
			toast.success('Admin login successful');
			onAdminLogin();
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Admin login failed. Check credentials.';
			// Dispatch login failure action
			dispatch(loginFailure(message));
		}
	};

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]"></div>

			<motion.div
				className="w-full max-w-md relative z-10"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				{/* Header */}
				<div className="text-center mb-8">
					<motion.div
						className="flex items-center justify-center space-x-3 mb-4"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}>
						<div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
							<Shield className="h-8 w-8 text-white" />
						</div>
					</motion.div>
					<h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
					<p className="text-gray-400">
						Secure access to administrative dashboard
					</p>
				</div>

				{/* Login Card */}
				<Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50 shadow-2xl">
					<CardHeader className="space-y-1 text-center pb-6">
						<CardTitle className="text-2xl font-bold text-white">
							Sign In
						</CardTitle>
						<CardDescription className="text-gray-400">
							Enter administrator credentials to access the dashboard
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin} className="space-y-6">
							{/* Email Field */}
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium text-gray-300">
									Email Address
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="email"
										type="email"
										placeholder="admin@seotoolhub.com"
										value={credentials.email}
										onChange={handleChange}
										className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
										required
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium text-gray-300">
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										value={credentials.password}
										onChange={handleChange}
										className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							{/* Error Message */}
							{error && (
								<motion.div
									className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}>
									<p className="text-red-400 text-sm font-medium">{error}</p>
								</motion.div>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Authenticating...</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<Shield className="h-4 w-4" />
										<span>Access Dashboard</span>
									</div>
								)}
							</Button>
						</form>

						{/* Security Notice */}
						<div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
							<div className="flex items-start space-x-3">
								<Lock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
								<div>
									<h4 className="text-sm font-medium text-gray-300 mb-1">
										Secure Access
									</h4>
									<p className="text-xs text-gray-400 leading-relaxed">
										This is a secure admin portal. All login attempts are
										monitored and logged for security purposes.
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-gray-500 text-sm">
						Protected by enterprise-grade security
					</p>
				</div>
			</motion.div>
		</div>
	);
}

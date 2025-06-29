import { Button } from '@/components/ui/button';
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogDescription as DialogA11yDescription,
	DialogTitle as DialogA11yTitle,
	DialogContent,
	DialogOverlay,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login as apiLogin } from '@/lib/api';
import { type LoginCredentials, type User } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	clearError,
	loginFailure,
	loginStart,
	loginSuccess,
} from '@/store/slice/authSlice';
import { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	Chrome,
	Eye,
	EyeOff,
	Lock,
	Mail,
	Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LoginPageProps {
	isOpen: boolean;
	onShowSignup: () => void;
	onLoginSuccess: (userData: User) => void;
	onClose: () => void;
}

export function LoginPage({
	isOpen,
	onShowSignup,
	onLoginSuccess,
	onClose,
}: LoginPageProps) {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (error) {
			dispatch(clearError());
		}
		setCredentials({
			...credentials,
			[e.target.id]: e.target.value,
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!credentials.email || !credentials.password) {
			dispatch(loginFailure('Please enter both email and password.'));
			return;
		}

		// Dispatch login start action
		dispatch(loginStart());
		try {
			const userData = await apiLogin(credentials);
			// Dispatch login success action
			dispatch(loginSuccess(userData));
			toast.success('Login successful!');
			onLoginSuccess(userData);
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Login failed. Please try again.';

			dispatch(loginFailure(message));
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogOverlay className="bg-black/80 backdrop-blur-sm" />
			<DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white max-w-md p-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
				<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />

				<div className="relative">
					<CardHeader className="text-center pb-6 pt-8">
						<motion.div
							className="flex items-center justify-center mb-4"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}>
							<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
								<Sparkles className="h-8 w-8 text-white" />
							</div>
						</motion.div>
						<DialogA11yTitle className="sr-only">Login</DialogA11yTitle>
						<CardTitle className="text-3xl font-bold text-white mb-2">
							Welcome Back
						</CardTitle>
						<CardDescription className="text-gray-400 text-lg">
							Log in to your developer account to continue
						</CardDescription>
						<DialogA11yDescription className="sr-only">
							Log in to your developer account or switch to signup.
						</DialogA11yDescription>
					</CardHeader>

					<CardContent className="space-y-6 pb-8">
						<div>
							<Button
								variant="outline"
								className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:text-white py-3 rounded-xl transition-all duration-200"
								disabled={isLoading}>
								<Chrome className="mr-3 h-5 w-5" />
								Continue with Google
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-700/50" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-gray-900 px-4 text-gray-400 font-medium">
									Or continue with email
								</span>
							</div>
						</div>

						<form onSubmit={handleLogin} className="space-y-5">
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium text-gray-300">
									Email address
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="email"
										type="email"
										value={credentials.email}
										onChange={handleChange}
										placeholder="Enter your email"
										className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 py-3 rounded-xl"
										disabled={isLoading}
										required
									/>
								</div>
							</div>

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
										value={credentials.password}
										onChange={handleChange}
										placeholder="Enter your password"
										className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 py-3 rounded-xl"
										disabled={isLoading}
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
										disabled={isLoading}>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							{error && (
								<motion.div
									className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}>
									<p className="text-red-400 text-sm font-medium">{error}</p>
								</motion.div>
							)}

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Signing in...</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span>Sign in</span>
										<ArrowRight className="h-4 w-4" />
									</div>
								)}
							</Button>
						</form>

						<div className="text-center pt-4 border-t border-gray-800/50">
							<p className="text-gray-400">
								Don't have an account?{' '}
								<button
									type="button"
									onClick={onShowSignup}
									className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
									disabled={isLoading}>
									Create account
								</button>
							</p>
						</div>
					</CardContent>
				</div>
			</DialogContent>
		</Dialog>
	);
}

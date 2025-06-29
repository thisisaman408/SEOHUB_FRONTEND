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
import { signup as apiSignup } from '@/lib/api';
import { type SignupData, type User } from '@/lib/types';
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
	Building,
	Chrome,
	Eye,
	EyeOff,
	Lock,
	Mail,
	Rocket,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SignupPageProps {
	isOpen: boolean;
	onShowLogin: () => void;
	onSignupSuccess: (userData: User) => void;
	onClose: () => void;
}

export function SignupPage({
	isOpen,
	onShowLogin,
	onSignupSuccess,
	onClose,
}: SignupPageProps) {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);
	const [formData, setFormData] = useState<SignupData>({
		companyName: '',
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
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.companyName || !formData.email || !formData.password) {
			dispatch(loginFailure('Please fill out all fields.'));
			return;
		}

		// Dispatch login start action
		dispatch(loginStart());
		try {
			const userData = await apiSignup(formData);
			// Dispatch login success action
			dispatch(loginSuccess(userData));
			toast.success('Account created successfully!');
			onSignupSuccess(userData);
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Signup failed. Please try again.';
			// Dispatch login failure action
			dispatch(loginFailure(message));
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogOverlay className="bg-black/80 backdrop-blur-sm" />
			<DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white max-w-md p-0 overflow-hidden">
				{/* Decorative Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
				<div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl transform -translate-x-16 -translate-y-16" />

				<div className="relative">
					{/* Header - Reduced padding */}
					<CardHeader className="text-center pb-4 pt-6">
						<motion.div
							className="flex items-center justify-center mb-3"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}>
							<div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
								<Rocket className="h-7 w-7 text-white" />
							</div>
						</motion.div>
						<DialogA11yTitle className="sr-only">
							Create an Account
						</DialogA11yTitle>
						<CardTitle className="text-2xl font-bold text-white mb-1">
							Join SEO Tool Hub
						</CardTitle>
						<CardDescription className="text-gray-400 text-base">
							Create your developer account and showcase your SEO tools
						</CardDescription>
						<DialogA11yDescription className="sr-only">
							Sign up for a new developer account to list your tool.
						</DialogA11yDescription>
					</CardHeader>

					<CardContent className="space-y-4 pb-6">
						{/* Social Signup Button - Only Google */}
						<div className="px-6">
							<Button
								variant="outline"
								className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:text-white py-2.5 rounded-xl transition-all duration-200"
								disabled={isLoading}>
								<Chrome className="mr-3 h-4 w-4" />
								Continue with Google
							</Button>
						</div>

						{/* Divider */}
						<div className="relative px-6">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-700/50" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-gray-900 px-3 text-gray-400 font-medium">
									Or continue with email
								</span>
							</div>
						</div>

						{/* Signup Form - Reduced spacing */}
						<form onSubmit={handleSignup} className="space-y-4 px-6">
							{/* Company Name Field */}
							<div className="space-y-1.5">
								<Label
									htmlFor="companyName"
									className="text-sm font-medium text-gray-300">
									Company Name
								</Label>
								<div className="relative">
									<Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										id="companyName"
										type="text"
										value={formData.companyName}
										onChange={handleChange}
										placeholder="Enter your company name"
										className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 py-2.5 rounded-xl"
										disabled={isLoading}
										required
									/>
								</div>
							</div>

							{/* Email Field */}
							<div className="space-y-1.5">
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
										value={formData.email}
										onChange={handleChange}
										placeholder="Enter your email"
										className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 py-2.5 rounded-xl"
										disabled={isLoading}
										required
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="space-y-1.5">
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
										value={formData.password}
										onChange={handleChange}
										placeholder="Create a strong password"
										className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 py-2.5 rounded-xl"
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
								<p className="text-xs text-gray-500">
									Must be at least 8 characters long
								</p>
							</div>

							{/* Error Message */}
							{error && (
								<motion.div
									className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
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
								className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Creating Account...</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span>Create Account</span>
										<ArrowRight className="h-4 w-4" />
									</div>
								)}
							</Button>
						</form>

						{/* Terms Notice - Compact */}
						<div className="px-6">
							<div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
								<p className="text-xs text-gray-400 text-center leading-relaxed">
									By creating an account, you agree to our{' '}
									<span className="text-purple-400 hover:text-purple-300 cursor-pointer">
										Terms of Service
									</span>{' '}
									and{' '}
									<span className="text-purple-400 hover:text-purple-300 cursor-pointer">
										Privacy Policy
									</span>
								</p>
							</div>
						</div>

						{/* Footer - Reduced padding */}
						<div className="text-center px-6 pt-3 border-t border-gray-800/50">
							<p className="text-gray-400 text-sm">
								Already have an account?{' '}
								<button
									type="button"
									onClick={onShowLogin}
									className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
									disabled={isLoading}>
									Sign in
								</button>
							</p>
						</div>
					</CardContent>
				</div>
			</DialogContent>
		</Dialog>
	);
}

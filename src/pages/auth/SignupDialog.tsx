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
import { type User } from '@/lib/types';
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
	Eye,
	EyeOff,
	Lock,
	Mail,
	Rocket,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GoogleAccountCreationModal } from './GoogleAccountCreationModal';
import { GoogleAuthButton } from './GoogleAuthButton';

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
	const [formData, setFormData] = useState({
		companyName: '',
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);

	// Google Auth state
	const [showGoogleAccountCreation, setShowGoogleAccountCreation] =
		useState(false);
	const [googleAccountData, setGoogleAccountData] = useState<{
		tempToken: string;
		email: string;
		name: string;
		profilePicture?: string;
	} | null>(null);

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

	// Google Auth handlers
	const handleGoogleSuccess = (userData: User) => {
		onSignupSuccess(userData);
		onClose();
	};

	const handleGoogleNeedsAccount = (data: {
		tempToken: string;
		email: string;
		name: string;
		profilePicture?: string;
	}) => {
		setGoogleAccountData(data);
		setShowGoogleAccountCreation(true);
	};

	const handleGoogleAccountCreated = (userData: User) => {
		setShowGoogleAccountCreation(false);
		setGoogleAccountData(null);
		onSignupSuccess(userData);
		onClose();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
				<DialogOverlay className="bg-black/80 backdrop-blur-sm" />
				<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md p-0 overflow-hidden">
					<DialogA11yTitle className="sr-only">Create Account</DialogA11yTitle>
					<DialogA11yDescription className="sr-only">
						Sign up for a new developer account to list your tool.
					</DialogA11yDescription>

					{/* Decorative Background */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
					<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />

					{/* Header - Reduced padding */}
					<CardHeader className="relative pb-4 pt-8 px-8 text-center">
						<motion.div
							className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}>
							<Rocket className="h-8 w-8 text-white" />
						</motion.div>
						<CardTitle className="text-2xl font-bold text-white mb-2">
							Create an Account
						</CardTitle>
						<CardDescription className="text-gray-400 text-base">
							Join SEO Tool Hub
						</CardDescription>
						<p className="text-gray-500 text-sm mt-2">
							Create your developer account and showcase your SEO tools
						</p>
					</CardHeader>

					<CardContent className="relative px-8 pb-8">
						{/* Google Signup Button */}
						<div className="space-y-4 mb-6">
							<GoogleAuthButton
								onGoogleSuccess={handleGoogleSuccess}
								onNeedsAccountCreation={handleGoogleNeedsAccount}
								disabled={isLoading}
								variant="signup"
							/>

							{/* Divider */}
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t border-gray-700" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-gray-900 px-2 text-gray-400">
										Or continue with email
									</span>
								</div>
							</div>
						</div>

						{/* Signup Form - Reduced spacing */}
						<form onSubmit={handleSignup} className="space-y-4">
							{/* Company Name Field */}
							<div className="space-y-2">
								<Label
									htmlFor="companyName"
									className="text-gray-300 flex items-center space-x-2">
									<Building className="h-4 w-4 text-blue-400" />
									<span>Company Name</span>
								</Label>
								<Input
									id="companyName"
									value={formData.companyName}
									onChange={handleChange}
									placeholder="Your company name"
									className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
									required
								/>
							</div>

							{/* Email Field */}
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-gray-300 flex items-center space-x-2">
									<Mail className="h-4 w-4 text-green-400" />
									<span>Email address</span>
								</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									autoComplete="organization"
									placeholder="Enter your email"
									className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
									required
								/>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-gray-300 flex items-center space-x-2">
									<Lock className="h-4 w-4 text-purple-400" />
									<span>Password</span>
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={handleChange}
										placeholder="Create a password"
										className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 pr-12"
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
										disabled={isLoading}>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
								<p className="text-gray-500 text-xs">
									Must be at least 8 characters long
								</p>
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
							<motion.div whileTap={{ scale: 0.98 }}>
								<Button
									type="submit"
									disabled={isLoading}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 h-12">
									{isLoading ? (
										<>
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
											Creating Account...
										</>
									) : (
										<>
											<Rocket className="mr-2 h-4 w-4" />
											Create Account
											<ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</motion.div>

							{/* Terms Notice - Compact */}
							<div className="pt-2">
								<p className="text-gray-400 text-xs text-center">
									By creating an account, you agree to our{' '}
									<span className="text-blue-400 hover:underline cursor-pointer">
										Terms of Service
									</span>{' '}
									and{' '}
									<span className="text-blue-400 hover:underline cursor-pointer">
										Privacy Policy
									</span>
								</p>
							</div>
						</form>

						{/* Footer - Reduced padding */}
						<div className="mt-6 pt-4 border-t border-gray-800 text-center">
							<p className="text-gray-400 text-sm">
								Already have an account?{' '}
								<button
									onClick={onShowLogin}
									className="text-blue-400 hover:underline font-medium transition-colors"
									disabled={isLoading}>
									Sign in
								</button>
							</p>
						</div>
					</CardContent>
				</DialogContent>
			</Dialog>

			{/* Google Account Creation Modal */}
			{googleAccountData && (
				<GoogleAccountCreationModal
					isOpen={showGoogleAccountCreation}
					onClose={() => {
						setShowGoogleAccountCreation(false);
						setGoogleAccountData(null);
					}}
					onSuccess={handleGoogleAccountCreated}
					tempToken={googleAccountData.tempToken}
					email={googleAccountData.email}
					name={googleAccountData.name}
					profilePicture={googleAccountData.profilePicture}
				/>
			)}
		</>
	);
}

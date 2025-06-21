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
import { useAuth } from '@/context/AuthContext';
import { signup as apiSignup } from '@/lib/api';
import { type SignupData, type User } from '@/lib/types';
import { isAxiosError } from 'axios';
import { Chrome, Github } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SignupPageProps {
	onShowLogin: () => void;
	onSignupSuccess: (userData: User) => void; // CORRECTED: Expects a User object
	onClose: () => void;
}

export function SignupPage({
	onShowLogin,
	onSignupSuccess,
	onClose,
}: SignupPageProps) {
	const { login } = useAuth();
	const [formData, setFormData] = useState<SignupData>({
		companyName: '',
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.companyName || !formData.email || !formData.password) {
			toast.error('Please fill out all fields.');
			return;
		}
		setIsLoading(true);
		try {
			const userData = await apiSignup(formData);
			login(userData);
			toast.success('Account created successfully!');
			onSignupSuccess(userData); // Pass user data up to AppLayout
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Signup failed. Please try again.';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogOverlay />
			<DialogContent className="max-w-md">
				<DialogA11yTitle className="sr-only">Create an Account</DialogA11yTitle>
				<DialogA11yDescription className="sr-only">
					Sign up for a new developer account to list your tool.
				</DialogA11yDescription>

				<form onSubmit={handleSignup}>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">
							Create a Developer Account
						</CardTitle>
						<CardDescription>
							Join our platform and showcase your AI tool to the world.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<Button variant="outline" type="button" disabled={isLoading}>
								<Github className="mr-2 h-4 w-4" />
								GitHub
							</Button>
							<Button variant="outline" type="button" disabled={isLoading}>
								<Chrome className="mr-2 h-4 w-4" />
								Google
							</Button>
						</div>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="companyName">Company Name</Label>
							<Input
								id="companyName"
								placeholder="My Awesome AI, Inc."
								required
								value={formData.companyName}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								autoComplete="email"
								value={formData.email}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								autoComplete="new-password"
								value={formData.password}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</Button>
					</CardContent>
				</form>
				<div className="px-6 pb-4 text-center text-sm">
					Already have an account?{' '}
					<button
						type="button"
						onClick={onShowLogin}
						className="font-semibold text-primary hover:underline">
						Login
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

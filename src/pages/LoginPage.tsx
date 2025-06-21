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
import { login as apiLogin } from '@/lib/api';
import { type LoginCredentials, type User } from '@/lib/types';
import { isAxiosError } from 'axios';
import { Chrome, Github } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LoginPageProps {
	onShowSignup: () => void;
	onLoginSuccess: (userData: User) => void; // CORRECTED: Expects a User object
	onClose: () => void;
}

export function LoginPage({
	onShowSignup,
	onLoginSuccess,
	onClose,
}: LoginPageProps) {
	const { login } = useAuth();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials({
			...credentials,
			[e.target.id]: e.target.value,
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!credentials.email || !credentials.password) {
			toast.error('Please enter both email and password.');
			return;
		}
		setIsLoading(true);
		try {
			const userData = await apiLogin(credentials);
			login(userData); // Update global context
			toast.success('Login successful!');
			onLoginSuccess(userData); // Pass user data up to AppLayout
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Login failed. Please try again.';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogOverlay />
			<DialogContent className="max-w-md">
				<DialogA11yTitle className="sr-only">Login</DialogA11yTitle>
				<DialogA11yDescription className="sr-only">
					Log in to your developer account or switch to signup.
				</DialogA11yDescription>

				<form onSubmit={handleLogin}>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold tracking-tight">
							Log in to your account
						</CardTitle>
						<CardDescription>
							Or{' '}
							<button
								type="button"
								onClick={onShowSignup}
								className="font-medium text-primary hover:underline">
								create an account to list your tool
							</button>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-2 gap-3">
							<Button variant="outline" type="button" disabled={isLoading}>
								<Github className="mr-2 h-4 w-4" /> GitHub
							</Button>
							<Button variant="outline" type="button" disabled={isLoading}>
								<Chrome className="mr-2 h-4 w-4" /> Google
							</Button>
						</div>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with email
								</span>
							</div>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email address</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									autoComplete="email"
									value={credentials.email}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									required
									autoComplete="current-password"
									value={credentials.password}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</div>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</CardContent>
				</form>
			</DialogContent>
		</Dialog>
	);
}

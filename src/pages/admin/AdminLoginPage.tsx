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
		<div className="flex h-screen items-center justify-center bg-muted/40">
			<Card className="mx-auto w-80">
				<form onSubmit={handleLogin}>
					<CardHeader>
						<CardTitle className="text-2xl">Admin Access</CardTitle>
						<CardDescription>
							Enter administrator credentials to access the dashboard.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="admin@example.com"
									required
									autoComplete="email"
									value={credentials.email}
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
									autoComplete="current-password"
									value={credentials.password}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</div>
							{error && (
								<div className="text-sm text-red-600 text-center">{error}</div>
							)}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? 'Logging in...' : 'Login'}
							</Button>
						</div>
					</CardContent>
				</form>
			</Card>
		</div>
	);
}

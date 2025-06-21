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
import { useAuth } from '@/context/AuthContext';
import { adminLogin as apiAdminLogin } from '@/lib/api';
import { type LoginCredentials } from '@/lib/types';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminLoginPageProps {
	onAdminLogin: () => void;
}

export function AdminLoginPage({ onAdminLogin }: AdminLoginPageProps) {
	const { login } = useAuth();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials({ ...credentials, [e.target.id]: e.target.value });
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const adminData = await apiAdminLogin(credentials);
			login(adminData);
			toast.success('Admin login successful');
			onAdminLogin();
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Admin login failed. Check credentials.';
			toast.error(message);
		} finally {
			setIsLoading(false);
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

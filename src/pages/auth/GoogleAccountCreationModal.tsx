// src/components/auth/GoogleAccountCreationModal.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createGoogleAccount } from '@/lib/api';
import { type User } from '@/lib/types';
import { motion } from 'framer-motion';
import { Building, Check, User as UserComponent } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GoogleAccountCreationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (userData: User) => void;
	tempToken: string;
	email: string;
	name: string;
	profilePicture?: string;
}

export function GoogleAccountCreationModal({
	isOpen,
	onClose,
	onSuccess,
	tempToken,
	email,
	name,
	profilePicture,
}: GoogleAccountCreationModalProps) {
	const [companyName, setCompanyName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateAccount = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!companyName.trim()) {
			toast.error('Please enter your company name');
			return;
		}

		setIsLoading(true);
		try {
			const userData = await createGoogleAccount({
				tempToken,
				companyName: companyName.trim(),
			});

			toast.success('Account created successfully!');
			onSuccess(userData);
			onClose();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to create account';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Complete Your Account
					</DialogTitle>
				</DialogHeader>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}>
					<Card className="bg-gray-800/50 border-gray-700/50">
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<Avatar className="w-20 h-20 ring-4 ring-blue-500/30">
									<AvatarImage src={profilePicture} alt={name} />
									<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
										{name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</div>
							<CardTitle className="text-lg text-white">{name}</CardTitle>
							<CardDescription className="text-gray-400">
								{email}
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
								<div className="flex items-center space-x-2 text-blue-400 mb-2">
									<Check className="h-4 w-4" />
									<span className="font-medium">Google Account Verified</span>
								</div>
								<p className="text-gray-300 text-sm">
									We just need one more detail to complete your account setup.
								</p>
							</div>

							<form onSubmit={handleCreateAccount} className="space-y-4">
								<div>
									<Label
										htmlFor="companyName"
										className="text-gray-300 flex items-center space-x-2">
										<Building className="h-4 w-4" />
										<span>Company Name *</span>
									</Label>
									<Input
										id="companyName"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										placeholder="Enter your company name"
										className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 mt-2"
										required
									/>
									<p className="text-gray-400 text-xs mt-1">
										This will be displayed on your tool submissions
									</p>
								</div>

								<Button
									type="submit"
									disabled={isLoading || !companyName.trim()}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200">
									{isLoading ? (
										<>
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
											Creating Account...
										</>
									) : (
										<>
											<UserComponent className="mr-2 h-4 w-4" />
											Complete Account Setup
										</>
									)}
								</Button>
							</form>

							<div className="mt-6 pt-4 border-t border-gray-700">
								<p className="text-gray-400 text-xs text-center">
									By completing setup, you agree to our{' '}
									<span className="text-blue-400 hover:underline cursor-pointer">
										Terms of Service
									</span>{' '}
									and{' '}
									<span className="text-blue-400 hover:underline cursor-pointer">
										Privacy Policy
									</span>
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}

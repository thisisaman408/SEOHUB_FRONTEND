// src/components/auth/GoogleAuthButton.tsx
import { Button } from '@/components/ui/button';
import { initiateGoogleAuth, verifyGoogleToken } from '@/lib/api';
import { type User } from '@/lib/types';
import { motion } from 'framer-motion';
import { Chrome, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
interface GoogleAuthButtonProps {
	onGoogleSuccess: (userData: User) => void;
	onNeedsAccountCreation: (data: {
		tempToken: string;
		email: string;
		name: string;
		profilePicture?: string;
	}) => void;
	disabled?: boolean;
	variant?: 'login' | 'signup';
}

export function GoogleAuthButton({
	onGoogleSuccess,
	onNeedsAccountCreation,
	disabled = false,
}: GoogleAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		try {
			const googleAuthData = await initiateGoogleAuth();
			const response = await verifyGoogleToken(googleAuthData);
			if (response.needsAccountCreation) {
				onNeedsAccountCreation({
					tempToken: response.tempToken!,
					email: googleAuthData.email,
					name: googleAuthData.name,
					profilePicture: googleAuthData.profilePicture,
				});
			} else if (response.user) {
				onGoogleSuccess(response.user);
				toast.success('Successfully signed in with Google!');
			}
		} catch (error: unknown) {
			console.error('Google auth error:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Google authentication failed';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div whileTap={{ scale: 0.98 }}>
			<Button
				type="button"
				variant="outline"
				onClick={handleGoogleAuth}
				disabled={disabled || isLoading}
				className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white h-12 text-base font-medium">
				{isLoading ? (
					<Loader2 className="mr-3 h-5 w-5 animate-spin" />
				) : (
					<Chrome className="mr-3 h-5 w-5" />
				)}
				{isLoading ? 'Connecting...' : `Continue with Google`}
			</Button>
		</motion.div>
	);
}

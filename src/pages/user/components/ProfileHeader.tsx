import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slice/authSlice';
import { motion } from 'framer-motion';
import { Clock, Edit, Loader2, User, X } from 'lucide-react';
import { useEffect } from 'react';

interface ProfileHeaderProps {
	isEditing: boolean;
	isLoading: boolean;
	onEditToggle: () => void;
}

export function ProfileHeader({
	isEditing,
	isLoading,
	onEditToggle,
}: ProfileHeaderProps) {
	const dispatch = useAppDispatch();
	const { user, isUpdatingProfile, error } = useAppSelector(
		(state) => state.auth
	);
	useEffect(() => {
		if (error) {
			dispatch(clearError());
		}
	}, [dispatch, error, isEditing]);
	const handleEditToggle = () => {
		if (error) {
			dispatch(clearError());
		}

		onEditToggle();
	};
	const combinedLoading = isLoading || isUpdatingProfile;
	const displayName = user?.companyName
		? `${user.companyName}'s Profile`
		: 'My Profile';

	return (
		<CardHeader className="border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					{/* Profile Icon */}
					<motion.div
						className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}>
						<User className="h-8 w-8 text-white" />
					</motion.div>

					<div>
						<CardTitle className="text-3xl font-bold text-white mb-2">
							{displayName}
						</CardTitle>
						<CardDescription className="text-gray-400 text-lg">
							View and edit your company information and settings.
						</CardDescription>
						{user && (
							<div className="flex items-center space-x-2 mt-2">
								<Clock className="h-4 w-4 text-gray-500" />
								<span className="text-gray-500 text-sm">
									Last updated:{' '}
									{new Date(
										user.updatedAt || user.createdAt || ''
									).toLocaleDateString()}
								</span>
							</div>
						)}
					</div>
				</div>
				<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
					<Button
						onClick={handleEditToggle}
						disabled={combinedLoading}
						className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
							isEditing
								? 'bg-gray-600 hover:bg-gray-700 text-white'
								: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25'
						}`}>
						{combinedLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isUpdatingProfile ? 'Saving...' : 'Loading...'}
							</>
						) : isEditing ? (
							<>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</>
						) : (
							<>
								<Edit className="mr-2 h-4 w-4" />
								Edit Profile
							</>
						)}
					</Button>
				</motion.div>
			</div>
			{error && (
				<motion.div
					className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}>
					<p className="text-red-400 font-medium">{error}</p>
				</motion.div>
			)}
			{user && !error && !combinedLoading && (
				<motion.div
					className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}>
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
						<span className="text-green-400 text-sm font-medium">
							Profile synced successfully
						</span>
						<span className="text-gray-500 text-xs">
							(ID: {user._id.slice(-6)})
						</span>
					</div>
				</motion.div>
			)}
		</CardHeader>
	);
}

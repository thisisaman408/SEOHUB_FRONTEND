// src/pages/user/components/ProfileHeader.tsx
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slice/authSlice';
import { Edit, Loader2, X } from 'lucide-react';
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

	// Clear any Redux errors when component mounts or editing state changes
	useEffect(() => {
		if (error) {
			dispatch(clearError());
		}
	}, [dispatch, error, isEditing]);

	// Enhanced edit toggle that also handles Redux state
	const handleEditToggle = () => {
		// Clear any existing errors when toggling edit mode
		if (error) {
			dispatch(clearError());
		}

		// Call the original edit toggle function
		onEditToggle();
	};

	// Combine Redux loading state with prop loading state
	const combinedLoading = isLoading || isUpdatingProfile;

	// Get display name from Redux user state, fallback to default
	const displayName = user?.companyName
		? `${user.companyName}'s Profile`
		: 'My Profile';

	return (
		<CardHeader className="flex flex-row justify-between items-center">
			<div>
				<CardTitle className="text-3xl">{displayName}</CardTitle>
				<CardDescription>
					View and edit your company information.
					{user && (
						<span className="block text-xs text-muted-foreground mt-1">
							Last updated:{' '}
							{new Date(
								user.updatedAt || user.createdAt || ''
							).toLocaleDateString()}
						</span>
					)}
				</CardDescription>
			</div>
			<div className="flex flex-col items-end gap-2">
				{/* Show Redux error state if present */}
				{error && (
					<div className="text-xs text-red-600 max-w-xs text-right">
						{error}
					</div>
				)}

				<Button
					variant="outline"
					onClick={handleEditToggle}
					disabled={combinedLoading}>
					{isEditing ? (
						combinedLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<X className="mr-2 h-4 w-4" />
						)
					) : (
						<Edit className="mr-2 h-4 w-4" />
					)}
					{combinedLoading && isUpdatingProfile
						? 'Saving...'
						: isEditing
						? 'Cancel'
						: 'Edit Profile'}
				</Button>

				{/* Redux state indicator (optional) */}
				{user && (
					<div className="text-xs text-muted-foreground">
						User ID: {user._id.slice(-6)}
					</div>
				)}
			</div>
		</CardHeader>
	);
}

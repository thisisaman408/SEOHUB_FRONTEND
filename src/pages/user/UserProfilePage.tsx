// src/pages/user/UserProfilePage.tsx
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, updateProfile } from '@/store/slice/authSlice';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ProfileForm } from './components/ProfileForm';
import { ProfileHeader } from './components/ProfileHeader';

export function UserProfilePage() {
	const dispatch = useAppDispatch();
	const {
		user: profile,
		isLoading,
		isUpdatingProfile,
	} = useAppSelector((state) => state.auth);

	// Local state for editing mode
	const [isEditing, setIsEditing] = useState(false);

	// Form data state
	const [formData, setFormData] = useState({
		companyName: profile?.companyName || '',
	});

	const [logoPreview, setLogoPreview] = useState<string | null>(null);

	// File input ref
	const fileInputRef = useRef<HTMLInputElement>(null!);

	// Update form data when profile changes
	useEffect(() => {
		if (profile) {
			setFormData({
				companyName: profile.companyName || '',
			});
		}
	}, [profile]);

	// Clear any errors when component mounts
	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	// Handle editing toggle
	const handleEditToggle = () => {
		if (isEditing) {
			// Cancel editing - reset form data
			setFormData({
				companyName: profile?.companyName || '',
			});
			setLogoPreview(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
		setIsEditing(!isEditing);
	};

	// Handle input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle file changes
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Create preview URL
			const previewUrl = URL.createObjectURL(file);
			setLogoPreview(previewUrl);
		}
	};

	// Handle save changes
	const handleSaveChanges = async () => {
		if (!profile) return;

		try {
			const updateFormData = new FormData();
			updateFormData.append('companyName', formData.companyName);

			// Add logo file if there's a new one
			if (logoPreview && fileInputRef.current?.files?.[0]) {
				updateFormData.append('companyLogo', fileInputRef.current.files[0]);
			}

			await dispatch(updateProfile(updateFormData)).unwrap();
			toast.success('Profile updated successfully!');

			// Exit editing mode
			setIsEditing(false);
			setLogoPreview(null);

			// Clean up file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			toast.error('Failed to update profile');
			console.error('Profile update error:', error);
		}
	};

	// Combined loading state
	const combinedLoading = isLoading || isUpdatingProfile;

	if (combinedLoading && !profile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
					<p className="text-muted-foreground">Loading Profile...</p>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<p className="text-muted-foreground">
						Could not load your profile. Please try refreshing the page.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<Card>
				<ProfileHeader
					isEditing={isEditing}
					isLoading={combinedLoading}
					onEditToggle={handleEditToggle}
				/>
				<CardContent>
					<ProfileForm
						profile={profile}
						isEditing={isEditing}
						isLoading={combinedLoading}
						formData={formData}
						logoPreview={logoPreview}
						fileInputRef={fileInputRef}
						onInputChange={handleInputChange}
						onFileChange={handleFileChange}
						onSaveChanges={handleSaveChanges}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, updateProfile } from '@/store/slice/authSlice';
import { motion } from 'framer-motion';
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
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		companyName: profile?.companyName || '',
	});
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null!);
	useEffect(() => {
		if (profile) {
			setFormData({
				companyName: profile.companyName || '',
			});
		}
	}, [profile]);
	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);
	const handleEditToggle = () => {
		if (isEditing) {
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
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<motion.div
					className="flex items-center space-x-3 text-gray-400"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}>
					<div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
					<span className="text-xl">Loading Profile...</span>
				</motion.div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg
							className="h-12 w-12 text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-white mb-4">
						Profile Not Found
					</h1>
					<p className="text-gray-400">
						Could not load your profile. Please try refreshing the page.
					</p>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
			<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48" />

			<div className="relative container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-white mb-2">
							Profile Settings
						</h1>
						<p className="text-xl text-gray-400">
							Manage your account information and preferences
						</p>
					</div>
				</motion.div>

				{/* Main Profile Card */}
				<motion.div
					className="max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50 shadow-2xl">
						<ProfileHeader
							isEditing={isEditing}
							isLoading={combinedLoading}
							onEditToggle={handleEditToggle}
						/>
						<CardContent className="p-8">
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
				</motion.div>
			</div>
		</div>
	);
}

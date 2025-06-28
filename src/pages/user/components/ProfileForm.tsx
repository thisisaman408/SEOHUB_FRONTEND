// src/pages/user/components/ProfileForm.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@/lib/types';
import { useAppSelector } from '@/store/hooks';
import { Loader2, Save, Upload } from 'lucide-react';

interface ProfileFormProps {
	profile: User;
	isEditing: boolean;
	isLoading: boolean;
	formData: { companyName: string };
	logoPreview: string | null;
	fileInputRef: React.RefObject<HTMLInputElement>;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSaveChanges: () => void;
}

export function ProfileForm({
	profile,
	isEditing,
	isLoading,
	formData,
	logoPreview,
	fileInputRef,
	onInputChange,
	onFileChange,
	onSaveChanges,
}: ProfileFormProps) {
	const { isUpdatingProfile } = useAppSelector((state) => state.auth);

	// Use Redux loading state in addition to prop loading state
	const combinedLoading = isLoading || isUpdatingProfile;

	return (
		<div className="space-y-6">
			{/* Company Logo Section */}
			<div className="flex flex-col items-center space-y-4">
				<Avatar className="h-24 w-24">
					<AvatarImage
						src={logoPreview || profile.companyLogoUrl}
						alt="Company Logo"
					/>
					<AvatarFallback className="text-lg">
						{profile.companyName?.charAt(0).toUpperCase() || 'C'}
					</AvatarFallback>
				</Avatar>

				{isEditing && (
					<>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={onFileChange}
							className="hidden"
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
							disabled={combinedLoading}>
							<Upload className="h-4 w-4 mr-2" />
							Upload Logo
						</Button>
					</>
				)}
			</div>

			{/* Company Name */}
			<div className="space-y-2">
				<Label htmlFor="companyName">Company Name</Label>
				{isEditing ? (
					<Input
						id="companyName"
						name="companyName"
						type="text"
						value={formData.companyName}
						onChange={onInputChange}
						disabled={combinedLoading}
						placeholder="Enter company name"
					/>
				) : (
					<div className="p-3 bg-muted rounded-md">
						{profile.companyName || 'No company name set'}
					</div>
				)}
			</div>

			{/* Email Address */}
			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<div className="p-3 bg-muted rounded-md text-muted-foreground">
					{profile.email}
				</div>
			</div>

			{/* Save Button */}
			{isEditing && (
				<Button
					onClick={onSaveChanges}
					disabled={combinedLoading}
					className="w-full">
					{combinedLoading ? (
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					) : (
						<Save className="h-4 w-4 mr-2" />
					)}
					{isUpdatingProfile ? 'Updating...' : 'Save Changes'}
				</Button>
			)}

			{/* Profile sync indicator */}
			{profile && (
				<div className="text-xs text-muted-foreground text-center">
					Profile synced with Redux store
				</div>
			)}
		</div>
	);
}

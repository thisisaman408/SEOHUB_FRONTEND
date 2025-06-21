import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { type User } from '@/lib/types';
import { isAxiosError } from 'axios';
import { Edit, Loader2, Save, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function UserProfilePage() {
	const { login } = useAuth();
	const [profile, setProfile] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	// State for form data and file uploads
	const [formData, setFormData] = useState({ companyName: '' });
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await getUserProfile();
				setProfile(data);
				setFormData({ companyName: data.companyName });
				setLogoPreview(data.companyLogoUrl || null);
			} catch (error) {
				if (isAxiosError(error)) toast.error('Could not load profile.');
			} finally {
				setIsLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleSaveChanges = async () => {
		setIsLoading(true);
		const data = new FormData();
		data.append('companyName', formData.companyName);
		if (logoFile) {
			data.append('companyLogo', logoFile);
		}

		try {
			const updatedUser = await updateUserProfile(data);
			login(updatedUser); // <-- This updates the context and localStorage
			setProfile(updatedUser);
			toast.success('Profile updated successfully!');
			setIsEditing(false);
		} catch (error) {
			if (isAxiosError(error)) toast.error('Failed to update profile.');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading && !profile) {
		return <div className="text-center p-12">Loading Profile...</div>;
	}

	if (!profile) {
		return <div className="text-center p-12">Could not load profile.</div>;
	}

	return (
		<div className="container mx-auto max-w-2xl py-12">
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between items-center">
						My Profile
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(!isEditing)}>
							{isEditing ? (
								<X className="mr-2 h-4 w-4" />
							) : (
								<Edit className="mr-2 h-4 w-4" />
							)}
							{isEditing ? 'Cancel' : 'Edit Profile'}
						</Button>
					</CardTitle>
					<CardDescription>
						View and edit your company information.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<Avatar className="w-32 h-32 border-4 border-background shadow-lg">
								<AvatarImage
									src={logoPreview || undefined}
									alt={profile.companyName}
								/>
								<AvatarFallback className="text-4xl">
									{profile.companyName?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							{isEditing && (
								<Button
									type="button"
									size="icon"
									variant="outline"
									className="absolute bottom-0 right-0 h-10 w-10 rounded-full"
									onClick={() => fileInputRef.current?.click()}>
									<Upload className="h-5 w-5" />
								</Button>
							)}
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								onChange={handleFileChange}
								accept="image/*"
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="companyName">Company Name</Label>
						{isEditing ? (
							<Input
								id="companyName"
								value={formData.companyName}
								onChange={(e) =>
									setFormData({ ...formData, companyName: e.target.value })
								}
								disabled={isLoading}
							/>
						) : (
							<p className="text-xl font-semibold">{profile.companyName}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<p className="text-muted-foreground">{profile.email}</p>
					</div>

					{isEditing && (
						<Button
							className="w-full"
							onClick={handleSaveChanges}
							disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							Save Changes
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

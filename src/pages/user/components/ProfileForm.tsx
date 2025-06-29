// src/pages/user/components/ProfileForm.tsx

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@/lib/types';
import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';
import {
	Building,
	Calendar,
	Camera,
	Loader2,
	Mail,
	Save,
	Upload,
} from 'lucide-react';

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
	const combinedLoading = isLoading || isUpdatingProfile;

	return (
		<div className="space-y-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
					<CardContent className="p-8">
						<div className="flex items-center justify-center">
							<div className="relative group">
								<motion.div
									whileHover={isEditing ? { scale: 1.05 } : {}}
									transition={{ duration: 0.2 }}>
									<Avatar className="w-32 h-32 ring-4 ring-gray-600 group-hover:ring-blue-500/50 transition-all duration-300">
										<AvatarImage
											src={logoPreview || profile.companyLogoUrl}
											alt="Company Logo"
											className="object-cover"
										/>
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
											{profile.companyName?.charAt(0).toUpperCase() || 'C'}
										</AvatarFallback>
									</Avatar>
								</motion.div>

								{isEditing && (
									<motion.div
										className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
										onClick={() => fileInputRef.current?.click()}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}>
										<div className="text-center">
											<Camera className="h-8 w-8 text-white mx-auto mb-2" />
											<span className="text-white text-sm font-medium">
												Change
											</span>
										</div>
									</motion.div>
								)}
							</div>
						</div>

						{isEditing && (
							<motion.div
								className="text-center mt-6"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.2 }}>
								<Button
									onClick={() => fileInputRef.current?.click()}
									disabled={combinedLoading}
									variant="outline"
									className="bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
									<Upload className="mr-2 h-4 w-4" />
									Upload New Logo
								</Button>
								<p className="text-gray-400 text-sm mt-2">
									PNG, JPG up to 2MB. Recommended: 400x400px
								</p>
							</motion.div>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={onFileChange}
							className="hidden"
						/>
					</CardContent>
				</Card>
			</motion.div>
			<div className="grid md:grid-cols-2 gap-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}>
					<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
						<CardContent className="p-6">
							<Label className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
								<Building className="h-5 w-5 text-blue-400" />
								<span>Company Name</span>
							</Label>
							{isEditing ? (
								<Input
									name="companyName"
									value={formData.companyName}
									onChange={onInputChange}
									placeholder="Enter your company name"
									disabled={combinedLoading}
									className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg py-3"
								/>
							) : (
								<div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
									<span className="text-gray-300 text-lg">
										{profile.companyName || 'No company name set'}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
						<CardContent className="p-6">
							<Label className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
								<Mail className="h-5 w-5 text-green-400" />
								<span>Email Address</span>
							</Label>
							<div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
								<span className="text-gray-300 text-lg">{profile.email}</span>
								<div className="flex items-center space-x-2 mt-2">
									{/* <div className="w-2 h-2 bg-green-400 rounded-full"></div> */}
									{/* <span className="text-green-400 text-sm">Verified</span> */}
								</div>
							</div>
							<p className="text-gray-400 text-sm mt-2">
								Contact support to change your email address
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}>
				<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
					<CardContent className="p-6">
						<Label className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
							<Calendar className="h-5 w-5 text-purple-400" />
							<span>Account Information</span>
						</Label>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<span className="text-gray-400 text-sm">Member Since</span>
								<div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
									<span className="text-gray-300">
										{new Date(profile.createdAt || '').toLocaleDateString()}
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<span className="text-gray-400 text-sm">Account ID</span>
								<div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
									<span className="text-gray-300 font-mono">
										{profile._id.slice(-8).toUpperCase()}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{isEditing && (
				<motion.div
					className="flex justify-center pt-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<Button
						onClick={onSaveChanges}
						disabled={combinedLoading}
						className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
						{combinedLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isUpdatingProfile ? 'Updating...' : 'Saving...'}
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</motion.div>
			)}

			{profile && !combinedLoading && (
				<motion.div
					className="text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}>
					<div className="inline-flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
						<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
						<span className="text-gray-300 text-sm">
							Profile synced with server
						</span>
					</div>
				</motion.div>
			)}
		</div>
	);
}

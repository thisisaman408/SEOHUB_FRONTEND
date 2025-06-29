import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type MediaUploadData } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { addMedia, removeMedia } from '@/store/slice/mediaSlice';
import { motion } from 'framer-motion';
import {
	CloudUpload,
	FileText,
	Image as ImageIcon,
	Play,
	Upload,
	Video,
	X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface MediaFile {
	id: string;
	file: File;
	preview: string;
	type: 'image' | 'video' | 'document';
	category: string;
	title: string;
	description: string;
}

interface MediaUploadStepProps {
	mediaFiles: MediaFile[];
	onMediaUpload: (
		files: FileList,
		category: string,
		title: string,
		description: string
	) => void;
	onMediaRemove: (id: string) => void;
}

export function MediaUploadStep({
	mediaFiles,
	onMediaUpload,
	onMediaRemove,
}: MediaUploadStepProps) {
	const dispatch = useAppDispatch();
	const [uploadCategory, setUploadCategory] =
		useState<MediaUploadData['category']>('screenshot');
	const [uploadTitle, setUploadTitle] = useState('');
	const [uploadDescription, setUploadDescription] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			Array.from(files).forEach((file) => {
				const mediaItem = {
					_id: `temp-${Date.now()}-${Math.random()}`,
					tool: '',
					uploadedBy: { _id: '', companyName: '' },
					type: file.type.startsWith('image/')
						? ('image' as const)
						: file.type.startsWith('video/')
						? ('video' as const)
						: ('document' as const),
					category: uploadCategory,
					url: URL.createObjectURL(file),
					title: uploadTitle,
					description: uploadDescription,
					order: 0,
					status: 'active' as const,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				dispatch(addMedia({ toolId: 'temp', media: mediaItem }));
			});

			onMediaUpload(files, uploadCategory, uploadTitle, uploadDescription);
			setUploadTitle('');
			setUploadDescription('');
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleRemoveMedia = (id: string) => {
		dispatch(removeMedia({ toolId: 'temp', mediaId: id }));
		onMediaRemove(id);
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'demo_video':
			case 'tutorial':
				return <Video className="h-4 w-4" />;
			case 'screenshot':
			case 'feature_highlight':
			case 'banner':
				return <ImageIcon className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'demo_video':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			case 'tutorial':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'screenshot':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'feature_highlight':
				return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'banner':
				return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	};

	return (
		<motion.div
			className="space-y-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header */}
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-bold text-white">Media Gallery</h2>
				<p className="text-gray-400">
					Upload screenshots, demo videos, and other media to showcase your
					tool's features.
				</p>
			</div>

			{/* Upload Section */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6 space-y-6">
					{/* Category Selection */}
					<div className="space-y-3">
						<Label className="text-lg font-semibold text-white">Category</Label>
						<Select
							value={uploadCategory}
							onValueChange={(value) =>
								setUploadCategory(value as MediaUploadData['category'])
							}>
							<SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-blue-500">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 border-gray-700">
								<SelectItem value="screenshot">Screenshot</SelectItem>
								<SelectItem value="demo_video">Demo Video</SelectItem>
								<SelectItem value="tutorial">Tutorial</SelectItem>
								<SelectItem value="feature_highlight">
									Feature Highlight
								</SelectItem>
								<SelectItem value="banner">Banner</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Title */}
					<div className="space-y-3">
						<Label className="text-lg font-semibold text-white">
							Title (Optional)
						</Label>
						<Input
							value={uploadTitle}
							onChange={(e) => setUploadTitle(e.target.value)}
							placeholder="Give your media a title"
							className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500"
						/>
					</div>

					{/* Description */}
					<div className="space-y-3">
						<Label className="text-lg font-semibold text-white">
							Description (Optional)
						</Label>
						<Textarea
							value={uploadDescription}
							onChange={(e) => setUploadDescription(e.target.value)}
							placeholder="Describe what this media shows"
							className="min-h-[80px] bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 resize-none"
						/>
					</div>

					{/* File Upload */}
					<div
						className="border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/50"
						onClick={() => fileInputRef.current?.click()}>
						<div className="space-y-4">
							<div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto">
								<CloudUpload className="h-8 w-8 text-gray-400" />
							</div>
							<div>
								<Button
									type="button"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
									<Upload className="mr-2 h-4 w-4" />
									Choose Files
								</Button>
								<p className="text-gray-400 text-sm mt-3">
									Support for images, videos, and documents up to 50MB each
								</p>
							</div>
						</div>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*,video/*,.pdf,.doc,.docx"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</CardContent>
			</Card>

			{/* Uploaded Media Display */}
			{mediaFiles.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardContent className="p-6">
							<div className="flex items-center space-x-3 mb-6">
								<h3 className="text-lg font-semibold text-white">
									Uploaded Media
								</h3>
								<Badge
									variant="secondary"
									className="bg-gray-800 text-gray-300 border-gray-700">
									{mediaFiles.length}
								</Badge>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{mediaFiles.map((media) => (
									<motion.div
										key={media.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3 }}>
										<Card className="group relative overflow-hidden bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
											<CardContent className="p-0">
												{/* Media Preview */}
												<div className="aspect-video relative bg-gray-700/50">
													{media.type === 'video' ? (
														<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
															<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
																<Play className="h-6 w-6 text-white ml-1" />
															</div>
														</div>
													) : media.type === 'image' ? (
														<img
															src={media.preview}
															alt={media.title || 'Preview'}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<FileText className="h-12 w-12 text-gray-400" />
														</div>
													)}

													{/* Remove button */}
													<Button
														size="sm"
														variant="destructive"
														className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600/80 backdrop-blur-sm hover:bg-red-700"
														onClick={() => handleRemoveMedia(media.id)}>
														<X className="h-3 w-3" />
													</Button>
												</div>

												{/* Media Info */}
												<div className="p-3 space-y-2">
													<div className="flex items-center space-x-2">
														<Badge
															className={`text-xs ${getCategoryColor(
																media.category
															)}`}>
															{getCategoryIcon(media.category)}
															<span className="ml-1">
																{media.category.replace('_', ' ')}
															</span>
														</Badge>
													</div>

													{media.title && (
														<h4 className="font-medium text-white text-sm line-clamp-1">
															{media.title}
														</h4>
													)}

													{media.description && (
														<p className="text-gray-400 text-xs line-clamp-2">
															{media.description}
														</p>
													)}
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Empty State */}
			{mediaFiles.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card className="bg-gray-900/30 border-gray-800/30">
						<CardContent className="p-12 text-center">
							<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
								<ImageIcon className="h-10 w-10 text-gray-500" />
							</div>
							<h3 className="text-xl font-bold text-gray-400 mb-2">
								No media uploaded yet
							</h3>
							<p className="text-gray-500">
								Add screenshots or videos to showcase your tool
							</p>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</motion.div>
	);
}

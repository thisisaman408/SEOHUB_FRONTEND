// src/pages/tools/components/MediaUploadStep.tsx
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
import {
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
	// ✅ Removed unused mediaByTool

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
					// ✅ Fixed: Use proper type instead of 'any'
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
				return 'bg-red-100 text-red-800';
			case 'tutorial':
				return 'bg-blue-100 text-blue-800';
			case 'screenshot':
				return 'bg-green-100 text-green-800';
			case 'feature_highlight':
				return 'bg-purple-100 text-purple-800';
			case 'banner':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-2">Media Gallery</h3>
				<p className="text-sm text-muted-foreground">
					Upload screenshots, demo videos, and other media to showcase your
					tool's features.
				</p>
			</div>

			{/* Upload Section */}
			<Card>
				<CardContent className="pt-6 space-y-4">
					<div className="space-y-2">
						<Label>Category</Label>
						<Select
							value={uploadCategory}
							onValueChange={(value) =>
								setUploadCategory(value as MediaUploadData['category'])
							}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
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

					<div className="space-y-2">
						<Label htmlFor="uploadTitle">Title (Optional)</Label>
						<Input
							id="uploadTitle"
							value={uploadTitle}
							onChange={(e) => setUploadTitle(e.target.value)}
							placeholder="Give your media a title"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="uploadDescription">Description (Optional)</Label>
						<Textarea
							id="uploadDescription"
							value={uploadDescription}
							onChange={(e) => setUploadDescription(e.target.value)}
							placeholder="Describe what this media shows"
							className="min-h-[80px]"
						/>
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={() => fileInputRef.current?.click()}>
						<Upload className="mr-2 h-4 w-4" />
						Choose Files
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*,video/*,.pdf,.doc,.docx"
						onChange={handleFileSelect}
						className="hidden"
					/>
					<p className="text-xs text-muted-foreground text-center">
						Support for images, videos, and documents up to 50MB each
					</p>
				</CardContent>
			</Card>

			{/* Uploaded Media Display */}
			{mediaFiles.length > 0 && (
				<div className="space-y-4">
					<h4 className="font-medium">Uploaded Media ({mediaFiles.length})</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{mediaFiles.map((media) => (
							<Card key={media.id} className="relative">
								<CardContent className="p-4">
									<div className="flex items-start gap-3">
										<div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
											{media.type === 'video' ? (
												<Play className="h-6 w-6 text-muted-foreground" />
											) : media.type === 'image' ? (
												<img
													src={media.preview}
													alt="Preview"
													className="w-full h-full object-cover rounded-lg"
												/>
											) : (
												<FileText className="h-6 w-6 text-muted-foreground" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											{/* Remove button */}
											<Button
												variant="ghost"
												size="sm"
												className="absolute top-2 right-2 h-6 w-6 p-0"
												onClick={() => handleRemoveMedia(media.id)}>
												<X className="h-4 w-4" />
											</Button>

											<Badge
												className={`mb-2 ${getCategoryColor(media.category)}`}>
												{getCategoryIcon(media.category)}
												<span className="ml-1">
													{media.category.replace('_', ' ')}
												</span>
											</Badge>

											{media.title && (
												<h5 className="font-medium text-sm mb-1">
													{media.title}
												</h5>
											)}

											{media.description && (
												<p className="text-xs text-muted-foreground line-clamp-2">
													{media.description}
												</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{mediaFiles.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<h4 className="font-medium mb-2">No media uploaded yet</h4>
						<p className="text-sm text-muted-foreground">
							Add screenshots or videos to showcase your tool
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

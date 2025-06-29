// src/pages/tools/components/MediaGallery.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import {
	deleteMedia as deleteMediaAPI,
	updateMedia as updateMediaAPI,
	uploadMedia,
} from '@/lib/api';
import { type MediaUploadData, type ToolMedia } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	fetchToolMedia,
	removeMedia,
	updateMedia,
} from '@/store/slice/mediaSlice';
import { motion } from 'framer-motion';
import {
	Download,
	Edit,
	Image as ImageIcon,
	Play,
	Plus,
	Trash2,
	Upload,
	Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MediaGalleryProps {
	toolId: string;
	isOwner: boolean;
}

export function MediaGallery({ toolId, isOwner }: MediaGalleryProps) {
	const dispatch = useAppDispatch();
	const { mediaByTool, isLoading } = useAppSelector((state) => state.media);
	const media = mediaByTool[toolId] || [];
	const [selectedMedia, setSelectedMedia] = useState<ToolMedia | null>(null);
	const [uploadDialog, setUploadDialog] = useState(false);
	const [editDialog, setEditDialog] = useState<ToolMedia | null>(null);
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [uploadData, setUploadData] = useState<MediaUploadData>({
		category: 'screenshot',
		title: '',
		description: '',
		order: 0,
	});

	// Load media on mount
	useEffect(() => {
		dispatch(fetchToolMedia({ toolId }));
	}, [dispatch, toolId]);

	const handleUpload = async () => {
		if (!uploadFile) return;

		try {
			const formData = new FormData();
			formData.append('media', uploadFile);
			formData.append('category', uploadData.category);
			if (uploadData.title) formData.append('title', uploadData.title);
			if (uploadData.description)
				formData.append('description', uploadData.description);
			formData.append('order', (uploadData.order ?? 0).toString());

			await uploadMedia(toolId, formData);
			dispatch(fetchToolMedia({ toolId }));
			setUploadDialog(false);
			setUploadFile(null);
			setUploadData({
				category: 'screenshot',
				title: '',
				description: '',
				order: 0,
			});
			toast.success('Media uploaded successfully!');
		} catch (error) {
			console.log(error);
			toast.error('Upload failed');
		}
	};

	const handleEdit = async () => {
		if (!editDialog) return;

		try {
			const updatedMedia = await updateMediaAPI(toolId, editDialog._id, {
				title: editDialog.title,
				description: editDialog.description,
				category: editDialog.category,
				order: editDialog.order,
			});
			dispatch(updateMedia({ toolId, media: updatedMedia }));
			setEditDialog(null);
			toast.success('Media updated successfully!');
		} catch (error) {
			console.log(error);
			toast.error('Update failed');
		}
	};

	const handleDelete = async (mediaId: string) => {
		try {
			await deleteMediaAPI(toolId, mediaId);
			dispatch(removeMedia({ toolId, mediaId }));
			toast.success('Media deleted successfully!');
		} catch (error) {
			console.log(error);
			toast.error('Delete failed');
		}
	};

	const groupedMedia = media.reduce((acc, item) => {
		if (!acc[item.category]) {
			acc[item.category] = [];
		}
		acc[item.category].push(item);
		return acc;
	}, {} as Record<string, ToolMedia[]>);

	const MediaItem = ({ item }: { item: ToolMedia }) => (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2 }}>
			<Card
				className="group relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
				onClick={() => setSelectedMedia(item)}>
				<CardContent className="p-0">
					<div className="aspect-video relative bg-gray-800/50">
						{item.type === 'video' ? (
							<div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
								{item.thumbnail ? (
									<>
										<img
											src={item.thumbnail}
											alt={item.title || 'Video thumbnail'}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
											<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
												<Play className="h-6 w-6 text-white ml-1" />
											</div>
										</div>
									</>
								) : (
									<div className="flex flex-col items-center space-y-3">
										<div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
											<Video className="h-8 w-8 text-gray-400" />
										</div>
										<span className="text-gray-400 text-sm">Video</span>
									</div>
								)}
							</div>
						) : (
							<img
								src={item.url}
								alt={item.title || 'Media'}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						)}

						{/* Action Buttons */}
						{isOwner && (
							<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
								<Button
									size="sm"
									variant="secondary"
									className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-800"
									onClick={(e) => {
										e.stopPropagation();
										setEditDialog(item);
									}}>
									<Edit className="h-3 w-3" />
								</Button>
								<Button
									size="sm"
									variant="destructive"
									className="bg-red-600/80 backdrop-blur-sm hover:bg-red-700"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(item._id);
									}}>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>

					{/* Media Info */}
					{item.title && (
						<div className="p-3">
							<h4 className="font-medium text-white text-sm line-clamp-1">
								{item.title}
							</h4>
							{item.description && (
								<p className="text-gray-400 text-xs line-clamp-2 mt-1">
									{item.description}
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<Card key={i} className="bg-gray-900/30 border-gray-800/30">
						<CardContent className="p-0">
							<div className="aspect-video bg-gray-800/50 animate-pulse" />
							<div className="p-3 space-y-2">
								<div className="h-4 bg-gray-700 rounded animate-pulse" />
								<div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-2xl font-bold text-white">Media Gallery</h3>
					<p className="text-gray-400 mt-1">
						Screenshots, videos, and other media
					</p>
				</div>
				{isOwner && (
					<Button
						onClick={() => setUploadDialog(true)}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
						<Plus className="mr-2 h-4 w-4" />
						Upload Media
					</Button>
				)}
			</div>

			{/* Media Groups */}
			{Object.keys(groupedMedia).length > 0 ? (
				<div className="space-y-8">
					{Object.entries(groupedMedia).map(([category, items]) => (
						<motion.div
							key={category}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}>
							<div className="flex items-center space-x-3 mb-4">
								<h4 className="text-lg font-semibold text-white capitalize">
									{category.replace('_', ' ')}
								</h4>
								<Badge
									variant="secondary"
									className="bg-gray-800 text-gray-300 border-gray-700">
									{items.length}
								</Badge>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{items.map((item) => (
									<MediaItem key={item._id} item={item} />
								))}
							</div>
						</motion.div>
					))}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<Card className="bg-gray-900/30 border-gray-800/30">
						<CardContent className="p-12 text-center">
							<div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
								<ImageIcon className="h-10 w-10 text-gray-500" />
							</div>
							<h3 className="text-xl font-bold text-gray-400 mb-2">
								No media yet
							</h3>
							<p className="text-gray-500 mb-6">
								{isOwner
									? 'Upload screenshots, videos, or other media to showcase your tool.'
									: 'No media has been uploaded for this tool yet.'}
							</p>
							{isOwner && (
								<Button
									onClick={() => setUploadDialog(true)}
									variant="outline"
									className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
									<Plus className="mr-2 h-4 w-4" />
									Upload First Media
								</Button>
							)}
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Media Viewer Dialog */}
			<Dialog
				open={!!selectedMedia}
				onOpenChange={(open) => !open && setSelectedMedia(null)}>
				<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
					{selectedMedia && (
						<>
							<DialogHeader>
								<DialogTitle className="text-xl font-bold text-white">
									{selectedMedia.title || 'Media'}
								</DialogTitle>
								{selectedMedia.description && (
									<DialogDescription className="text-gray-400">
										{selectedMedia.description}
									</DialogDescription>
								)}
							</DialogHeader>
							<div className="space-y-4">
								{selectedMedia.type === 'video' ? (
									<video
										src={selectedMedia.url}
										controls
										className="w-full rounded-lg"
										poster={selectedMedia.thumbnail}
									/>
								) : (
									<img
										src={selectedMedia.url}
										alt={selectedMedia.title || 'Media'}
										className="w-full rounded-lg"
									/>
								)}
								<div className="flex items-center justify-between">
									<Badge
										variant="outline"
										className="border-gray-600 text-gray-300">
										{selectedMedia.category.replace('_', ' ')}
									</Badge>
									<Button
										variant="outline"
										onClick={() => window.open(selectedMedia.url, '_blank')}
										className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Upload Dialog */}
			<Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
				<DialogContent className="bg-gray-900 border-gray-700 text-white">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-white">
							Upload Media
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Add images, videos, or documents to showcase your tool.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label className="text-gray-300">File</Label>
							<Input
								type="file"
								accept="image/*,video/*"
								onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
								className="bg-gray-800 border-gray-700 text-white"
							/>
						</div>
						<div>
							<Label className="text-gray-300">Category</Label>
							<Select
								value={uploadData.category}
								onValueChange={(value) =>
									setUploadData({
										...uploadData,
										category: value as MediaUploadData['category'],
									})
								}>
								<SelectTrigger className="bg-gray-800 border-gray-700 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-700">
									<SelectItem value="screenshot">Screenshot</SelectItem>
									<SelectItem value="demo_video">Demo Video</SelectItem>
									<SelectItem value="tutorial">Tutorial</SelectItem>
									<SelectItem value="feature_highlight">
										Feature Highlight
									</SelectItem>
									<SelectItem value="logo">Logo</SelectItem>
									<SelectItem value="banner">Banner</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label className="text-gray-300">Title (optional)</Label>
							<Input
								value={uploadData.title}
								onChange={(e) =>
									setUploadData({ ...uploadData, title: e.target.value })
								}
								placeholder="Give your media a title"
								className="bg-gray-800 border-gray-700 text-white"
							/>
						</div>
						<div>
							<Label className="text-gray-300">Description (optional)</Label>
							<Textarea
								value={uploadData.description}
								onChange={(e) =>
									setUploadData({ ...uploadData, description: e.target.value })
								}
								placeholder="Describe what this media shows"
								className="bg-gray-800 border-gray-700 text-white"
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setUploadDialog(false)}
								className="border-gray-600 text-gray-300 hover:bg-gray-800">
								Cancel
							</Button>
							<Button
								onClick={handleUpload}
								disabled={!uploadFile}
								className="bg-blue-600 hover:bg-blue-700">
								<Upload className="mr-2 h-4 w-4" />
								Upload
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog
				open={!!editDialog}
				onOpenChange={(open) => !open && setEditDialog(null)}>
				<DialogContent className="bg-gray-900 border-gray-700 text-white">
					{editDialog && (
						<>
							<DialogHeader>
								<DialogTitle className="text-xl font-bold text-white">
									Edit Media
								</DialogTitle>
								<DialogDescription className="text-gray-400">
									Update the details for this media item.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label className="text-gray-300">Title</Label>
									<Input
										value={editDialog.title}
										onChange={(e) =>
											setEditDialog({ ...editDialog, title: e.target.value })
										}
										className="bg-gray-800 border-gray-700 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">Description</Label>
									<Textarea
										value={editDialog.description}
										onChange={(e) =>
											setEditDialog({
												...editDialog,
												description: e.target.value,
											})
										}
										className="bg-gray-800 border-gray-700 text-white"
									/>
								</div>
								<div>
									<Label className="text-gray-300">Category</Label>
									<Select
										value={editDialog.category}
										onValueChange={(value) =>
											setEditDialog({
												...editDialog,
												category: value as MediaUploadData['category'],
											})
										}>
										<SelectTrigger className="bg-gray-800 border-gray-700 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-gray-800 border-gray-700">
											<SelectItem value="screenshot">Screenshot</SelectItem>
											<SelectItem value="demo_video">Demo Video</SelectItem>
											<SelectItem value="tutorial">Tutorial</SelectItem>
											<SelectItem value="feature_highlight">
												Feature Highlight
											</SelectItem>
											<SelectItem value="logo">Logo</SelectItem>
											<SelectItem value="banner">Banner</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() => setEditDialog(null)}
										className="border-gray-600 text-gray-300 hover:bg-gray-800">
										Cancel
									</Button>
									<Button
										onClick={handleEdit}
										className="bg-green-600 hover:bg-green-700">
										Save Changes
									</Button>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

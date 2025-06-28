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

			// ✅ Fix: Handle possibly undefined order
			formData.append('order', (uploadData.order ?? 0).toString());

			await uploadMedia(toolId, formData);

			// Refresh media list
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
		<Card
			className="cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => setSelectedMedia(item)}>
			<CardContent className="p-3">
				<div className="relative">
					{item.type === 'video' ? (
						<div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
							{item.thumbnail ? (
								<img
									src={item.thumbnail}
									alt={item.title}
									className="w-full h-full object-cover rounded-lg"
								/>
							) : (
								<Video className="h-8 w-8 text-muted-foreground" />
							)}
							<Play className="absolute inset-0 m-auto h-8 w-8 text-white bg-black/50 rounded-full p-1" />
						</div>
					) : (
						<div className="aspect-video bg-muted rounded-lg overflow-hidden">
							<img
								src={item.url}
								alt={item.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					{isOwner && (
						<div className="absolute top-2 right-2 flex gap-1">
							<Button
								variant="secondary"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={(e) => {
									e.stopPropagation();
									setEditDialog(item);
								}}>
								<Edit className="h-3 w-3" />
							</Button>
							<Button
								variant="destructive"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(item._id);
								}}>
								<Trash2 className="h-3 w-3" />
							</Button>
						</div>
					)}
				</div>

				{item.title && (
					<div className="mt-2">
						<h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
						{item.description && (
							<p className="text-xs text-muted-foreground line-clamp-2">
								{item.description}
							</p>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="aspect-video bg-muted rounded-lg animate-pulse"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Upload Button */}
			{isOwner && (
				<Button onClick={() => setUploadDialog(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Upload Media
				</Button>
			)}

			{/* Media Groups */}
			{Object.keys(groupedMedia).length > 0 ? (
				<div className="space-y-8">
					{Object.entries(groupedMedia).map(([category, items]) => (
						<div key={category}>
							<div className="flex items-center gap-2 mb-4">
								<h3 className="text-lg font-semibold capitalize">
									{category.replace('_', ' ')}
								</h3>
								<Badge variant="secondary">{items.length}</Badge>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{items.map((item) => (
									<MediaItem key={item._id} item={item} />
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="font-medium mb-2">No media yet</h3>
						<p className="text-sm text-muted-foreground mb-4">
							{isOwner
								? 'Upload screenshots, videos, or other media to showcase your tool.'
								: 'No media has been uploaded for this tool yet.'}
						</p>
						{isOwner && (
							<Button onClick={() => setUploadDialog(true)}>
								<Upload className="h-4 w-4 mr-2" />
								Upload First Media
							</Button>
						)}
					</CardContent>
				</Card>
			)}

			{/* Media Viewer Dialog */}
			<Dialog
				open={!!selectedMedia}
				onOpenChange={(open) => !open && setSelectedMedia(null)}>
				<DialogContent className="max-w-4xl">
					{selectedMedia && (
						<>
							<DialogHeader>
								<DialogTitle>{selectedMedia.title || 'Media'}</DialogTitle>
								{selectedMedia.description && (
									<DialogDescription>
										{selectedMedia.description}
									</DialogDescription>
								)}
							</DialogHeader>
							<div className="space-y-4">
								{selectedMedia.type === 'video' ? (
									<video
										controls
										className="w-full max-h-96 rounded-lg"
										src={selectedMedia.url}
									/>
								) : (
									<img
										src={selectedMedia.url}
										alt={selectedMedia.title}
										className="w-full max-h-96 object-contain rounded-lg"
									/>
								)}
								<div className="flex items-center justify-between">
									<Badge>{selectedMedia.category.replace('_', ' ')}</Badge>
									<Button
										variant="outline"
										onClick={() => window.open(selectedMedia.url, '_blank')}>
										<Download className="h-4 w-4 mr-2" />
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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload Media</DialogTitle>
						<DialogDescription>
							Add images, videos, or documents to showcase your tool.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>File</Label>
							<Input
								type="file"
								accept="image/*,video/*,.pdf,.doc,.docx"
								onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
							/>
						</div>
						<div>
							<Label>Category</Label>
							<Select
								value={uploadData.category}
								onValueChange={(value) =>
									// ✅ Fix: Use proper type instead of 'any'
									setUploadData({
										...uploadData,
										category: value as MediaUploadData['category'],
									})
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
									<SelectItem value="logo">Logo</SelectItem>
									<SelectItem value="banner">Banner</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Title (optional)</Label>
							<Input
								value={uploadData.title}
								onChange={(e) =>
									setUploadData({ ...uploadData, title: e.target.value })
								}
								placeholder="Give your media a title"
							/>
						</div>
						<div>
							<Label>Description (optional)</Label>
							<Textarea
								value={uploadData.description}
								onChange={(e) =>
									setUploadData({ ...uploadData, description: e.target.value })
								}
								placeholder="Describe what this media shows"
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setUploadDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleUpload} disabled={!uploadFile}>
							<Upload className="h-4 w-4 mr-2" />
							Upload
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog
				open={!!editDialog}
				onOpenChange={(open) => !open && setEditDialog(null)}>
				<DialogContent>
					{editDialog && (
						<>
							<DialogHeader>
								<DialogTitle>Edit Media</DialogTitle>
								<DialogDescription>
									Update the details for this media item.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Title</Label>
									<Input
										value={editDialog.title || ''}
										onChange={(e) =>
											setEditDialog({ ...editDialog, title: e.target.value })
										}
									/>
								</div>
								<div>
									<Label>Description</Label>
									<Textarea
										value={editDialog.description || ''}
										onChange={(e) =>
											setEditDialog({
												...editDialog,
												description: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<Label>Category</Label>
									<Select
										value={editDialog.category}
										onValueChange={(value) =>
											// ✅ Fix: Use proper type instead of 'any'
											setEditDialog({
												...editDialog,
												category: value as MediaUploadData['category'],
											})
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
											<SelectItem value="logo">Logo</SelectItem>
											<SelectItem value="banner">Banner</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" onClick={() => setEditDialog(null)}>
									Cancel
								</Button>
								<Button onClick={handleEdit}>Save Changes</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

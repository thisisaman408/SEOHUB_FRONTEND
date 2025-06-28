// src/pages/tools/ToolDetailPage.tsx
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trackView } from '@/lib/api';
import { colorMap, type ToolMedia } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchToolBySlug, updateToolRating } from '@/store/slice/toolsSlice';
import {
	ArrowLeft,
	ArrowRight,
	BarChart,
	ChevronLeft,
	ExternalLink,
	Eye,
	Share2,
	Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CommentSection } from './components/comments';
import { MediaGallery } from './components/MediaGallery';
import { ModernVideoPlayer } from './components/ModernVideoPlayer';
import { ToolAnalytics } from './components/ToolAnalytics';

export function ToolDetailPage() {
	const { toolSlug } = useParams<{ toolSlug: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.auth);
	const { currentTool: tool, isLoading } = useAppSelector(
		(state) => state.tools
	);
	const { mediaByTool } = useAppSelector((state) => state.media);
	const { commentsByTool } = useAppSelector((state) => state.comments);

	const toolMedia = mediaByTool[tool?._id || ''] || [];
	const toolComments = commentsByTool[tool?._id || ''] || [];

	const totalComments = toolComments.reduce((total, comment) => {
		return total + 1 + (comment.replies?.length || 0);
	}, 0);

	const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<string>('overview');

	useEffect(() => {
		if (toolSlug) {
			dispatch(fetchToolBySlug(toolSlug));
		}
	}, [dispatch, toolSlug]);

	useEffect(() => {
		const savedTab = searchParams.get('tab') || 'overview';
		setActiveTab(savedTab);

		const savedScrollY = sessionStorage.getItem(`scroll-${toolSlug}`);
		if (savedScrollY) {
			setTimeout(() => {
				window.scrollTo(0, parseInt(savedScrollY));
			}, 100);
		}
	}, [searchParams, toolSlug]);

	useEffect(() => {
		const handleScroll = () => {
			sessionStorage.setItem(`scroll-${toolSlug}`, window.scrollY.toString());
		};

		const handleBeforeUnload = () => {
			sessionStorage.setItem(`scroll-${toolSlug}`, window.scrollY.toString());
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [toolSlug]);

	const isOwner = user && tool?.submittedBy?._id === user._id;

	const screenshots = toolMedia.filter(
		(media: ToolMedia) =>
			media.category === 'screenshot' && media.type === 'image'
	);

	const videos = toolMedia.filter((media: ToolMedia) => media.type === 'video');

	const featuredMedia =
		screenshots.length > 0
			? screenshots
			: toolMedia
					.filter((media: ToolMedia) => media.type === 'image')
					.slice(0, 4);

	const nextMedia = useCallback(() => {
		setSelectedMediaIndex((prevIndex) =>
			prevIndex < featuredMedia.length - 1 ? prevIndex + 1 : 0
		);
	}, [featuredMedia.length]);

	const prevMedia = useCallback(() => {
		setSelectedMediaIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : featuredMedia.length - 1
		);
	}, [featuredMedia.length]);

	const closeLightbox = useCallback(() => {
		setIsLightboxOpen(false);
	}, []);

	const openLightbox = useCallback((index: number) => {
		setSelectedMediaIndex(index);
		setIsLightboxOpen(true);
	}, []);

	const handleToolRatingUpdate = useCallback(
		async (
			toolId: string,
			newAverageRating: number,
			newNumberOfRatings: number
		) => {
			try {
				dispatch(
					updateToolRating({
						toolId,
						averageRating: newAverageRating,
						numberOfRatings: newNumberOfRatings,
					})
				);

				const ratingData = {
					toolId,
					averageRating: newAverageRating,
					numberOfRatings: newNumberOfRatings,
					timestamp: Date.now(),
				};
				localStorage.setItem(`rating-${toolId}`, JSON.stringify(ratingData));
			} catch (error) {
				console.error('Failed to update rating:', error);
			}
		},
		[dispatch]
	);

	const handleTabChange = (newTab: string) => {
		setActiveTab(newTab);
		setSearchParams({ tab: newTab });
	};

	useEffect(() => {
		if (tool && !isLoading) {
			trackView(tool._id, {
				source: 'direct',
				duration: 0,
			}).catch(console.error);

			const startTime = Date.now();
			const handleBeforeUnload = () => {
				const duration = Math.floor((Date.now() - startTime) / 1000);
				trackView(tool._id, {
					source: 'direct',
					duration,
				}).catch(console.error);
			};

			window.addEventListener('beforeunload', handleBeforeUnload);
			return () =>
				window.removeEventListener('beforeunload', handleBeforeUnload);
		}
	}, [tool, isLoading]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isLightboxOpen) return;
			if (event.key === 'ArrowRight') nextMedia();
			if (event.key === 'ArrowLeft') prevMedia();
			if (event.key === 'Escape') closeLightbox();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isLightboxOpen, nextMedia, prevMedia, closeLightbox]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
					<p className="text-muted-foreground">Loading tool details...</p>
				</div>
			</div>
		);
	}

	if (!tool) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold">Tool Not Found</h2>
					<p className="text-muted-foreground">
						The tool you're looking for doesn't exist or has been removed.
					</p>
					<Link to="/">
						<Button>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const colors = colorMap[tool.visual?.color || 'default'] || colorMap.default;

	return (
		<div className="min-h-screen bg-background">
			<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/">
							<Button variant="ghost" size="sm">
								<ChevronLeft className="mr-2 h-4 w-4" />
								Back to Tools
							</Button>
						</Link>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm">
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</Button>
							{tool.websiteUrl && (
								<Button
									onClick={() => window.open(tool.websiteUrl, '_blank')}
									size="sm">
									<ExternalLink className="mr-2 h-4 w-4" />
									Visit Website
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<Card
							className={`${
								tool.isFeatured ? `border-2 ${colors.border}` : ''
							}`}>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<img
										src={
											tool.logoUrl ||
											`https://placehold.co/80x80/eee/ccc?text=${tool.name.charAt(
												0
											)}`
										}
										alt={`${tool.name} logo`}
										className="w-20 h-20 rounded-lg object-cover"
									/>
									<div className="flex-1">
										<div className="flex items-start justify-between">
											<div>
												<h1 className="text-3xl font-bold">{tool.name}</h1>
												<p className="text-xl text-muted-foreground mt-1">
													{tool.tagline}
												</p>
											</div>
											{tool.isFeatured && (
												<Badge variant="secondary" className={colors.bg}>
													Featured
												</Badge>
											)}
										</div>

										<div className="flex items-center gap-4 mt-4">
											<StarRating
												toolId={tool._id}
												averageRating={tool.averageRating || 0}
												numberOfRatings={tool.numberOfRatings || 0}
												onRatingChange={handleToolRatingUpdate}
												size={20}
											/>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Eye className="h-4 w-4" />
												<span>
													{tool.analytics?.totalViews?.toLocaleString() || 0}{' '}
													views
												</span>
											</div>
										</div>

										<div className="flex flex-wrap gap-2 mt-4">
											{tool.tags?.map((tag) => (
												<Badge key={tag} variant="outline">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{featuredMedia.length > 0 && (
							<Card>
								<CardContent className="p-6">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										{featuredMedia.slice(0, 4).map((media, index) => (
											<div
												key={media._id}
												className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
												onClick={() => openLightbox(index)}>
												<img
													src={media.url}
													alt={media.title || `${tool.name} screenshot`}
													className="w-full h-full object-cover"
												/>
											</div>
										))}
									</div>
									{featuredMedia.length > 4 && (
										<Button
											variant="outline"
											className="w-full mt-4"
											onClick={() => handleTabChange('media')}>
											View All Media (+{featuredMedia.length - 4} more)
										</Button>
									)}
								</CardContent>
							</Card>
						)}

						{videos.length > 0 && (
							<Card>
								<CardContent className="p-6">
									<h3 className="text-lg font-semibold mb-4">
										Videos ({videos.length})
									</h3>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
										{videos.map((video, index) => (
											<div key={video._id} className="space-y-2">
												<ModernVideoPlayer
													src={video.url}
													poster={video.thumbnail}
													title={
														video.title || `${tool.name} Video ${index + 1}`
													}
													autoplay={index === 0}
												/>
												{video.title && (
													<p className="text-sm font-medium">{video.title}</p>
												)}
												{video.description && (
													<p className="text-xs text-muted-foreground">
														{video.description}
													</p>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
						<Tabs value={activeTab} onValueChange={handleTabChange}>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="media">
									Media ({toolMedia.length})
								</TabsTrigger>
								<TabsTrigger value="comments">
									Comments ({totalComments})
								</TabsTrigger>
								{isOwner && (
									<TabsTrigger value="analytics">Analytics</TabsTrigger>
								)}
							</TabsList>

							<TabsContent value="overview" className="mt-6">
								<Card>
									<CardContent className="p-6">
										<h3 className="text-lg font-semibold mb-4">
											About {tool.name}
										</h3>
										<p className="text-muted-foreground leading-relaxed mb-6">
											{tool.description}
										</p>

										{tool.visual?.content && tool.visual.content.length > 0 && (
											<div>
												<h4 className="font-semibold mb-3">Key Features</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													{tool.visual.content.map((item, index) => (
														<div
															key={index}
															className="flex items-center gap-3">
															{item.icon === 'zap' ? (
																<Zap className="h-5 w-5 text-yellow-500 flex-shrink-0" />
															) : (
																<BarChart className="h-5 w-5 text-blue-500 flex-shrink-0" />
															)}
															<span>{item.text}</span>
														</div>
													))}
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="media" className="mt-6">
								<MediaGallery toolId={tool._id} isOwner={isOwner || false} />
							</TabsContent>

							<TabsContent value="comments" className="mt-6">
								<CommentSection toolId={tool._id} />
							</TabsContent>

							{isOwner && (
								<TabsContent value="analytics" className="mt-6">
									<ToolAnalytics toolId={tool._id} />
								</TabsContent>
							)}
						</Tabs>
					</div>
					<div className="space-y-6">
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold mb-4">Tool Information</h3>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Developer</span>
										<span>{tool.submittedBy?.companyName || 'Anonymous'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Views</span>
										<span>
											{tool.analytics?.totalViews?.toLocaleString() || 0}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Comments</span>
										<span>{totalComments}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Rating</span>
										<span>{tool.averageRating?.toFixed(1) || 'N/A'}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Lightbox */}
			<Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
				<DialogContent className="max-w-4xl max-h-[90vh] p-0">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle>
							{featuredMedia[selectedMediaIndex]?.title || 'Media'}
						</DialogTitle>
					</DialogHeader>
					<div className="relative">
						<img
							src={featuredMedia[selectedMediaIndex]?.url}
							alt="Media preview"
							className="w-full h-auto max-h-[70vh] object-contain"
						/>
						{featuredMedia.length > 1 && (
							<>
								<Button
									variant="secondary"
									size="icon"
									className="absolute left-4 top-1/2 -translate-y-1/2"
									onClick={prevMedia}>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									className="absolute right-4 top-1/2 -translate-y-1/2"
									onClick={nextMedia}>
									<ArrowRight className="h-4 w-4" />
								</Button>
							</>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

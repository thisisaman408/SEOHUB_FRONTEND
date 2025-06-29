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
import { type ToolMedia } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchToolBySlug, updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	ArrowRight,
	BarChart,
	Calendar,
	ChevronLeft,
	ExternalLink,
	Eye,
	MessageSquare,
	Share2,
	Star,
	User,
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
	const [activeTab, setActiveTab] = useState('overview');

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
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="flex items-center space-x-3 text-gray-400">
					<div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
					<span className="text-xl">Loading tool details...</span>
				</div>
			</div>
		);
	}

	if (!tool) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
						<ExternalLink className="h-12 w-12 text-gray-500" />
					</div>
					<h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
					<p className="text-gray-400 mb-8">
						The tool you're looking for doesn't exist or has been removed.
					</p>
					<Link to="/">
						<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="flex items-center justify-between mb-6">
						<Link to="/tools">
							<Button
								variant="outline"
								className="bg-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
								<ChevronLeft className="mr-2 h-4 w-4" />
								Back to Tools
							</Button>
						</Link>
						<div className="flex items-center space-x-3">
							<Button
								variant="outline"
								className="bg-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</Button>
							{tool.websiteUrl && (
								<Button
									onClick={() => window.open(tool.websiteUrl, '_blank')}
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
									<ExternalLink className="mr-2 h-4 w-4" />
									Visit Website
								</Button>
							)}
						</div>
					</div>
				</motion.div>

				{/* Tool Header */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardContent className="p-8">
							<div className="grid lg:grid-cols-3 gap-8">
								{/* Left Column - Tool Info */}
								<div className="lg:col-span-2">
									<div className="flex items-start space-x-6 mb-6">
										{/* Logo */}
										<div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700 ring-2 ring-gray-600 flex-shrink-0">
											{tool.logoUrl ? (
												<img
													src={tool.logoUrl}
													alt={tool.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
													{tool.name.charAt(0)}
												</div>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h1 className="text-4xl font-bold text-white">
													{tool.name}
												</h1>
												{tool.isFeatured && (
													<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
														<Star className="h-3 w-3 mr-1 fill-current" />
														Featured
													</Badge>
												)}
											</div>
											<p className="text-xl text-gray-400 mb-4">
												{tool.tagline}
											</p>
											<div className="flex items-center space-x-6">
												<div className="flex items-center space-x-2">
													<Eye className="h-5 w-5 text-blue-400" />
													<span className="text-gray-300">
														{tool.analytics?.totalViews?.toLocaleString() || 0}{' '}
														views
													</span>
												</div>
												<StarRating
													toolId={tool._id}
													averageRating={tool.averageRating}
													numberOfRatings={tool.numberOfRatings}
													onRatingUpdate={handleToolRatingUpdate}
													size="md"
												/>
											</div>
										</div>
									</div>

									{/* Tags */}
									<div className="flex flex-wrap gap-2 mb-6">
										{tool.tags?.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="border-gray-600 text-gray-300 hover:bg-gray-800">
												{tag}
											</Badge>
										))}
									</div>
								</div>

								{/* Right Column - Media Preview */}
								<div className="lg:col-span-1">
									{featuredMedia.length > 0 && (
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-3">
												{featuredMedia.slice(0, 4).map((media, index) => (
													<motion.div
														key={media._id}
														className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
														onClick={() => openLightbox(index)}
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}>
														<img
															src={media.thumbnail || media.url}
															alt={media.title || 'Tool screenshot'}
															className="w-full h-full object-cover"
														/>
													</motion.div>
												))}
											</div>
											{featuredMedia.length > 4 && (
												<Button
													variant="outline"
													onClick={() => handleTabChange('media')}
													className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
													View All Media (+{featuredMedia.length - 4} more)
												</Button>
											)}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Videos Section */}
				{videos.length > 0 && (
					<motion.div
						className="mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}>
						<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
							<CardContent className="p-8">
								<h3 className="text-2xl font-bold text-white mb-6">
									Videos ({videos.length})
								</h3>
								<div className="grid gap-6">
									{videos.map((video, index) => (
										<motion.div
											key={video._id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}>
											<ModernVideoPlayer
												src={video.url}
												poster={video.thumbnail}
												title={video.title}
											/>
											{video.title && (
												<h4 className="font-semibold text-white mt-3">
													{video.title}
												</h4>
											)}
											{video.description && (
												<p className="text-gray-400 mt-1">
													{video.description}
												</p>
											)}
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Main Content Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}>
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="space-y-8">
						<TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-gray-800/50 p-1 rounded-xl">
							<TabsTrigger
								value="overview"
								className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-lg">
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="media"
								className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-lg">
								Media ({toolMedia.length})
							</TabsTrigger>
							<TabsTrigger
								value="comments"
								className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-lg">
								Comments ({totalComments})
							</TabsTrigger>
							{isOwner && (
								<TabsTrigger
									value="analytics"
									className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-lg">
									Analytics
								</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value="overview" className="space-y-8">
							<div className="grid lg:grid-cols-3 gap-8">
								{/* Main Description */}
								<div className="lg:col-span-2">
									<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
										<CardContent className="p-8">
											<h2 className="text-2xl font-bold text-white mb-6">
												About {tool.name}
											</h2>
											<div className="prose prose-gray prose-invert max-w-none">
												<p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
													{tool.description}
												</p>
											</div>

											{/* Key Features */}
											{tool.visual?.content &&
												tool.visual.content.length > 0 && (
													<div className="mt-8">
														<h3 className="text-xl font-bold text-white mb-4">
															Key Features
														</h3>
														<div className="grid gap-4">
															{tool.visual.content.map((item, index) => (
																<div
																	key={index}
																	className="flex items-start space-x-3">
																	<div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
																		{item.icon === 'zap' ? (
																			<Zap className="h-4 w-4 text-blue-400" />
																		) : (
																			<BarChart className="h-4 w-4 text-green-400" />
																		)}
																	</div>
																	<p className="text-gray-300 leading-relaxed">
																		{item.text}
																	</p>
																</div>
															))}
														</div>
													</div>
												)}
										</CardContent>
									</Card>
								</div>

								{/* Sidebar Info */}
								<div className="lg:col-span-1">
									<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
										<CardContent className="p-6">
											<h3 className="text-lg font-bold text-white mb-6">
												Tool Information
											</h3>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Developer</span>
													<div className="flex items-center space-x-2">
														<User className="h-4 w-4 text-gray-400" />
														<span className="text-white font-medium">
															{tool.submittedBy?.companyName || 'Anonymous'}
														</span>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Views</span>
													<div className="flex items-center space-x-2">
														<Eye className="h-4 w-4 text-blue-400" />
														<span className="text-white font-medium">
															{tool.analytics?.totalViews?.toLocaleString() ||
																0}
														</span>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Comments</span>
													<div className="flex items-center space-x-2">
														<MessageSquare className="h-4 w-4 text-green-400" />
														<span className="text-white font-medium">
															{totalComments}
														</span>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Rating</span>
													<div className="flex items-center space-x-2">
														<Star className="h-4 w-4 text-yellow-400 fill-current" />
														<span className="text-white font-medium">
															{tool.averageRating?.toFixed(1) || 'N/A'}
														</span>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-gray-400">Added</span>
													<div className="flex items-center space-x-2">
														<Calendar className="h-4 w-4 text-purple-400" />
														<span className="text-white font-medium">
															{new Date(tool.createdAt).toLocaleDateString()}
														</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="media">
							<MediaGallery toolId={tool._id} isOwner={isOwner ?? false} />
						</TabsContent>

						<TabsContent value="comments">
							<CommentSection toolId={tool._id} />
						</TabsContent>

						{isOwner && (
							<TabsContent value="analytics">
								<ToolAnalytics toolId={tool._id} isOwner={isOwner} />
							</TabsContent>
						)}
					</Tabs>
				</motion.div>

				{/* Lightbox */}
				<Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
					<DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
						<DialogHeader>
							<DialogTitle className="text-white">
								{featuredMedia[selectedMediaIndex]?.title || 'Media'}
							</DialogTitle>
						</DialogHeader>
						<div className="relative">
							<img
								src={featuredMedia[selectedMediaIndex]?.url}
								alt={featuredMedia[selectedMediaIndex]?.title || 'Media'}
								className="w-full rounded-lg"
							/>
							{featuredMedia.length > 1 && (
								<>
									<Button
										variant="ghost"
										size="sm"
										onClick={prevMedia}
										className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white">
										<ArrowLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={nextMedia}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white">
										<ArrowRight className="h-4 w-4" />
									</Button>
								</>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

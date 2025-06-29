// src/components/tools/ToolCard.tsx

import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { type Tool } from '@/lib/types';
// import { useAppDispatch } from '@/store/hooks';
// import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import {
	ArrowUpRight,
	Eye,
	MessageSquare,
	Star,
	TrendingUp,
	Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
	tool: Tool;
	onCardClick: () => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

export function ToolCard({
	tool,
	onCardClick,
}: // onToolRatingUpdate,
ToolCardProps) {
	// const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const placeholderUrl = `https://placehold.co/64x64/374151/9CA3AF?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;
	const featuredBorderClass = tool.isFeatured
		? `border-2 border-blue-500/50 shadow-xl shadow-blue-500/10`
		: 'border border-gray-700/50';

	const handleCardClick = () => {
		navigate(`/tool/${tool.slug || tool._id}`);
		onCardClick();
	};

	// const handleToolRatingUpdate = (
	// 	toolId: string,
	// 	newAverageRating: number,
	// 	newNumberOfRatings: number
	// ) => {
	// 	dispatch(
	// 		updateToolRating({
	// 			toolId,
	// 			averageRating: newAverageRating,
	// 			numberOfRatings: newNumberOfRatings,
	// 		})
	// 	);
	// 	onToolRatingUpdate(toolId, newAverageRating, newNumberOfRatings);
	// };

	return (
		<motion.div
			whileHover={{ y: -8, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}>
			<Card
				className={`group relative overflow-hidden bg-gray-800/90 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 cursor-pointer ${featuredBorderClass} hover:shadow-2xl hover:shadow-blue-500/20`}
				onClick={handleCardClick}>
				{/* Featured Badge */}
				{tool.isFeatured && (
					<div className="absolute top-0 right-0 z-10">
						<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-3 py-1 rounded-bl-lg flex items-center space-x-1">
							<Star className="h-3 w-3 fill-current" />
							<span>Featured</span>
						</div>
					</div>
				)}

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				<CardHeader className="relative pb-4">
					<div className="flex items-start space-x-4">
						{/* Logo */}
						<div className="relative flex-shrink-0">
							<div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700 ring-2 ring-gray-600 group-hover:ring-blue-500/50 transition-all duration-300">
								<img
									src={tool.logoUrl || placeholderUrl}
									alt={`${tool.name} logo`}
									className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
									onError={(e) => {
										e.currentTarget.src = placeholderUrl;
									}}
								/>
							</div>
							{tool.analytics.weeklyViews > 0 && (
								<div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
									<TrendingUp className="h-2.5 w-2.5 mr-0.5" />
									<span className="font-medium">Hot</span>
								</div>
							)}
						</div>

						{/* Title and Description */}
						<div className="flex-1 min-w-0">
							<CardTitle className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
								{tool.name}
							</CardTitle>
							<CardDescription className="text-gray-400 text-sm mt-1 line-clamp-1">
								{tool.tagline}
							</CardDescription>

							{/* Rating */}
							<div className="flex items-center space-x-2 mt-2">
								<StarRating toolId={tool._id} size="sm" />
								<span className="text-xs text-gray-500">
									({tool.numberOfRatings} reviews)
								</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Description */}
					<p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
						{tool.description}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2">
						{tool.tags?.slice(0, 4).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600/50 text-xs px-2 py-1">
								{tag}
							</Badge>
						))}
						{tool.tags && tool.tags.length > 4 && (
							<Badge
								variant="outline"
								className="border-gray-600 text-gray-400 text-xs px-2 py-1">
								+{tool.tags.length - 4} more
							</Badge>
						)}
					</div>

					{/* Stats Row */}
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-1 text-gray-400">
								<Eye className="h-4 w-4" />
								<span>{tool.analytics.totalViews.toLocaleString()}</span>
								<span className="hidden sm:inline">Views</span>
							</div>
							<div className="flex items-center space-x-1 text-gray-400">
								<MessageSquare className="h-4 w-4" />
								<span>{tool.commentStats.totalComments}</span>
								<span className="hidden sm:inline">Comments</span>
							</div>
						</div>
						{tool.analytics.weeklyViews > 0 && (
							<div className="flex items-center space-x-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
								<TrendingUp className="h-3 w-3" />
								<span className="text-xs font-medium">
									+{tool.analytics.weeklyViews} Weekly
								</span>
							</div>
						)}
					</div>

					{/* Key Features */}
					{tool.visual?.content && tool.visual.content.length > 0 && (
						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-gray-300 flex items-center">
								<Zap className="h-4 w-4 mr-1 text-blue-400" />
								Key Features
							</h4>
							<div className="space-y-1">
								{tool.visual.content.slice(0, 3).map((item, index) => (
									<div
										key={index}
										className="flex items-center space-x-2 text-xs text-gray-400">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
										<span className="line-clamp-1">{item.text}</span>
									</div>
								))}
								{tool.visual.content.length > 3 && (
									<div className="text-xs text-gray-500 pl-3.5">
										+{tool.visual.content.length - 3} more features
									</div>
								)}
							</div>
						</div>
					)}

					{/* Action Button */}
					<Button
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
						onClick={(e) => {
							e.stopPropagation();
							handleCardClick();
						}}>
						<span>View Full Details</span>
						<ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default ToolCard;

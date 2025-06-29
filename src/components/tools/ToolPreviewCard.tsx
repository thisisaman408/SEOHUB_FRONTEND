import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Tool } from '@/lib/types';
// import { useAppDispatch } from '@/store/hooks';
// import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	BarChart,
	Eye,
	MessageSquare,
	Star,
	TrendingUp,
	Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HoverPreviewCardProps {
	tool: Tool;
	onClick: () => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

export function HoverPreviewCard({
	tool,
	onClick,
}: // onToolRatingUpdate,
HoverPreviewCardProps) {
	// const dispatch = useAppDispatch();
	const navigate = useNavigate();

	// const handleToolRatingUpdate = (
	// 	toolId: string,
	// 	newAverageRating: number,
	// 	newNumberOfRatings: number
	// ) => {
	// 	// dispatch(
	// 	// 	updateToolRating({
	// 	// 		toolId,
	// 	// 		averageRating: newAverageRating,
	// 	// 		numberOfRatings: newNumberOfRatings,
	// 	// 	})
	// 	// );
	// 	onToolRatingUpdate(toolId, newAverageRating, newNumberOfRatings);
	// };

	const handleClick = () => {
		navigate(`/tool/${tool.slug || tool._id}`);
		onClick();
	};

	const placeholderUrl = `https://placehold.co/64x64/374151/9CA3AF?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;
	const featuredBorderClass = tool.isFeatured
		? `border-2 border-blue-500/50 shadow-lg shadow-blue-500/30`
		: 'border border-gray-700/50';

	return (
		<motion.div
			className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-50 w-80"
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 10, scale: 0.95 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}>
			{/* Small arrow pointing down to the original card */}
			<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
				<div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-800/95"></div>
			</div>

			<div
				className={`bg-gray-800/95 backdrop-blur-xl rounded-xl p-6 shadow-2xl ${featuredBorderClass} hover:shadow-blue-500/20 transition-shadow duration-300`}>
				{/* Header */}
				<div className="flex items-start space-x-4 mb-4">
					<div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700 ring-2 ring-gray-600 flex-shrink-0">
						<img
							src={tool.logoUrl || placeholderUrl}
							alt={`${tool.name} logo`}
							className="h-full w-full object-cover"
							onError={(e) => {
								e.currentTarget.src = placeholderUrl;
							}}
						/>
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
							{tool.name}
						</h3>
						<p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
							{tool.tagline}
						</p>
						{tool.isFeatured && (
							<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-2 py-1 mt-2 flex items-center space-x-1 w-fit">
								<Star className="h-3 w-3 fill-current" />
								<span>Featured</span>
							</Badge>
						)}
					</div>
				</div>
				<div className="mb-4">
					<StarRating toolId={tool._id} size="sm" />
				</div>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div className="text-center p-3 bg-gray-700/50 rounded-lg">
						<div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
							<Eye className="h-4 w-4" />
							<span className="text-xs font-medium">Total Views</span>
						</div>
						<div className="text-xl font-bold text-white">
							{tool.analytics.totalViews.toLocaleString()}
						</div>
					</div>
					<div className="text-center p-3 bg-gray-700/50 rounded-lg">
						<div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
							<MessageSquare className="h-4 w-4" />
							<span className="text-xs font-medium">Comments</span>
						</div>
						<div className="text-xl font-bold text-white">
							{tool.commentStats.totalComments}
						</div>
					</div>
				</div>

				{/* Weekly Views Indicator */}
				{tool.analytics.weeklyViews > 0 && (
					<div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
						<div className="flex items-center space-x-2 text-green-400">
							<TrendingUp className="h-4 w-4" />
							<span className="text-sm font-medium">
								+{tool.analytics.weeklyViews} Weekly Views
							</span>
							<Badge
								variant="outline"
								className="border-green-500/30 text-green-400 text-xs">
								Trending
							</Badge>
						</div>
					</div>
				)}

				{/* Key Features */}
				{tool.visual?.content && tool.visual.content.length > 0 && (
					<div className="mb-4">
						<h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
							<Zap className="h-4 w-4 mr-1 text-blue-400" />
							Key Features:
						</h4>
						<div className="space-y-2">
							{tool.visual.content.slice(0, 2).map((item, index) => (
								<div key={index} className="flex items-start space-x-2 text-sm">
									{item.icon === 'zap' ? (
										<Zap className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
									) : (
										<BarChart className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
									)}
									<span className="text-gray-300 line-clamp-2">
										{item.text}
									</span>
								</div>
							))}
							{tool.visual.content.length > 2 && (
								<div className="text-xs text-gray-500 pl-6">
									+{tool.visual.content.length - 2} more features
								</div>
							)}
						</div>
					</div>
				)}

				{/* Action Button */}
				<Button
					onClick={handleClick}
					className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
					<span>View Details</span>
					<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
				</Button>
			</div>
		</motion.div>
	);
}

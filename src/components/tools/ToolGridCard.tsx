import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GridToolCardProps {
	tool: Tool;
	onCardClick: () => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

export function GridToolCard({
	tool,
	onCardClick,
}: // onToolRatingUpdate,
GridToolCardProps) {
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

	const handleCardClick = () => {
		navigate(`/tool/${tool.slug || tool._id}`);
		onCardClick();
	};

	const placeholderUrl = `https://placehold.co/64x64/374151/9CA3AF?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;
	const featuredBorderClass = tool.isFeatured
		? `border-2 border-blue-500/50 shadow-lg shadow-blue-500/20`
		: 'border border-gray-700/50';

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}>
			<Card
				className={`group relative h-full overflow-hidden bg-gray-800/90 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 cursor-pointer ${featuredBorderClass} hover:shadow-xl hover:shadow-blue-500/10`}
				onClick={handleCardClick}>
				{tool.isFeatured && (
					<div className="absolute top-3 right-3 z-10">
						<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-2 py-1 flex items-center space-x-1">
							<Star className="h-3 w-3 fill-current" />
							<span>Featured</span>
						</Badge>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				<div className="relative h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-4">
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
						<div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
							<TrendingUp className="h-2.5 w-2.5" />
							<span className="font-medium">Hot</span>
						</div>
					)}
				</div>

				<CardContent className="p-4 space-y-3 flex-1 flex flex-col">
					<div className="space-y-2">
						<CardTitle className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
							{tool.name}
						</CardTitle>
						<CardDescription className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
							{tool.tagline}
						</CardDescription>
					</div>

					<div className="flex flex-wrap gap-1">
						{tool.tags?.slice(0, 2).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600/50 text-xs px-2 py-0.5">
								{tag}
							</Badge>
						))}
						{tool.tags && tool.tags.length > 2 && (
							<Badge
								variant="outline"
								className="border-gray-600 text-gray-400 text-xs px-2 py-0.5">
								+{tool.tags.length - 2}
							</Badge>
						)}
					</div>
					<div className="flex items-center justify-between text-xs text-gray-400">
						<div className="flex items-center space-x-3">
							<div className="flex items-center space-x-1">
								<Eye className="h-3 w-3" />
								<span>{tool.analytics.totalViews.toLocaleString()}</span>
							</div>
							<div className="flex items-center space-x-1">
								<MessageSquare className="h-3 w-3" />
								<span>{tool.commentStats.totalComments}</span>
							</div>
						</div>
						{tool.analytics.weeklyViews > 0 && (
							<div className="flex items-center space-x-1 text-green-400">
								<TrendingUp className="h-3 w-3" />
								<span>+{tool.analytics.weeklyViews}</span>
							</div>
						)}
					</div>

					<div className="mt-auto space-y-3">
						<StarRating toolId={tool._id} size="sm" />

						<Button
							size="sm"
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105"
							onClick={(e) => {
								e.stopPropagation();
								handleCardClick();
							}}>
							<span>View Details</span>
							<ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

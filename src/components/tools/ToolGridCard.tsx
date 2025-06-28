// src/components/tools/ToolGridCard.tsx
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from '@/components/ui/card';
import { type Tool, colorMap } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import { Eye, MessageSquare, TrendingUp } from 'lucide-react';
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
	onToolRatingUpdate,
}: GridToolCardProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleToolRatingUpdate = (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => {
		dispatch(
			updateToolRating({
				toolId,
				averageRating: newAverageRating,
				numberOfRatings: newNumberOfRatings,
			})
		);
		onToolRatingUpdate(toolId, newAverageRating, newNumberOfRatings);
	};

	const handleCardClick = () => {
		// ✅ Fixed: Use /tool/ to match your route
		navigate(`/tool/${tool.slug || tool._id}`);
		onCardClick();
	};

	const placeholderUrl = `https://placehold.co/64x64/eee/ccc?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;

	const colors = colorMap[tool.visual?.color || 'default'] || colorMap.default;

	const featuredBorderClass = tool.isFeatured
		? `border-2 ${colors.border} shadow-lg`
		: 'border';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="h-full">
			<Card
				className={`h-[400px] w-full cursor-pointer transition-all duration-200 hover:shadow-lg ${featuredBorderClass} flex flex-col`}
				onClick={handleCardClick}>
				{/* Image Section - Fixed Height */}
				<div className="h-48 bg-muted rounded-t-lg overflow-hidden flex-shrink-0">
					<img
						src={tool.logoUrl || placeholderUrl}
						alt={`${tool.name} logo`}
						className="h-full w-full object-cover"
						onError={(e) => {
							e.currentTarget.src = placeholderUrl;
						}}
					/>
				</div>

				{/* Content Section - Flexible Height */}
				<CardContent className="p-4 flex flex-col justify-between flex-1">
					<div className="space-y-2">
						<div className="flex items-start justify-between">
							<CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
								{tool.name}
							</CardTitle>
							{tool.isFeatured && (
								<Badge
									variant="secondary"
									className="ml-2 flex-shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
									Featured
								</Badge>
							)}
						</div>

						<CardDescription className="text-sm text-muted-foreground line-clamp-2">
							{tool.tagline}
						</CardDescription>
					</div>

					<div className="space-y-3 mt-3">
						{/* Tags */}
						<div className="flex flex-wrap gap-1">
							{tool.tags?.slice(0, 2).map((tag) => (
								<Badge key={tag} variant="outline" className="text-xs">
									{tag}
								</Badge>
							))}
							{tool.tags && tool.tags.length > 2 && (
								<Badge variant="outline" className="text-xs">
									+{tool.tags.length - 2}
								</Badge>
							)}
						</div>

						{/* Stats */}
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Eye className="h-3 w-3" />
								<span>{tool.analytics.totalViews.toLocaleString()}</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageSquare className="h-3 w-3" />
								<span>{tool.commentStats.totalComments}</span>
							</div>
							{tool.analytics.weeklyViews > 0 && (
								<div className="flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									<span>+{tool.analytics.weeklyViews}</span>
								</div>
							)}
						</div>

						{/* Rating and Action */}
						<div className="flex items-center justify-between pt-2 border-t">
							<StarRating
								toolId={tool._id}
								averageRating={tool.averageRating || 0}
								numberOfRatings={tool.numberOfRatings || 0}
								size={14}
								onRatingChange={handleToolRatingUpdate}
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									handleCardClick();
								}}>
								View Details
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

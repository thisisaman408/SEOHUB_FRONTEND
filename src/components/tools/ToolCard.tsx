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
import { type Tool, colorMap } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import { Eye, MessageSquare, TrendingUp } from 'lucide-react';
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
	onToolRatingUpdate,
}: ToolCardProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const placeholderUrl = `https://placehold.co/64x64/eee/ccc?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;

	const colors = colorMap[tool.visual?.color || 'default'] || colorMap.default;

	const featuredBorderClass = tool.isFeatured
		? `border-2 ${colors.border} shadow-xl`
		: 'border';

	const handleCardClick = () => {
		navigate(`/tool/${tool.slug || tool._id}`);
		onCardClick();
	};

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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="h-full">
			<Card
				className={`h-[400px] w-full cursor-pointer transition-all duration-200 hover:shadow-lg ${featuredBorderClass} flex flex-col`}
				onClick={handleCardClick}>
				<CardHeader className="pb-3 flex-shrink-0">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-3">
							<img
								src={tool.logoUrl || placeholderUrl}
								alt={`${tool.name} logo`}
								className="h-12 w-12 rounded-lg object-cover"
								onError={(e) => {
									e.currentTarget.src = placeholderUrl;
								}}
							/>
							<div className="flex-1 min-w-0">
								<CardTitle className="text-lg font-semibold line-clamp-1">
									{tool.name}
								</CardTitle>
								<CardDescription className="text-sm text-muted-foreground line-clamp-1">
									{tool.tagline}
								</CardDescription>
							</div>
						</div>
						{tool.isFeatured && (
							<Badge
								variant="secondary"
								className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
								Featured
							</Badge>
						)}
					</div>
				</CardHeader>

				<CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
					<div className="space-y-3 flex-1">
						<p className="text-sm text-muted-foreground line-clamp-3">
							{tool.description}
						</p>

						<div className="flex flex-wrap gap-1">
							{tool.tags?.slice(0, 4).map((tag) => (
								<Badge key={tag} variant="outline" className="text-xs">
									{tag}
								</Badge>
							))}
							{tool.tags && tool.tags.length > 4 && (
								<Badge variant="outline" className="text-xs">
									+{tool.tags.length - 4} more
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Eye className="h-3 w-3" />
								<span>{tool.analytics.totalViews.toLocaleString()}</span>
								<span>Views</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageSquare className="h-3 w-3" />
								<span>{tool.commentStats.totalComments}</span>
								<span>Comments</span>
							</div>
							{tool.analytics.weeklyViews > 0 && (
								<div className="flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									<span>+{tool.analytics.weeklyViews}</span>
									<span>Weekly</span>
								</div>
							)}
						</div>

						{tool.visual?.content && tool.visual.content.length > 0 && (
							<div className="space-y-2">
								<h4 className="text-xs font-medium text-muted-foreground">
									Key Features
								</h4>
								<div className="space-y-1">
									{tool.visual.content.slice(0, 3).map((item, index) => (
										<div
											key={index}
											className="flex items-center gap-2 text-xs">
											<div className="h-1 w-1 bg-primary rounded-full" />
											<span className="line-clamp-1">{item.text}</span>
										</div>
									))}
									{tool.visual.content.length > 3 && (
										<div className="text-xs text-muted-foreground">
											+{tool.visual.content.length - 3} more features
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					<div className="flex items-center justify-between pt-3 border-t">
						<StarRating
							toolId={tool._id}
							averageRating={tool.averageRating || 0}
							numberOfRatings={tool.numberOfRatings || 0}
							onRatingChange={handleToolRatingUpdate}
						/>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								handleCardClick();
							}}>
							View Full Details
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default ToolCard;

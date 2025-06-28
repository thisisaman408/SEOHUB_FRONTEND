// src/components/tools/ToolPreviewCard.tsx
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Tool, colorMap } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	BarChart,
	Eye,
	MessageSquare,
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
	onToolRatingUpdate,
}: HoverPreviewCardProps) {
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

	const handleClick = () => {
		// ✅ Fixed: Navigate to correct route
		navigate(`/tool/${tool.slug || tool._id}`);
		onClick();
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
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.2 }}
			className="absolute inset-0 z-50 pointer-events-auto">
			<div
				className={`bg-card border rounded-lg shadow-xl p-6 h-full cursor-pointer ${featuredBorderClass}`}
				onClick={handleClick}>
				<div className="flex items-start gap-4 mb-4">
					<img
						src={tool.logoUrl || placeholderUrl}
						alt={`${tool.name} logo`}
						className="w-12 h-12 rounded-lg object-cover"
						onError={(e) => {
							e.currentTarget.src = placeholderUrl;
						}}
					/>
					<div className="flex-1">
						<h3 className="font-semibold text-lg line-clamp-1">{tool.name}</h3>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{tool.tagline}
						</p>
						{tool.isFeatured && (
							<Badge
								variant="secondary"
								className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
								Featured
							</Badge>
						)}
					</div>
				</div>

				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-4 text-xs">
						<div className="text-center">
							<div className="flex items-center justify-center gap-1">
								<Eye className="h-3 w-3" />
								<span>{tool.analytics.totalViews.toLocaleString()}</span>
							</div>
							<span className="text-muted-foreground">Total Views</span>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center gap-1">
								<MessageSquare className="h-3 w-3" />
								<span>{tool.commentStats.totalComments}</span>
							</div>
							<span className="text-muted-foreground">Comments</span>
						</div>
						{tool.analytics.weeklyViews > 0 && (
							<div className="text-center col-span-2">
								<div className="flex items-center justify-center gap-1">
									<TrendingUp className="h-3 w-3" />
									<span>+{tool.analytics.weeklyViews}</span>
								</div>
								<span className="text-muted-foreground">Weekly Views</span>
							</div>
						)}
					</div>

					{tool.visual?.content && tool.visual.content.length > 0 && (
						<div>
							<h4 className="text-sm font-medium mb-2">Key Features:</h4>
							<div className="space-y-1">
								{tool.visual.content.slice(0, 2).map((item, index) => (
									<div key={index} className="flex items-center gap-2 text-xs">
										{item.icon === 'zap' ? (
											<Zap className="h-3 w-3 text-yellow-500" />
										) : (
											<BarChart className="h-3 w-3 text-blue-500" />
										)}
										<span className="line-clamp-1">{item.text}</span>
									</div>
								))}
								{tool.visual.content.length > 2 && (
									<div className="text-xs text-muted-foreground">
										+{tool.visual.content.length - 2} more features
									</div>
								)}
							</div>
						</div>
					)}

					<div className="flex items-center justify-between pt-3 border-t">
						<StarRating
							toolId={tool._id}
							averageRating={tool.averageRating || 0}
							numberOfRatings={tool.numberOfRatings || 0}
							size={14}
							onRatingChange={handleToolRatingUpdate}
						/>
						<Button size="sm" onClick={handleClick}>
							View Details
							<ArrowRight className="ml-2 h-3 w-3" />
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

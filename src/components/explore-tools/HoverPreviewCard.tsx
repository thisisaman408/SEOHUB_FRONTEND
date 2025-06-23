import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Tool, colorMap } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart, Zap } from 'lucide-react';

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
	const placeholderUrl = `https://placehold.co/64x64/eee/ccc?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;

	const colors = colorMap[tool.visual?.color || 'default'] || colorMap.default;
	const featuredBorderClass = tool.isFeatured
		? `border-2 ${colors.border} shadow-lg`
		: 'border';

	return (
		<motion.div
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-80"
			initial={{ opacity: 0, scale: 0.9, y: '-50%' }}
			animate={{ opacity: 1, scale: 1, y: '-50%' }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.15 }}>
			<button
				onClick={onClick}
				className={`w-full h-full text-left p-6 space-y-4 rounded-xl ${featuredBorderClass} shadow-2xl!important cursor-pointer bg-background/80 backdrop-blur-sm`}>
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 flex-shrink-0">
						<img
							src={tool.logoUrl || placeholderUrl}
							alt={`${tool.name} logo`}
							className="w-full h-full object-cover rounded-lg border"
							onError={(e) => {
								e.currentTarget.src = placeholderUrl;
							}}
						/>
					</div>
					<div className="flex-grow">
						<h3 className="font-bold text-lg">{tool.name}</h3>
						<p className="text-sm text-muted-foreground">{tool.tagline}</p>
					</div>
				</div>
				{tool.isFeatured && (
					<Badge
						variant="secondary"
						className={`whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border} mt-2`}>
						Featured
					</Badge>
				)}
				<div className="pt-2">
					<StarRating
						toolId={tool._id}
						averageRating={tool.averageRating}
						numberOfRatings={tool.numberOfRatings}
						size={16}
						allowInput={true}
						onRatingChange={(avg, num) =>
							onToolRatingUpdate(tool._id, avg, num)
						}
					/>
				</div>
				{tool.visual?.content && (
					<div className="flex flex-wrap gap-2 pt-1">
						{tool.visual.content.map((item, index) => (
							<div
								key={index}
								className="flex items-center gap-1.5 text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
								{item.icon === 'zap' ? (
									<Zap className="h-3 w-3 text-yellow-500" />
								) : (
									<BarChart className="h-3 w-3 text-blue-500" />
								)}
								<span>{item.text}</span>
							</div>
						))}
					</div>
				)}
				<Button className="w-full mt-2" variant="outline">
					View Details <ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</button>
		</motion.div>
	);
}

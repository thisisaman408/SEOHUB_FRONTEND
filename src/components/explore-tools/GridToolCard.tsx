import { StarRating } from '@/components/StarRating';
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
import { easeOut, motion } from 'framer-motion';

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
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
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
			variants={cardVariants}
			className="cursor-pointer h-full"
			onClick={onCardClick}>
			<Card
				className={`h-full flex flex-col bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300 ${featuredBorderClass}`}>
				<CardHeader>
					<div className="w-16 h-16 mb-4">
						<img
							src={tool.logoUrl || placeholderUrl}
							alt={`${tool.name} logo`}
							className="w-full h-full object-cover rounded-lg border"
							onError={(e) => {
								e.currentTarget.src = placeholderUrl;
							}}
						/>
					</div>
					<div className="flex justify-between items-center w-full">
						{' '}
						<CardTitle className="text-xl font-bold flex-grow">
							{tool.name}
						</CardTitle>{' '}
						{tool.isFeatured && (
							<Badge
								variant="secondary"
								className={`ml-2 whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border}`}>
								Featured
							</Badge>
						)}
					</div>
					<CardDescription>{tool.tagline}</CardDescription>
					<div className="pt-2">
						<StarRating
							toolId={tool._id}
							averageRating={tool.averageRating}
							numberOfRatings={tool.numberOfRatings}
							size={16}
							allowInput={false}
							onRatingChange={(avg, num) =>
								onToolRatingUpdate(tool._id, avg, num)
							}
						/>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col flex-grow">
					<div className="flex flex-wrap gap-2 mb-4">
						{tool.tags?.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					<Button variant="secondary" className="w-full mt-auto">
						View Details
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}

import { GridToolCard } from '@/components/explore-tools/GridToolCard';
import { type Tool } from '@/lib/types';
interface FeaturedToolsGridProps {
	tools: Tool[];
	onCardClick: (tool: Tool) => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}
export function FeaturedToolsGrid({
	tools,
	onCardClick,
	onToolRatingUpdate,
}: FeaturedToolsGridProps) {
	const toolsToDisplay = tools;

	if (toolsToDisplay.length === 0) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 md:px-6 mb-16 ">
			<div className="mb-8 border-b pb-4">
				<h3 className="text-2xl font-bold tracking-tight text-foreground">
					Featured Tools (from `components/search-results/Featured.tsx`)
				</h3>
				<p className="text-muted-foreground">
					Hand-picked selections from our experts.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{toolsToDisplay.map((tool) => (
					<GridToolCard
						key={tool._id}
						tool={tool}
						onCardClick={() => onCardClick(tool)}
						onToolRatingUpdate={onToolRatingUpdate}
					/>
				))}
			</div>
		</div>
	);
}

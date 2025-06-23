import { GridToolCard } from '@/components/explore-tools/GridToolCard';
import { Button } from '@/components/ui/button';
import { type Tool } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { HoverPreviewCard } from '../explore-tools/HoverPreviewCard';
interface SearchResultsProps {
	searchTerm: string;
	results: Tool[];
	onClearSearch: () => void;
	onCardClick: (tool: Tool) => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function SearchResults({
	searchTerm,
	results,
	onClearSearch,
	onCardClick,
	onToolRatingUpdate,
}: SearchResultsProps) {
	const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);
	return (
		<section className="bg-background -mt-40">
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center max-w-3xl mx-auto mt-12 mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Search Results for "{searchTerm}"
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						{results.length > 0
							? `Found ${results.length} tool(s) matching your query.`
							: 'No tools found matching your query. Try a different search.'}
					</p>
					<Button variant="link" onClick={onClearSearch} className="mt-4">
						Clear Search & View All Tools
					</Button>
				</div>
				{results.length > 0 && (
					<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{results.map((tool) => (
							<motion.div
								key={tool._id}
								className="relative"
								variants={cardVariants}
								onHoverStart={() => setHoveredToolId(tool._id)}
								onHoverEnd={() => setHoveredToolId(null)}>
								<GridToolCard
									tool={tool}
									onCardClick={() => onCardClick(tool)}
									onToolRatingUpdate={onToolRatingUpdate}
								/>
								<AnimatePresence>
									{hoveredToolId === tool._id && (
										<HoverPreviewCard
											tool={tool}
											onClick={() => onCardClick(tool)}
											onToolRatingUpdate={onToolRatingUpdate}
										/>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</motion.div>
				)}
			</div>
		</section>
	);
}

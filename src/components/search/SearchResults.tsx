// src/components/search/SearchResults.tsx
import { GridToolCard } from '@/components/tools/ToolGridCard';
import { HoverPreviewCard } from '@/components/tools/ToolPreviewCard';
import { Button } from '@/components/ui/button';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSearch, updateToolRating } from '@/store/slice/toolsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function SearchResults() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { searchResults, searchTerm } = useAppSelector((state) => state.tools);
	const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);

	const handleClearSearch = () => {
		dispatch(clearSearch());
	};

	const handleCardClick = (tool: Tool) => {
		navigate(`/tools/${tool.slug || tool._id}`);
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
	};

	const cleanSearchTerm = (term: string): string => {
		return term
			.trim()
			.replace(/\s+/g, ' ')
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const displaySearchTerm = cleanSearchTerm(searchTerm);

	if (!searchTerm) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold">
					Search Results for "{displaySearchTerm}"
				</h2>
				<p className="text-muted-foreground">
					{searchResults.length > 0
						? `Found ${searchResults.length} tool(s) matching your query.`
						: 'No tools found matching your query. Try a different search.'}
				</p>
				<Button variant="outline" onClick={handleClearSearch}>
					Clear Search & View All Tools
				</Button>
			</div>

			{searchResults.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{searchResults.map((tool) => (
						<motion.div
							key={tool._id}
							variants={cardVariants}
							initial="hidden"
							animate="show"
							className="relative"
							onHoverStart={() => setHoveredToolId(tool._id)}
							onHoverEnd={() => setHoveredToolId(null)}>
							<GridToolCard
								tool={tool}
								onCardClick={() => handleCardClick(tool)}
								onToolRatingUpdate={handleToolRatingUpdate}
							/>

							<AnimatePresence>
								{hoveredToolId === tool._id && (
									<HoverPreviewCard
										tool={tool}
										onClick={() => handleCardClick(tool)}
										onToolRatingUpdate={handleToolRatingUpdate}
									/>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}

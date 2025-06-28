// src/components/tools/ToolGrid.tsx
import { GridToolCard } from '@/components/tools/ToolGridCard';
import { HoverPreviewCard } from '@/components/tools/ToolPreviewCard';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ExploreToolsGrid() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { allTools } = useAppSelector((state) => state.tools);
	const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);

	const handleCardClick = (tool: Tool) => {
		// ✅ Fixed: Use /tool/ to match your route
		navigate(`/tool/${tool.slug || tool._id}`);
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

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold">Explore All Tools</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Browse our full collection of AI-powered tools. Click to see the
					details.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{allTools.map((tool) => (
					<motion.div
						key={tool._id}
						variants={cardVariants}
						initial="hidden"
						animate="show"
						className="relative"
						// ✅ Only enable hover on desktop (hidden on mobile/tablet)
						onMouseEnter={() => {
							// Only set hover on devices that support hover (desktop)
							if (window.matchMedia('(hover: hover)').matches) {
								setHoveredToolId(tool._id);
							}
						}}
						onMouseLeave={() => setHoveredToolId(null)}>
						<GridToolCard
							tool={tool}
							onCardClick={() => handleCardClick(tool)}
							onToolRatingUpdate={handleToolRatingUpdate}
						/>

						{/* ✅ Only show hover preview on desktop */}
						<AnimatePresence>
							{hoveredToolId === tool._id &&
								window.matchMedia('(hover: hover)').matches && (
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
		</div>
	);
}

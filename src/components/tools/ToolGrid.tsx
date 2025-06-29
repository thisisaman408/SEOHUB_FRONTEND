// src/components/tools/ToolGrid.tsx

import { GridToolCard } from '@/components/tools/ToolGridCard';
import { HoverPreviewCard } from '@/components/tools/ToolPreviewCard';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Grid3X3, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ExploreToolsGrid() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { allTools } = useAppSelector((state) => state.tools);
	const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);

	const handleCardClick = (tool: Tool) => {
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
		<section className="py-16 bg-gray-900" id="tools-section">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-4">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
								<Grid3X3 className="h-6 w-6 text-white" />
							</div>
						</div>
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
							Explore All Tools
						</h2>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
							Browse our full collection of AI-powered SEO tools.
							<span className="block sm:inline">
								{' '}
								Click to see the details and boost your rankings.
							</span>
						</p>

						{/* Stats */}
						<div className="flex flex-wrap items-center justify-center gap-6 mt-8">
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
								<span className="text-gray-300 text-sm font-medium">
									{allTools.length}+ Tools Available
								</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<Search className="h-3 w-3 text-blue-400" />
								<span className="text-gray-300 text-sm font-medium">
									AI-Powered Discovery
								</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<Filter className="h-3 w-3 text-purple-400" />
								<span className="text-gray-300 text-sm font-medium">
									Smart Filtering
								</span>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Tools Grid */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
					initial="hidden"
					animate="show"
					variants={{
						show: {
							transition: {
								staggerChildren: 0.1,
							},
						},
					}}>
					{allTools.map((tool, index) => (
						<motion.div
							key={tool._id}
							variants={cardVariants}
							transition={{ duration: 0.5, delay: index * 0.05 }}
							className="relative"
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

							{/* Hover Preview - Only on Desktop */}
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
				</motion.div>

				{/* Empty State */}
				{allTools.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-16">
						<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
							<Search className="h-12 w-12 text-gray-500" />
						</div>
						<h3 className="text-2xl font-bold text-gray-400 mb-2">
							No tools found
						</h3>
						<p className="text-gray-500">
							Try adjusting your search or filters
						</p>
					</motion.div>
				)}
			</div>
		</section>
	);
}

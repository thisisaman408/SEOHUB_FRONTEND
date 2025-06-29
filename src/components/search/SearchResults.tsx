// src/components/search/SearchResults.tsx

import { GridToolCard } from '@/components/tools/ToolGridCard';
import { HoverPreviewCard } from '@/components/tools/ToolPreviewCard';
import { Button } from '@/components/ui/button';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSearch, updateToolRating } from '@/store/slice/toolsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Filter, Search, TrendingUp, X } from 'lucide-react';
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
		<section className="py-16 bg-gray-900" id="search-results">
			<div className="container mx-auto px-4">
				{/* Search Results Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					{/* Header Icon */}
					<div className="flex items-center justify-center space-x-2 mb-6">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<Search className="h-6 w-6 text-white" />
						</div>
					</div>

					{/* Search Title */}
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
						Search Results for{' '}
						<span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
							"{displaySearchTerm}"
						</span>
					</h2>

					{/* Search Stats */}
					<div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6">
						<p className="text-xl text-gray-400">
							{searchResults.length > 0
								? `Found ${searchResults.length} tool${
										searchResults.length === 1 ? '' : 's'
								  } matching your query.`
								: 'No tools found matching your query. Try a different search.'}
						</p>
						{searchResults.length > 0 && (
							<div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
								<TrendingUp className="h-4 w-4 text-green-400" />
								<span className="text-sm text-green-400 font-medium">
									{searchResults.length} Results
								</span>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button
							onClick={handleClearSearch}
							variant="outline"
							className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-medium px-6 py-2 rounded-lg">
							<X className="mr-2 h-4 w-4" />
							Clear Search & View All Tools
						</Button>

						{searchResults.length > 0 && (
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<Filter className="h-4 w-4 text-gray-400" />
								<span className="text-gray-400 text-sm">
									Smart AI matching enabled
								</span>
							</div>
						)}
					</div>
				</motion.div>

				{/* Search Results Grid */}
				{searchResults.length > 0 && (
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
						{searchResults.map((tool, index) => (
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
				)}

				{/* No Results State */}
				{searchResults.length === 0 && (
					<motion.div
						className="text-center py-16"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}>
						<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
							<Search className="h-12 w-12 text-gray-500" />
						</div>
						<h3 className="text-2xl font-bold text-gray-400 mb-4">
							No tools found for "{displaySearchTerm}"
						</h3>
						<p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
							Try using different keywords, checking for typos, or browsing our
							categories to find what you're looking for.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button
								onClick={handleClearSearch}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg">
								<ArrowRight className="mr-2 h-4 w-4" />
								Browse All Tools
							</Button>
							<Button
								variant="outline"
								onClick={() => navigate('/categories')}
								className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
								Browse Categories
							</Button>
						</div>
					</motion.div>
				)}
			</div>
		</section>
	);
}

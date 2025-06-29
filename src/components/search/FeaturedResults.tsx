// src/components/search/FeaturedResults.tsx

import { GridToolCard } from '@/components/tools/ToolGridCard';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import { Award, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FeaturedToolsGrid() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { featuredTools } = useAppSelector((state) => state.tools);

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

	if (featuredTools.length === 0) {
		return null;
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<section className="py-16 bg-gray-900">
			<div className="container mx-auto px-4">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<div className="flex items-center justify-center space-x-2 mb-4">
						<div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
							<Award className="h-6 w-6 text-black" />
						</div>
					</div>
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
						Featured SEO Tools
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
						Hand-picked selections from our experts.
						<span className="block sm:inline">
							{' '}
							Premium tools trusted by thousands of SEO professionals.
						</span>
					</p>

					{/* Feature Indicators */}
					<div className="flex flex-wrap items-center justify-center gap-6 mt-8">
						<div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/20">
							<Star className="h-4 w-4 text-yellow-400 fill-current" />
							<span className="text-gray-300 text-sm font-medium">
								Editor's Choice
							</span>
						</div>
						<div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/20">
							<Sparkles className="h-4 w-4 text-blue-400" />
							<span className="text-gray-300 text-sm font-medium">
								Premium Quality
							</span>
						</div>
						<div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/20">
							<TrendingUp className="h-4 w-4 text-green-400" />
							<span className="text-gray-300 text-sm font-medium">
								Industry Leaders
							</span>
						</div>
					</div>
				</motion.div>

				{/* Featured Tools Grid */}
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
					{featuredTools.map((tool, index) => (
						<motion.div
							key={tool._id}
							variants={cardVariants}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="relative">
							{/* Featured Badge Overlay */}
							<div className="absolute -top-2 -right-2 z-10">
								<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
									<Star className="h-3 w-3 fill-current" />
									<span>Featured</span>
								</div>
							</div>

							{/* Special glow effect for featured tools */}
							<div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

							<div className="relative">
								<GridToolCard
									tool={tool}
									onCardClick={() => handleCardClick(tool)}
									onToolRatingUpdate={handleToolRatingUpdate}
								/>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					className="text-center mt-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}>
					<p className="text-gray-400 text-lg">
						Want to see your tool featured?{' '}
						<span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-semibold">
							Apply for featured status
						</span>
					</p>
				</motion.div>
			</div>
		</section>
	);
}

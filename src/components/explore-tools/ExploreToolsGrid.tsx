import { type Tool } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { GridToolCard } from './GridToolCard';
import { HoverPreviewCard } from './HoverPreviewCard';

interface ExploreToolsGridProps {
	tools: Tool[];
	onCardClick: (tool: Tool) => void;
}

export function ExploreToolsGrid({
	tools,
	onCardClick,
}: ExploreToolsGridProps) {
	const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<section className="bg-secondary/30">
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Explore All Tools
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Browse our full collection of AI-powered tools. Hover for a quick
						look, or click to see the details.
					</p>
				</div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.1 }}
					variants={{
						show: { transition: { staggerChildren: 0.05 } },
					}}>
					{tools.map((tool) => (
						<motion.div
							key={tool._id} // Use MongoDB's _id
							className="relative"
							variants={cardVariants}
							onHoverStart={() => setHoveredToolId(tool._id)}
							onHoverEnd={() => setHoveredToolId(null)}>
							<GridToolCard tool={tool} onCardClick={() => onCardClick(tool)} />
							<AnimatePresence>
								{hoveredToolId === tool._id && (
									<HoverPreviewCard
										tool={tool}
										onClick={() => onCardClick(tool)}
									/>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

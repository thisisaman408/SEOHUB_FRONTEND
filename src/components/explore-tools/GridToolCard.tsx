import { PlaceholderLogo } from '@/components/PlaceholderLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { type Tool } from '@/lib/types';
import { easeOut, motion } from 'framer-motion';

interface GridToolCardProps {
	tool: Tool;
	onCardClick: () => void;
}

export function GridToolCard({ tool, onCardClick }: GridToolCardProps) {
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
	};
	return (
		<motion.div
			variants={cardVariants}
			className="cursor-pointer h-full"
			onClick={onCardClick}>
			<Card className="h-full flex flex-col bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300">
				<CardHeader>
					<PlaceholderLogo name={tool.name} />
					<div className="flex justify-between items-start">
						<CardTitle>{tool.name}</CardTitle>
						{/* Rating is not in the new Tool type, so it's removed for now.
						    You could add it back to your backend model if needed. */}
						{/* <div className="flex items-center gap-1 text-yellow-500">
							<Star className="w-4 h-4 fill-current" />
							<span className="text-sm font-bold text-foreground">
								{tool.rating}
							</span>
						</div> */}
					</div>
					<CardDescription>{tool.tagline}</CardDescription>
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

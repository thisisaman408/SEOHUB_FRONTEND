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

	// Fallback placeholder image URL
	const placeholderUrl = `https://placehold.co/64x64/eee/ccc?text=${tool.name
		.charAt(0)
		.toUpperCase()}`;

	return (
		<motion.div
			variants={cardVariants}
			className="cursor-pointer h-full"
			onClick={onCardClick}>
			<Card className="h-full flex flex-col bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300">
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
					<div className="flex justify-between items-start">
						<CardTitle>{tool.name}</CardTitle>
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

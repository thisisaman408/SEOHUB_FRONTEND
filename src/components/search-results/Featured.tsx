import { GridToolCard } from '@/components/explore-tools/GridToolCard';
import { featuredTools } from '@/data/tools';
import { type Tool } from '@/lib/types';
interface FeaturedToolData {
	title: string;
	headline: string;
	description: string;
	tag: string;
	cta: {
		href: string;
	};
	visual?: {
		color?: string;
		content?: {
			icon?: string;
			text?: string;
		}[];
	};
}
const adaptFeaturedToTool = (featuredTool: FeaturedToolData): Tool => ({
	_id: Math.random().toString(),
	name: featuredTool.title,
	tagline: featuredTool.headline,
	description: featuredTool.description,
	websiteUrl: featuredTool.cta?.href || '#',
	tags: [featuredTool.tag],
	status: 'approved',
	isFeatured: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	visual: featuredTool.visual,
});

interface FeaturedToolsStackProps {
	onCardClick: (tool: Tool) => void;
}
export function FeaturedToolsStack({ onCardClick }: FeaturedToolsStackProps) {
	const adaptedTools: Tool[] = (
		featuredTools as unknown as FeaturedToolData[]
	).map(adaptFeaturedToTool);

	return (
		<div className="container mx-auto px-4 md:px-6 mb-16 ">
			<div className="mb-8 border-b pb-4">
				<h3 className="text-2xl font-bold tracking-tight text-foreground">
					Featured Tools
				</h3>
				<p className="text-muted-foreground">
					Hand-picked selections from our experts.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{adaptedTools.map((tool) => (
					<GridToolCard
						key={tool._id}
						tool={tool}
						onCardClick={() => onCardClick(tool)}
					/>
				))}
			</div>
		</div>
	);
}

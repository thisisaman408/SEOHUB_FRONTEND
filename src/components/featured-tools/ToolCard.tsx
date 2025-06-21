import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type ColorMap, type Tool } from '@/lib/types';
import { ArrowRight, BarChart, Zap } from 'lucide-react';

const colorMap: ColorMap = {
	blue: {
		bg: 'bg-blue-500/20',
		text: 'text-blue-500',
		border: 'border-blue-500',
		icon: 'text-blue-400',
	},
	green: {
		bg: 'bg-green-500/20',
		text: 'text-green-500',
		border: 'border-green-500',
		icon: 'text-green-400',
	},
	purple: {
		bg: 'bg-purple-500/20',
		text: 'text-purple-500',
		border: 'border-purple-500',
		icon: 'text-purple-400',
	},
	orange: {
		bg: 'bg-orange-500/20',
		text: 'text-orange-500',
		border: 'border-orange-500',
		icon: 'text-orange-400',
	},
	default: {
		bg: 'bg-gray-500/20',
		text: 'text-gray-500',
		border: 'border-gray-500',
		icon: 'text-gray-400',
	},
};

interface ToolCardProps {
	tool: Tool;
	onCardClick: () => void;
}

function AIVisualMockup({ visual }: { visual: Tool['visual'] }) {
	const colors = colorMap[visual?.color || 'default'] || colorMap.default;
	return (
		<div className="relative bg-muted/50 rounded-lg h-full w-full p-6 border flex flex-col justify-center gap-4 overflow-hidden">
			<div
				className={`absolute top-1/2 left-1/2 w-1/2 h-1/2 ${colors.bg} blur-3xl -translate-x-1/2 -translate-y-1/2`}
			/>
			<p className="text-sm font-medium text-foreground text-left">
				Generated Insights:
			</p>
			<div className="flex flex-col gap-3">
				{visual?.content?.map((item, i) => (
					<div
						key={i}
						className="bg-background/70 backdrop-blur-sm border rounded-md p-3 flex items-center gap-3 text-left">
						{item.icon === 'zap' ? (
							<Zap className={`h-5 w-5 ${colors.icon}`} />
						) : (
							<BarChart className={`h-5 w-5 ${colors.icon}`} />
						)}
						<span className="text-sm text-foreground">{item.text}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function ToolCard({ tool, onCardClick }: ToolCardProps) {
	const colors = colorMap[tool.visual?.color || 'default'] || colorMap.default;

	return (
		<Card
			className="w-full max-w-5xl mx-auto cursor-pointer"
			onClick={onCardClick}>
			<CardContent className="grid h-full grid-cols-1 md:grid-cols-2 p-8 gap-8 items-center">
				<div className="flex flex-col gap-4 text-left">
					<Badge
						variant="outline"
						className={`w-fit ${colors.text} ${colors.border}`}>
						{tool.tags?.[0] || 'General'}
					</Badge>
					<h3 className="text-3xl font-bold text-foreground">{tool.name}</h3>
					<h4 className="text-xl font-semibold text-muted-foreground">
						{tool.tagline}
					</h4>
					<p className="text-base text-muted-foreground">{tool.description}</p>
					<Button
						className="w-fit mt-4"
						onClick={(e) => {
							e.stopPropagation();
							window.open(tool.websiteUrl, '_blank');
						}}>
						Visit Tool <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
				<div className="hidden md:block h-full min-h-[300px]">
					{tool.visual && <AIVisualMockup visual={tool.visual} />}
				</div>
			</CardContent>
		</Card>
	);
}

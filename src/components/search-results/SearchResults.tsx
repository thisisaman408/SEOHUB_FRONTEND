import { GridToolCard } from '@/components/explore-tools/GridToolCard';
import { Button } from '@/components/ui/button';
import { type Tool } from '@/lib/types';

interface SearchResultsProps {
	searchTerm: string;
	results: Tool[];
	onClearSearch: () => void;
	onCardClick: (tool: Tool) => void;
}

export function SearchResults({
	searchTerm,
	results,
	onClearSearch,
	onCardClick,
}: SearchResultsProps) {
	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center max-w-3xl mx-auto mt-12 mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Search Results for "{searchTerm}"
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						{results.length > 0
							? `Found ${results.length} tool(s) matching your query.`
							: 'No tools found matching your query. Try a different search.'}
					</p>
					<Button variant="link" onClick={onClearSearch} className="mt-4">
						Clear Search & View All Tools
					</Button>
				</div>
				{/* The featured stack was removed from here as it should not appear with search results */}
				{results.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{results.map((tool) => (
							<GridToolCard
								key={tool._id} // Use MongoDB's _id
								tool={tool}
								onCardClick={() => onCardClick(tool)}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

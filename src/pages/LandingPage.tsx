import { ExploreToolsGrid } from '@/components/explore-tools/ExploreToolsGrid';
import { FeaturedToolsStack } from '@/components/featured-tools/FeaturedToolStack';
import { Hero } from '@/components/hero/index';
import { SearchResults } from '@/components/search-results/SearchResults';
import { TrustSignals } from '@/components/TrustSignals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { getAllTools, getFeaturedTools } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { ArrowRight, BarChart, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LandingPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [allTools, setAllTools] = useState<Tool[]>([]);
	const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
	const [searchResults, setSearchResults] = useState<Tool[]>([]);
	const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllData = async () => {
			setIsLoading(true);
			try {
				const [toolsData, featuredData] = await Promise.all([
					getAllTools(),
					getFeaturedTools(),
				]);
				setAllTools(toolsData);
				setFeaturedTools(featuredData);
			} catch (error) {
				console.error('Failed to fetch tools:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchAllData();
	}, []);

	useEffect(() => {
		if (searchTerm.trim() !== '' && allTools.length > 0) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase();
			const results = allTools.filter(
				(tool) =>
					tool.name.toLowerCase().includes(lowerCaseSearchTerm) ||
					tool.tagline.toLowerCase().includes(lowerCaseSearchTerm) ||
					tool.description.toLowerCase().includes(lowerCaseSearchTerm) ||
					tool.tags.some((tag) =>
						tag.toLowerCase().includes(lowerCaseSearchTerm)
					)
			);
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	}, [searchTerm, allTools]);

	const clearSearch = () => {
		setSearchTerm('');
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-xl animate-pulse">Loading the Future of SEO...</p>
			</div>
		);
	}

	return (
		<>
			<Hero
				searchTerm={searchTerm}
				onSearchTermChange={setSearchTerm}
				onSearchSubmit={(e) => e.preventDefault()}
			/>
			{searchTerm.trim() !== '' ? (
				<div className="mt-[-50px] md:mt-[-100px]">
					<SearchResults
						searchTerm={searchTerm}
						results={searchResults}
						onClearSearch={clearSearch}
						onCardClick={setSelectedTool}
					/>
				</div>
			) : (
				<>
					<TrustSignals />
					<FeaturedToolsStack
						tools={featuredTools}
						onCardClick={setSelectedTool}
					/>
					<ExploreToolsGrid tools={allTools} onCardClick={setSelectedTool} />
				</>
			)}
			<Dialog
				open={!!selectedTool}
				onOpenChange={(isOpen) => !isOpen && setSelectedTool(null)}>
				<DialogContent className="sm:max-w-[650px]">
					{selectedTool && (
						<>
							<DialogHeader>
								<div className="flex items-start gap-4 mb-4">
									{/* --- THIS IS THE CORRECTED LOGIC --- */}
									<div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center">
										{selectedTool.logoUrl ? (
											<img
												src={selectedTool.logoUrl}
												alt={`${selectedTool.name} logo`}
												className="w-full h-full object-cover rounded-lg border"
											/>
										) : (
											// Fallback to the PlaceholderLogo component
											<span className="text-4xl font-bold text-muted-foreground">
												{selectedTool.name.charAt(0).toUpperCase()}
											</span>
										)}
									</div>
									<div className="pt-2">
										<DialogTitle className="text-2xl">
											{selectedTool.name}
										</DialogTitle>
										<DialogDescription>
											{selectedTool.tagline}
										</DialogDescription>
									</div>
								</div>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<p className="text-sm text-muted-foreground">
									{selectedTool.description}
								</p>
								<div className="flex flex-wrap gap-2">
									{selectedTool.tags?.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
								{selectedTool.visual?.content && (
									<div className="mt-2">
										<h4 className="font-semibold mb-2">Key AI Features:</h4>
										<ul className="space-y-2">
											{selectedTool.visual.content.map((item, index) => (
												<li
													key={index}
													className="flex items-center gap-2 text-sm">
													{item.icon === 'zap' ? (
														<Zap className="h-4 w-4 text-yellow-500" />
													) : (
														<BarChart className="h-4 w-4 text-blue-500" />
													)}
													<span>{item.text}</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
							<Button
								size="lg"
								className="w-full mt-4"
								onClick={() => window.open(selectedTool.websiteUrl, '_blank')}>
								Visit Website <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

import { ExploreToolsGrid } from '@/components/explore-tools/ExploreToolsGrid';
// import { FeaturedToolsStack } from '@/components/featured-tools/FeaturedToolStack';
import { Hero } from '@/components/hero/index';
import { SearchResults } from '@/components/search-results/SearchResults';
import { StarRating } from '@/components/StarRating';
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
import { getAllTools } from '@/lib/api';
import { type Tool, colorMap } from '@/lib/types';
import { ArrowRight, BarChart, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LandingPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [allTools, setAllTools] = useState<Tool[]>([]);
	// const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
	const [searchResults, setSearchResults] = useState<Tool[]>([]);
	const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllData = async () => {
			setIsLoading(true);
			try {
				const toolsData = await getAllTools();
				setAllTools(toolsData);

				// const featuredData = await getFeaturedTools();
				// setFeaturedTools(featuredData);
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

	const handleToolRatingUpdate = (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => {
		if (selectedTool && selectedTool._id === toolId) {
			setSelectedTool({
				...selectedTool,
				averageRating: newAverageRating,
				numberOfRatings: newNumberOfRatings,
			});
		}

		setAllTools((prevTools) =>
			prevTools.map((tool) =>
				tool._id === toolId
					? {
							...tool,
							averageRating: newAverageRating,
							numberOfRatings: newNumberOfRatings,
					  }
					: tool
			)
		);

		// setFeaturedTools((prevTools) =>
		// 	prevTools.map((tool) =>
		// 		tool._id === toolId
		// 			? {
		// 					...tool,
		// 					averageRating: newAverageRating,
		// 					numberOfRatings: newNumberOfRatings,
		// 			  }
		// 			: tool
		// 	)
		// );

		setSearchResults((prevResults) =>
			prevResults.map((tool) =>
				tool._id === toolId
					? {
							...tool,
							averageRating: newAverageRating,
							numberOfRatings: newNumberOfRatings,
					  }
					: tool
			)
		);
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
						onToolRatingUpdate={handleToolRatingUpdate}
					/>
				</div>
			) : (
				<>
					<TrustSignals />

					{/* <FeaturedToolsStack
						tools={featuredTools}
						onCardClick={setSelectedTool}
						onToolRatingUpdate={handleToolRatingUpdate}
					/> */}

					<ExploreToolsGrid
						tools={allTools}
						onCardClick={setSelectedTool}
						onToolRatingUpdate={handleToolRatingUpdate}
					/>
				</>
			)}
			<Dialog
				open={!!selectedTool}
				onOpenChange={(isOpen) => !isOpen && setSelectedTool(null)}>
				<DialogContent className="sm:max-w-[650px]">
					{selectedTool && (
						<>
							<DialogHeader
								className={`relative flex flex-row items-start gap-4 p-6 rounded-t-lg overflow-hidden ${
									selectedTool.isFeatured
										? colorMap[selectedTool.visual?.color || 'default']?.bg
										: 'bg-background'
								}`}>
								{selectedTool.isFeatured && (
									<Badge
										variant="secondary"
										className={`absolute top-4 right-4 z-20 text-xs py-1 px-2 rounded-full
                                            ${
																							colorMap[
																								selectedTool.visual?.color ||
																									'default'
																							]?.text
																						}
                                            ${
																							colorMap[
																								selectedTool.visual?.color ||
																									'default'
																							]?.border
																						}
                                            ${
																							colorMap[
																								selectedTool.visual?.color ||
																									'default'
																							]?.bg
																						}`}>
										FEATURED
									</Badge>
								)}

								<div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center z-10">
									{selectedTool.logoUrl ? (
										<img
											src={selectedTool.logoUrl}
											alt={`${selectedTool.name} logo`}
											className="w-full h-full object-cover rounded-lg border"
										/>
									) : (
										<span className="text-4xl font-bold text-muted-foreground">
											{selectedTool.name.charAt(0).toUpperCase()}
										</span>
									)}
								</div>
								<div className="pt-2 z-10">
									<DialogTitle
										className={`text-2xl ${
											selectedTool.isFeatured ? 'text-black' : 'text-foreground'
										}`}>
										{selectedTool.name}
									</DialogTitle>
									<DialogDescription
										className={`${
											selectedTool.isFeatured
												? 'text-gray-600/80'
												: 'text-muted-foreground'
										}`}>
										{selectedTool.tagline}
									</DialogDescription>
									<div className="mt-2">
										<StarRating
											toolId={selectedTool._id}
											averageRating={selectedTool.averageRating}
											numberOfRatings={selectedTool.numberOfRatings}
											size={24}
											allowInput={true}
											onRatingChange={(avg, num) =>
												handleToolRatingUpdate(selectedTool._id, avg, num)
											}
										/>
									</div>
								</div>
							</DialogHeader>
							<div className="grid gap-4 py-4 px-6">
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
								className="w-full mt-4 mx-6 mb-6"
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

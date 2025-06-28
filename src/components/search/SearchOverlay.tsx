// src/components/search/SearchOverlay.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';
import { searchToolsWithAI } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { clearSearch, setSearchTerm } from '@/store/slice/toolsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowRight,
	Eye,
	Loader2,
	Search,
	Sparkles,
	Star,
	X,
	Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

// ✅ Properly typed AI search result interface
interface AISearchResult {
	tool: Tool;
	relevanceScore: number;
	aiSummary: string;
	matchedFeatures: string[];
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
	const [aiResults, setAiResults] = useState<AISearchResult[]>([]);
	const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
	const [searchStats, setSearchStats] = useState<{
		total: number;
		time: number;
	}>({
		total: 0,
		time: 0,
	});

	const debouncedSearchTerm = useDebounce(localSearchTerm, 500);
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input when overlay opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	// ✅ Use your existing searchToolsWithAI API with proper types
	useEffect(() => {
		const performAISearch = async () => {
			if (!debouncedSearchTerm.trim() || debouncedSearchTerm.length < 3) {
				setAiResults([]);
				setSearchStats({ total: 0, time: 0 });
				return;
			}

			setIsAiSearching(true);
			const startTime = Date.now();

			try {
				// ✅ Use your existing searchToolsWithAI API
				const searchResponse = await searchToolsWithAI(
					debouncedSearchTerm,
					{
						sortBy: 'popular',
					},
					1,
					12
				);

				// ✅ Properly type the mapping without any
				const aiSearchResults: AISearchResult[] = searchResponse.data.tools.map(
					(tool: Tool): AISearchResult => ({
						tool,
						relevanceScore: tool.relevanceScore || tool.semanticScore || 0.5,
						aiSummary: tool.description,
						matchedFeatures: tool.matchedFields || tool.tags || [],
					})
				);

				setAiResults(aiSearchResults);
				setSearchStats({
					total: aiSearchResults.length,
					time: Date.now() - startTime,
				});

				// Update Redux store for consistency
				dispatch(setSearchTerm(debouncedSearchTerm));
			} catch (error) {
				console.error('AI search failed:', error);
				toast.error('Search temporarily unavailable');
				setAiResults([]);
			} finally {
				setIsAiSearching(false);
			}
		};

		performAISearch();
	}, [debouncedSearchTerm, dispatch]);

	const handleToolClick = (tool: Tool): void => {
		navigate(`/tool/${tool.slug || tool._id}`);
		onClose();
	};

	const handleClearSearch = (): void => {
		setLocalSearchTerm('');
		setAiResults([]);
		setSearchStats({ total: 0, time: 0 });
		dispatch(clearSearch());
	};

	const handleCloseAndViewAll = (): void => {
		if (aiResults.length > 0) {
			// Keep the search results when closing
			navigate('/');
		}
		onClose();
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			onClick={onClose}>
			<div className="flex min-h-screen items-start justify-center p-4 pt-20">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: -20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: -20 }}
					className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
					onClick={(e) => e.stopPropagation()}>
					{/* Search Header */}
					<div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
								<Input
									ref={inputRef}
									value={localSearchTerm}
									onChange={(e) => setLocalSearchTerm(e.target.value)}
									placeholder="Describe what you're looking for... (AI-powered)"
									className="pl-12 pr-12 py-3 text-lg border-2 focus:border-blue-500"
								/>
								{localSearchTerm && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleClearSearch}
										className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>

							<div className="flex items-center gap-2">
								<Badge
									variant="secondary"
									className="bg-blue-100 text-blue-800">
									<Sparkles className="h-3 w-3 mr-1" />
									AI Search
								</Badge>
								<Button variant="ghost" size="sm" onClick={onClose}>
									<X className="h-5 w-5" />
								</Button>
							</div>
						</div>

						{/* Search Stats */}
						{(aiResults.length > 0 || isAiSearching) && (
							<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
								<div className="flex items-center gap-4">
									{isAiSearching ? (
										<div className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span>AI is analyzing your query...</span>
										</div>
									) : (
										<>
											<span>Found {searchStats.total} relevant tools</span>
											<span>•</span>
											<span>Search completed in {searchStats.time}ms</span>
										</>
									)}
								</div>
								{aiResults.length > 6 && (
									<Button
										variant="link"
										size="sm"
										onClick={handleCloseAndViewAll}
										className="p-0 h-auto">
										View all results
										<ArrowRight className="h-3 w-3 ml-1" />
									</Button>
								)}
							</div>
						)}
					</div>

					{/* Search Results */}
					<div className="max-h-[60vh] overflow-y-auto">
						{localSearchTerm.length < 3 && (
							<div className="p-8 text-center">
								<Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<h3 className="text-lg font-semibold mb-2">
									AI-Powered Search
								</h3>
								<p className="text-muted-foreground">
									Type at least 3 characters to start searching with AI
									understanding
								</p>
							</div>
						)}

						{isAiSearching && (
							<div className="p-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{[...Array(4)].map((_, i) => (
										<Card key={i} className="animate-pulse">
											<CardContent className="p-4">
												<div className="h-4 bg-muted rounded mb-2"></div>
												<div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
												<div className="h-3 bg-muted rounded w-1/2"></div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{!isAiSearching &&
							aiResults.length === 0 &&
							localSearchTerm.length >= 3 && (
								<div className="p-8 text-center">
									<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
									<h3 className="text-lg font-semibold mb-2">No tools found</h3>
									<p className="text-muted-foreground mb-4">
										Try rephrasing your search or using different keywords
									</p>
									<Button variant="outline" onClick={handleClearSearch}>
										Clear search
									</Button>
								</div>
							)}

						{!isAiSearching && aiResults.length > 0 && (
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<AnimatePresence>
										{aiResults.slice(0, 6).map((result, index) => (
											<motion.div
												key={result.tool._id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.1 }}>
												<Card
													className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-blue-200"
													onClick={() => handleToolClick(result.tool)}>
													<CardContent className="p-4">
														<div className="flex items-start gap-3">
															<img
																src={
																	result.tool.logoUrl ||
																	`https://placehold.co/48x48/eee/ccc?text=${result.tool.name.charAt(
																		0
																	)}`
																}
																alt={result.tool.name}
																className="w-12 h-12 rounded-lg object-cover"
															/>
															<div className="flex-1 min-w-0">
																<div className="flex items-start justify-between mb-2">
																	<h3 className="font-semibold line-clamp-1">
																		{result.tool.name}
																	</h3>
																	<Badge
																		variant="secondary"
																		className="ml-2 bg-green-100 text-green-800 text-xs">
																		{Math.round(result.relevanceScore * 100)}%
																		match
																	</Badge>
																</div>

																<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
																	{result.aiSummary}
																</p>

																{result.matchedFeatures.length > 0 && (
																	<div className="flex flex-wrap gap-1 mb-3">
																		{result.matchedFeatures
																			.slice(0, 3)
																			.map((feature, idx) => (
																				<Badge
																					key={idx}
																					variant="outline"
																					className="text-xs">
																					{feature}
																				</Badge>
																			))}
																	</div>
																)}

																<div className="flex items-center gap-4 text-xs text-muted-foreground">
																	<div className="flex items-center gap-1">
																		<Star className="h-3 w-3" />
																		<span>
																			{result.tool.averageRating?.toFixed(1) ||
																				'N/A'}
																		</span>
																	</div>
																	<div className="flex items-center gap-1">
																		<Eye className="h-3 w-3" />
																		<span>
																			{result.tool.analytics?.totalViews?.toLocaleString() ||
																				0}
																		</span>
																	</div>
																	{result.tool.isFeatured && (
																		<div className="flex items-center gap-1">
																			<Zap className="h-3 w-3 text-yellow-500" />
																			<span>Featured</span>
																		</div>
																	)}
																</div>
															</div>
														</div>
													</CardContent>
												</Card>
											</motion.div>
										))}
									</AnimatePresence>
								</div>

								{aiResults.length > 6 && (
									<div className="mt-6 text-center">
										<Separator className="mb-4" />
										<Button onClick={handleCloseAndViewAll} size="lg">
											View all {aiResults.length} results
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									</div>
								)}
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

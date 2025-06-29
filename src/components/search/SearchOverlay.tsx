// src/components/search/SearchOverlay.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { searchToolsWithAI } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useAppDispatch } from '@/store/hooks';
import { clearSearch, setSearchTerm } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	Clock,
	Eye,
	Loader2,
	Search,
	Sparkles,
	Star,
	TrendingUp,
	X,
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
	const [localSearchTerm, setLocalSearchTerm] = useState('');
	const [aiResults, setAiResults] = useState<AISearchResult[]>([]);
	const [isAiSearching, setIsAiSearching] = useState(false);
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
			className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}>
			<motion.div
				className="relative max-w-4xl mx-auto mt-20 mb-8 px-4"
				initial={{ opacity: 0, y: -20, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -20, scale: 0.9 }}
				onClick={(e) => e.stopPropagation()}>
				{/* Search Container */}
				<div className="relative">
					{/* Glowing Border Effect */}
					<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 animate-pulse"></div>

					<Card className="relative bg-gray-900/95 backdrop-blur-xl border-gray-700/50 shadow-2xl overflow-hidden">
						{/* Search Header */}
						<div className="p-6 border-b border-gray-700/50">
							<div className="relative">
								{/* Search Icon */}
								<div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
									<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
										<Search className="h-4 w-4 text-white" />
									</div>
								</div>

								{/* Search Input */}
								<Input
									ref={inputRef}
									value={localSearchTerm}
									onChange={(e) => setLocalSearchTerm(e.target.value)}
									placeholder="Describe what you're looking for... (AI-powered)"
									className="pl-16 pr-16 py-4 text-lg bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
								/>

								{/* Clear Button */}
								{localSearchTerm && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleClearSearch}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg">
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>

							{/* AI Indicator */}
							<div className="flex items-center justify-between mt-4">
								<div className="flex items-center space-x-2">
									<div className="flex items-center space-x-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-3 py-1.5 rounded-full border border-blue-500/30">
										<Sparkles className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-medium text-blue-300">
											AI Search
										</span>
									</div>
									<div className="text-sm text-gray-400">
										Powered by advanced semantic understanding
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={onClose}
									className="text-gray-400 hover:text-white hover:bg-gray-700/50">
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Search Stats */}
						{(aiResults.length > 0 || isAiSearching) && (
							<div className="px-6 py-4 bg-gray-800/30 border-b border-gray-700/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										{isAiSearching ? (
											<div className="flex items-center space-x-2 text-blue-400">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="text-sm font-medium">
													AI is analyzing your query...
												</span>
											</div>
										) : (
											<>
												<div className="flex items-center space-x-2 text-green-400">
													<TrendingUp className="h-4 w-4" />
													<span className="text-sm font-medium">
														Found {searchStats.total} relevant tools
													</span>
												</div>
												<div className="flex items-center space-x-2 text-gray-400">
													<Clock className="h-4 w-4" />
													<span className="text-sm">
														Search completed in {searchStats.time}ms
													</span>
												</div>
											</>
										)}
									</div>
									{aiResults.length > 6 && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleCloseAndViewAll}
											className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
											<ArrowRight className="h-4 w-4 mr-2" />
											View all results
										</Button>
									)}
								</div>
							</div>
						)}

						{/* Search Content */}
						<div className="max-h-96 overflow-y-auto">
							{/* Initial State */}
							{localSearchTerm.length < 3 && (
								<div className="p-12 text-center">
									<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
										<Sparkles className="h-10 w-10 text-white" />
									</div>
									<h3 className="text-2xl font-bold text-white mb-2">
										AI-Powered Search
									</h3>
									<p className="text-gray-400 leading-relaxed">
										Type at least 3 characters to start searching with AI
										semantic understanding
									</p>
								</div>
							)}

							{/* Loading State */}
							{isAiSearching && (
								<div className="p-6 space-y-4">
									{[...Array(4)].map((_, i) => (
										<div
											key={i}
											className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
											<div className="flex items-center space-x-4">
												<div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
												<div className="flex-1 space-y-2">
													<div className="h-4 bg-gray-700 rounded w-3/4"></div>
													<div className="h-3 bg-gray-700 rounded w-1/2"></div>
												</div>
												<div className="w-16 h-6 bg-gray-700 rounded"></div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* No Results */}
							{!isAiSearching &&
								aiResults.length === 0 &&
								localSearchTerm.length >= 3 && (
									<div className="p-12 text-center">
										<div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
											<Search className="h-8 w-8 text-gray-500" />
										</div>
										<h3 className="text-xl font-bold text-gray-400 mb-2">
											No tools found
										</h3>
										<p className="text-gray-500 mb-4">
											Try rephrasing your search or using different keywords
										</p>
										<Button
											variant="outline"
											onClick={handleClearSearch}
											className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
											Clear search
										</Button>
									</div>
								)}

							{/* Results */}
							{!isAiSearching && aiResults.length > 0 && (
								<div className="p-6 space-y-4">
									{aiResults.slice(0, 6).map((result, index) => (
										<motion.div
											key={result.tool._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}>
											<Card
												className="bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group"
												onClick={() => handleToolClick(result.tool)}>
												<CardContent className="p-4">
													<div className="flex items-start space-x-4">
														{/* Tool Logo */}
														<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 ring-2 ring-gray-600 group-hover:ring-blue-500/50 transition-all duration-300 flex-shrink-0">
															<img
																src={
																	result.tool.logoUrl ||
																	`https://placehold.co/48x48/374151/9CA3AF?text=${result.tool.name.charAt(
																		0
																	)}`
																}
																alt={result.tool.name}
																className="w-full h-full object-cover"
															/>
														</div>

														{/* Tool Info */}
														<div className="flex-1 min-w-0">
															<div className="flex items-start justify-between mb-2">
																<h3 className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
																	{result.tool.name}
																</h3>
																<Badge
																	variant="secondary"
																	className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs ml-2 flex-shrink-0">
																	{Math.round(result.relevanceScore * 100)}%
																	match
																</Badge>
															</div>

															<p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
																{result.aiSummary}
															</p>

															{/* Matched Features */}
															{result.matchedFeatures.length > 0 && (
																<div className="flex flex-wrap gap-1 mb-3">
																	{result.matchedFeatures
																		.slice(0, 3)
																		.map((feature, idx) => (
																			<Badge
																				key={idx}
																				variant="outline"
																				className="border-gray-600 text-gray-400 text-xs px-2 py-0.5">
																				{feature}
																			</Badge>
																		))}
																</div>
															)}

															{/* Tool Stats */}
															<div className="flex items-center justify-between text-sm">
																<div className="flex items-center space-x-4">
																	<div className="flex items-center space-x-1 text-yellow-400">
																		<Star className="h-3 w-3 fill-current" />
																		<span>
																			{result.tool.averageRating?.toFixed(1) ||
																				'N/A'}
																		</span>
																	</div>
																	<div className="flex items-center space-x-1 text-gray-400">
																		<Eye className="h-3 w-3" />
																		<span>
																			{result.tool.analytics?.totalViews?.toLocaleString() ||
																				0}
																		</span>
																	</div>
																</div>
																{result.tool.isFeatured && (
																	<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">
																		Featured
																	</Badge>
																)}
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}

									{/* View All Button */}
									{aiResults.length > 6 && (
										<div className="pt-4 text-center">
											<Button
												onClick={handleCloseAndViewAll}
												className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg">
												View all {aiResults.length} results
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									)}
								</div>
							)}
						</div>
					</Card>
				</div>
			</motion.div>
		</motion.div>
	);
}

import { Badge } from '@/components/ui/badge';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { getSearchSuggestions } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { performSearch, setSearchTerm } from '@/store/slice/toolsSlice';
import { Brain, Lightbulb, Loader2, Search, Sparkles, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchSuggestion {
	text: string;
	type: 'query' | 'category' | 'tool' | 'intent';
	icon?: React.ReactNode;
	description?: string;
}

interface SearchBarProps {
	placeholder?: string;
	showAiIndicator?: boolean;
}

export function SearchBar({
	placeholder = "Describe what you're looking for...",
	showAiIndicator = true,
}: SearchBarProps) {
	const dispatch = useAppDispatch();
	const { isSearching, searchTerm } = useAppSelector((state) => state.tools);
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const formRef = useRef<HTMLFormElement>(null);

	const handleSearchTermChange = (term: string) => {
		dispatch(setSearchTerm(term));
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			dispatch(performSearch({ searchTerm: searchTerm.trim() }));
		}
	};

	const generateSuggestions = useCallback(async (query: string) => {
		if (!query.trim() || query.length < 2) {
			setSuggestions([]);
			return;
		}

		setIsLoadingSuggestions(true);
		try {
			const apiSuggestions = await getSearchSuggestions(query);
			const smartSuggestions = generateSmartSuggestions(query);
			const allSuggestions: SearchSuggestion[] = [
				...smartSuggestions,
				...apiSuggestions.map((text: string) => ({
					text,
					type: 'query' as const,
					icon: <Search className="h-4 w-4" />,
				})),
			];
			setSuggestions(allSuggestions.slice(0, 8));
		} catch (error) {
			console.error('Failed to get suggestions:', error);
			setSuggestions(generateSmartSuggestions(query));
		} finally {
			setIsLoadingSuggestions(false);
		}
	}, []);

	const generateSmartSuggestions = (query: string): SearchSuggestion[] => {
		const lowerQuery = query.toLowerCase();
		const suggestions: SearchSuggestion[] = [];

		if (
			lowerQuery.includes('help') ||
			lowerQuery.includes('assist') ||
			lowerQuery.includes('how')
		) {
			suggestions.push({
				text: `Tools that help with ${query
					.replace(/help|assist|how/gi, '')
					.trim()}`,
				type: 'intent',
				icon: <Brain className="h-4 w-4" />,
				description: 'AI-suggested based on your intent',
			});
		}

		if (
			lowerQuery.includes('create') ||
			lowerQuery.includes('make') ||
			lowerQuery.includes('build')
		) {
			suggestions.push({
				text: `${query
					.replace(/create|make|build/gi, '')
					.trim()} creation tools`,
				type: 'intent',
				icon: <Lightbulb className="h-4 w-4" />,
				description: 'Content creation tools',
			});
		}

		if (
			lowerQuery.includes('analyze') ||
			lowerQuery.includes('track') ||
			lowerQuery.includes('measure')
		) {
			suggestions.push({
				text: `${query
					.replace(/analyze|track|measure/gi, '')
					.trim()} analytics tools`,
				type: 'intent',
				icon: <Sparkles className="h-4 w-4" />,
				description: 'Analytics and tracking tools',
			});
		}

		const categories = [
			{
				name: 'AI Tools',
				keywords: ['ai', 'artificial', 'intelligence', 'smart', 'automated'],
			},
			{
				name: 'SEO Tools',
				keywords: ['seo', 'search', 'ranking', 'optimization'],
			},
			{
				name: 'Content Tools',
				keywords: ['content', 'writing', 'copy', 'text', 'blog'],
			},
			{
				name: 'Design Tools',
				keywords: ['design', 'ui', 'ux', 'graphic', 'visual'],
			},
			{
				name: 'Analytics Tools',
				keywords: ['analytics', 'data', 'metrics', 'tracking'],
			},
			{
				name: 'Social Media Tools',
				keywords: ['social', 'media', 'marketing', 'promotion'],
			},
		];

		categories.forEach((category) => {
			if (category.keywords.some((keyword) => lowerQuery.includes(keyword))) {
				suggestions.push({
					text: category.name,
					type: 'category',
					icon: <Zap className="h-4 w-4" />,
					description: `Browse ${category.name.toLowerCase()}`,
				});
			}
		});

		if (lowerQuery.includes('best') || lowerQuery.includes('top')) {
			suggestions.push({
				text: `Best ${query.replace(/best|top/gi, '').trim()} tools`,
				type: 'query',
				icon: <Sparkles className="h-4 w-4" />,
				description: 'Highly rated tools',
			});
		}

		return suggestions.slice(0, 4);
	};

	useEffect(() => {
		generateSuggestions(debouncedSearchTerm);
	}, [debouncedSearchTerm, generateSuggestions]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1
				);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSuggestionSelect(suggestions[selectedIndex]);
				} else {
					handleSearchSubmit(e);
				}
				break;
			case 'Escape':
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
		}
	};

	const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
		handleSearchTermChange(suggestion.text);
		setShowSuggestions(false);
		setSelectedIndex(-1);
		if (suggestion.type === 'category' || suggestion.type === 'intent') {
			setTimeout(() => {
				if (formRef.current) {
					formRef.current.dispatchEvent(
						new Event('submit', { bubbles: true, cancelable: true })
					);
				}
			}, 100);
		}
	};

	return (
		<Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
			<PopoverTrigger asChild>
				<form
					ref={formRef}
					onSubmit={handleSearchSubmit}
					className="relative w-full max-w-2xl mx-auto"
					onClick={(e) => e.stopPropagation()}>
					<div className="relative">
						<Input
							type="text"
							placeholder={placeholder}
							value={searchTerm}
							onChange={(e) => {
								handleSearchTermChange(e.target.value);
								setShowSuggestions(true);
							}}
							onKeyDown={handleKeyDown}
							onFocus={() => setShowSuggestions(suggestions.length > 0)}
							className={cn(
								'w-full pl-12 pr-24 py-4 text-lg rounded-full border-2 border-gray-200',
								'focus:border-primary focus:ring-2 focus:ring-primary/20',
								'bg-white/80 backdrop-blur-sm shadow-lg',
								'transition-all duration-200'
							)}
						/>
						<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
							{isSearching ? (
								<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
							) : (
								<Search className="h-5 w-5 text-muted-foreground" />
							)}
						</div>
						{showAiIndicator && (
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
								<Badge variant="secondary" className="text-xs">
									<Brain className="h-3 w-3 mr-1" />
									AI Search
								</Badge>
							</div>
						)}
					</div>
				</form>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandList>
						{suggestions.length === 0 && !isLoadingSuggestions && (
							<CommandEmpty>Type to get AI-powered suggestions</CommandEmpty>
						)}
						{isLoadingSuggestions && (
							<CommandEmpty>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Generating suggestions...
							</CommandEmpty>
						)}
						<CommandGroup>
							{suggestions.map((suggestion, index) => (
								<CommandItem
									key={`${suggestion.text}-${index}`}
									onSelect={() => handleSuggestionSelect(suggestion)}
									className={cn(
										'flex items-center gap-3 px-4 py-3',
										selectedIndex === index && 'bg-accent'
									)}>
									{suggestion.icon}
									<div className="flex-1">
										<div className="font-medium">{suggestion.text}</div>
										{suggestion.description && (
											<div className="text-sm text-muted-foreground">
												{suggestion.description}
											</div>
										)}
									</div>
									<Badge variant="outline" className="text-xs">
										{suggestion.type}
									</Badge>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

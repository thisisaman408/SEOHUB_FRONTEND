// src/pages/marketplace/hooks/useToolMarketplace.ts - Connected to Redux
import { useDebounce } from '@/hooks/use-debounce';
import { type SearchFilters } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    clearSearch as clearSearchAction,
    fetchAllTools,
    performSearch as performSearchAction,
    setSearchTerm as setSearchTermAction,
    updateToolRating,
} from '@/store/slice/toolsSlice';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useToolMarketplace() {
	const dispatch = useAppDispatch();
	
	// Redux state
	const {
		allTools,
		searchResults,
		searchTerm,
		isLoading,
		isSearching,
		searchMeta,
	} = useAppSelector((state) => state.tools);

	// Local state (not in Redux)
	const [filters, setFilters] = useState<SearchFilters>({});
	const [currentPage, setCurrentPage] = useState(1);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const performSearch = useCallback(async (
		query: string,
		searchFilters: SearchFilters = {},
		page: number = 1
	) => {
		try {
			if (!query.trim()) {
				// Load all tools if no search query - fetch from Redux
				await dispatch(fetchAllTools()).unwrap();
				return;
			}

			// Use Redux search action
			const response = await dispatch(
				performSearchAction({
					searchTerm: query,
					filters: searchFilters,
					page,
					limit: 20,
				})
			).unwrap();

			// Show enhanced query info to user
			if (response.searchMeta?.enhancedQuery) {
				const enhanced = response.searchMeta.enhancedQuery;
				if (enhanced.intent !== 'general') {
					toast.success(
						`AI detected intent: ${enhanced.intent.replace('_', ' ')}`,
						{ duration: 3000 }
					);
				}
			}
		} catch (error) {
			console.error('Search error:', error);
			toast.error('Search failed. Please try again.');
		}
	}, [dispatch]);

	// Handle debounced search
	useEffect(() => {
		if (debouncedSearchTerm.trim()) {
			performSearch(debouncedSearchTerm, filters, currentPage);
		} else {
			dispatch(clearSearchAction());
		}
	}, [debouncedSearchTerm, filters, currentPage, performSearch, dispatch]);

	// Load initial data
	useEffect(() => {
		dispatch(fetchAllTools()).catch((error) => {
			console.error('Failed to load tools:', error);
			toast.error('Failed to load tools');
		});
	}, [dispatch]);

	const handleToolRatingUpdate = useCallback((
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => {
		dispatch(
			updateToolRating({
				toolId,
				averageRating: newAverageRating,
				numberOfRatings: newNumberOfRatings,
			})
		);
	}, [dispatch]);

	const clearSearch = useCallback(() => {
		dispatch(setSearchTermAction(''));
		dispatch(clearSearchAction());
		setFilters({});
		setCurrentPage(1);
	}, [dispatch]);

	const updateFilters = useCallback((newFilters: SearchFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
	}, []);

	const setSearchTerm = useCallback((term: string) => {
		dispatch(setSearchTermAction(term));
	}, [dispatch]);

	return {
		searchTerm,
		setSearchTerm,
		allTools,
		searchResults,
		isLoading,
		isSearching,
		searchMeta,
		filters,
		currentPage,
		handleToolRatingUpdate,
		clearSearch,
		updateFilters,
		performSearch,
	};
}

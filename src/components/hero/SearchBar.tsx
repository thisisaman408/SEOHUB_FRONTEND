// src/components/hero/SearchBar.tsx (update the component)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/store/hooks';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { SearchOverlay } from '../search/SearchOverlay';

interface SearchBarProps {
	placeholder?: string;
	showAiIndicator?: boolean;
}

export function SearchBar({
	placeholder = "Describe what you're looking for...",
	showAiIndicator = true,
}: SearchBarProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { searchTerm } = useAppSelector((state) => state.tools);

	return (
		<>
			<div className="relative w-full max-w-2xl mx-auto">
				<div
					className="relative cursor-pointer"
					onClick={() => setIsSearchOpen(true)}>
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
					<Input
						value={searchTerm}
						placeholder={placeholder}
						className="w-full pl-12 pr-24 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 cursor-pointer"
						readOnly
					/>
					{showAiIndicator && (
						<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
							<Button
								size="sm"
								className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
								onClick={(e) => {
									e.stopPropagation();
									setIsSearchOpen(true);
								}}>
								<Sparkles className="h-3 w-3 mr-1" />
								AI Search
							</Button>
						</div>
					)}
				</div>
			</div>

			<SearchOverlay
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>
		</>
	);
}

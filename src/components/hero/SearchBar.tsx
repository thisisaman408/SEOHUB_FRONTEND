import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/store/hooks';
import { Camera, Filter, Mic, Search, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { SearchOverlay } from '../search/SearchOverlay';

interface SearchBarProps {
	placeholder?: string;
	showAiIndicator?: boolean;
}

export function SearchBar({
	placeholder = 'Search 300+ SEO tools, describe your needs...',
	showAiIndicator = true,
}: SearchBarProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { searchTerm } = useAppSelector((state) => state.tools);

	return (
		<>
			<div className="relative w-full">
				{/* Main Search Container - MASSIVE SIZE */}
				<div className="relative group">
					{/* Glowing Border Effect */}
					<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse"></div>

					<div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
						{/* Search Input Area - LARGE */}
						<div className="flex items-center p-4 sm:p-6 lg:p-8">
							{/* Search Icon - LARGE */}
							<div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg ml-2 flex-shrink-0">
								<Search className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
							</div>

							{/* Input Field - MASSIVE */}
							<div className="flex-1 mx-4 sm:mx-6 lg:mx-8">
								<Input
									placeholder={placeholder}
									value={searchTerm}
									onClick={() => setIsSearchOpen(true)}
									className="border-0 bg-transparent text-xl sm:text-2xl lg:text-3xl placeholder:text-gray-500 focus:ring-0 focus:outline-none p-0 h-auto font-medium text-white"
									readOnly
								/>
								{showAiIndicator && (
									<div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
										<div className="flex items-center space-x-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-3 py-2 rounded-full border border-blue-500/30">
											<Sparkles className="h-4 w-4 text-blue-400" />
											<span className="text-sm font-medium text-blue-300">
												AI-Powered Search
											</span>
										</div>
										<div className="flex items-center space-x-4">
											<div className="text-sm text-gray-400">
												Press{' '}
												<kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
													/
												</kbd>{' '}
												to search
											</div>
											<div className="flex items-center space-x-1">
												<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
												<span className="text-sm text-gray-400">
													300+ tools available
												</span>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Action Buttons - LARGE */}
							<div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
								<Button
									variant="ghost"
									size="lg"
									className="p-3 sm:p-4 h-12 w-12 sm:h-14 sm:w-14 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all duration-200">
									<Mic className="h-5 w-5 sm:h-6 sm:w-6" />
								</Button>
								<Button
									variant="ghost"
									size="lg"
									className="p-3 sm:p-4 h-12 w-12 sm:h-14 sm:w-14 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all duration-200">
									<Camera className="h-5 w-5 sm:h-6 sm:w-6" />
								</Button>
								<Button
									variant="ghost"
									size="lg"
									className="p-3 sm:p-4 h-12 w-12 sm:h-14 sm:w-14 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all duration-200">
									<Filter className="h-5 w-5 sm:h-6 sm:w-6" />
								</Button>
								<Button
									onClick={() => setIsSearchOpen(true)}
									size="lg"
									className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
									<Zap className="mr-2 h-5 w-5" />
									Search
								</Button>
							</div>
						</div>

						{/* Quick Suggestions - LARGER */}
						<div className="px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8">
							<div className="flex flex-wrap gap-3 sm:gap-4">
								<span className="text-sm sm:text-base text-gray-400 font-medium">
									Popular searches:
								</span>
								{[
									'Keyword Research',
									'Backlink Analysis',
									'Site Audit',
									'Rank Tracking',
									'Content Optimization',
									'Technical SEO',
								].map((suggestion) => (
									<button
										key={suggestion}
										onClick={() => setIsSearchOpen(true)}
										className="text-sm sm:text-base bg-gray-700/50 hover:bg-blue-900/30 hover:text-blue-300 hover:border-blue-500/50 text-gray-300 px-4 py-2 rounded-full transition-all duration-200 border border-gray-600/50">
										{suggestion}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Trust Indicators - ENHANCED */}
				<div className="flex flex-col sm:flex-row items-center justify-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-8 text-sm sm:text-base text-gray-400">
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
						<span>300+ Tools Available</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
						<span>Real-time Results</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
						<span>AI-Enhanced Discovery</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
						<span>50K+ Happy Users</span>
					</div>
				</div>
			</div>

			<SearchOverlay
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>
		</>
	);
}

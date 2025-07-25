// src/pages/marketplace/ToolMarketplacePage.tsx (update to remove scroll-based search)
import { Hero } from '@/components/hero/HeroSection';
// import { FeaturedToolsGrid } from '@/components/search/FeaturedResults';
import { TrustSignals } from '@/components/shared/TrustSignals';
import { ExploreToolsGrid } from '@/components/tools/ToolGrid';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllTools } from '@/store/slice/toolsSlice';
import { useEffect } from 'react';

export function ToolMarketplacePage() {
	const dispatch = useAppDispatch();
	const { isLoading } = useAppSelector((state) => state.tools);

	useEffect(() => {
		dispatch(fetchAllTools());
	}, [dispatch]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
					<p className="text-muted-foreground">
						Loading the Future of AI Tools...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-16">
			<Hero />
			<TrustSignals />
			{/* Always show featured and all tools - search happens in overlay */}
			{/* <FeaturedToolsGrid /> */}
			<ExploreToolsGrid />
		</div>
	);
}

// src/components/search/FeaturedResults.tsx
import { GridToolCard } from '@/components/tools/ToolGridCard';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateToolRating } from '@/store/slice/toolsSlice';
import { useNavigate } from 'react-router-dom';

export function FeaturedToolsGrid() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { featuredTools } = useAppSelector((state) => state.tools);

	const handleCardClick = (tool: Tool) => {
		navigate(`/tools/${tool.slug || tool._id}`);
	};

	const handleToolRatingUpdate = (
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
	};

	if (featuredTools.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-bold">Featured Tools</h2>
				<p className="text-muted-foreground">
					Hand-picked selections from our experts.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{featuredTools.map((tool) => (
					<GridToolCard
						key={tool._id}
						tool={tool}
						onCardClick={() => handleCardClick(tool)}
						onToolRatingUpdate={handleToolRatingUpdate}
					/>
				))}
			</div>
		</div>
	);
}

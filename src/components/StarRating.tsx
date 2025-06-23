import { useAuth } from '@/context/AuthContext';
import { rateTool } from '@/lib/api';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StarRatingProps {
	toolId: string;
	averageRating: number;
	numberOfRatings: number;
	size?: number;
	allowInput?: boolean;
	onRatingChange?: (
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

export function StarRating({
	toolId,
	averageRating,
	numberOfRatings,
	size = 18,
	allowInput = false,
	onRatingChange,
}: StarRatingProps) {
	const { user, isLoading: loadingAuth } = useAuth();
	const [hoveredRating, setHoveredRating] = useState(0);
	const [currentDisplayAverageRating, setCurrentDisplayAverageRating] =
		useState(averageRating);
	const [currentDisplayNumberOfRatings, setCurrentDisplayNumberOfRatings] =
		useState(numberOfRatings);
	const [isSubmitting, setIsSubmitting] = useState(false);
	useEffect(() => {
		setCurrentDisplayAverageRating(averageRating);
		setCurrentDisplayNumberOfRatings(numberOfRatings);
	}, [averageRating, numberOfRatings]);

	const handleStarClick = async (
		starValue: number,
		event: React.MouseEvent
	) => {
		event.stopPropagation();

		if (!allowInput || !user || isSubmitting) {
			if (!user && allowInput && !loadingAuth) {
				toast.info('Please log in to rate this tool.');
			}
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await rateTool(toolId, starValue);
			toast.success(response.message || 'Rating submitted successfully!');

			setCurrentDisplayAverageRating(response.averageRating);
			setCurrentDisplayNumberOfRatings(response.numberOfRatings);
			if (onRatingChange) {
				onRatingChange(response.averageRating, response.numberOfRatings);
			}
		} catch (error: unknown) {
			console.error('Failed to submit rating:', error);

			interface ErrorWithResponse {
				response: {
					data?: {
						message?: string;
					};
				};
			}
			const errorMessage =
				typeof error === 'object' && error !== null && 'response' in error
					? (error as ErrorWithResponse).response?.data?.message ||
					  'Failed to submit rating.'
					: 'Failed to submit rating.';
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderStar = (starIndex: number) => {
		const ratingToDisplay =
			allowInput && hoveredRating > 0
				? hoveredRating
				: currentDisplayAverageRating;
		const fillPercentage = Math.max(
			0,
			Math.min(100, (ratingToDisplay - starIndex + 1) * 100)
		);

		return (
			<div
				key={starIndex}
				className={`relative ${allowInput ? 'cursor-pointer' : ''} ${
					isSubmitting ? 'opacity-50 pointer-events-none' : ''
				}`}
				style={{ width: size, height: size }}
				onMouseEnter={() => allowInput && setHoveredRating(starIndex)}
				onMouseLeave={() => allowInput && setHoveredRating(0)}
				onClick={(e) => handleStarClick(starIndex, e)}>
				<Star
					fill="currentColor"
					strokeWidth={0}
					className="text-gray-300 dark:text-gray-600"
					style={{ width: size, height: size }}
				/>
				<div
					className="absolute top-0 left-0 overflow-hidden"
					style={{ width: `${fillPercentage}%`, height: size }}>
					<Star
						fill="currentColor"
						strokeWidth={0}
						className="text-yellow-500"
						style={{ width: size, height: size }}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((starIndex) => renderStar(starIndex))}
			{currentDisplayNumberOfRatings > 0 ? (
				<span className="ml-2 text-sm text-muted-foreground">
					({currentDisplayAverageRating.toFixed(1)} /{' '}
					{currentDisplayNumberOfRatings} ratings)
				</span>
			) : (
				<span className="ml-2 text-sm text-muted-foreground"></span>
			)}
		</div>
	);
}

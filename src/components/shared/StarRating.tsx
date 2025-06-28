// src/components/shared/StarRating.tsx
import { rateTool } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StarRatingProps {
	toolId: string;
	averageRating: number;
	numberOfRatings: number;
	onRatingChange: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
	readonly?: boolean;
	size?: number;
}

export function StarRating({
	toolId,
	averageRating,
	numberOfRatings,
	onRatingChange,
	readonly = false,
	size = 16,
}: StarRatingProps) {
	const { user } = useAppSelector((state) => state.auth);
	const [hover, setHover] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentRating, setCurrentRating] = useState(averageRating);

	useEffect(() => {
		setCurrentRating(averageRating);
	}, [averageRating]);

	const handleRating = async (rating: number) => {
		if (readonly || !user || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const response = await rateTool(toolId, rating);
			setCurrentRating(response.averageRating);
			onRatingChange(toolId, response.averageRating, response.numberOfRatings);
			toast.success('Rating submitted successfully!');
		} catch (error) {
			console.error('Failed to submit rating:', error);
			toast.error('Failed to submit rating');
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayRating = hover > 0 ? hover : currentRating;

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						className={`${
							readonly || !user
								? 'cursor-default'
								: 'cursor-pointer hover:scale-110 transition-transform'
						} disabled:opacity-50`}
						disabled={isSubmitting}
						onClick={() => !readonly && handleRating(star)}
						onMouseEnter={() => !readonly && setHover(star)}
						onMouseLeave={() => !readonly && setHover(0)}>
						<Star
							size={size}
							className={`${
								star <= Math.floor(displayRating)
									? 'text-yellow-400 fill-yellow-400'
									: star <= displayRating
									? 'text-yellow-400 fill-yellow-400/50'
									: 'text-gray-300'
							} transition-colors`}
						/>
					</button>
				))}
			</div>
			<span className="text-sm text-muted-foreground">
				{currentRating.toFixed(1)} ({numberOfRatings}{' '}
				{numberOfRatings === 1 ? 'rating' : 'ratings'})
			</span>
			{!readonly && !user && (
				<span className="text-xs text-muted-foreground">Sign in to rate</span>
			)}
		</div>
	);
}

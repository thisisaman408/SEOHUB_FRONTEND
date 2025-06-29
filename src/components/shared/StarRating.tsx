import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitRating } from '@/store/slice/toolsSlice';
import { Lock, Star } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface StarRatingProps {
	toolId: string;
	readonly?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
	toolId,
	readonly = false,
	size = 'md',
}: StarRatingProps) {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const tool = useAppSelector((state) => {
		if (state.tools.currentTool?._id === toolId) {
			return state.tools.currentTool;
		}

		return (
			state.tools.allTools.find((t) => t._id === toolId) ||
			state.tools.searchResults.find((t) => t._id === toolId) ||
			state.tools.featuredTools.find((t) => t._id === toolId) ||
			null
		);
	});

	const [hover, setHover] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { averageRating, numberOfRatings } = useMemo(() => {
		const rating = tool?.averageRating;
		const count = tool?.numberOfRatings;

		return {
			averageRating:
				rating === null || rating === undefined || isNaN(rating)
					? 0
					: Number(rating),
			numberOfRatings:
				count === null || count === undefined || isNaN(count)
					? 0
					: Number(count),
		};
	}, [tool?.averageRating, tool?.numberOfRatings]);
	const handleRating = useCallback(
		async (rating: number) => {
			if (readonly || !user || isSubmitting) return;

			setIsSubmitting(true);
			try {
				await dispatch(submitRating({ toolId, rating })).unwrap();
				toast.success('Rating submitted successfully!');
			} catch (error: unknown) {
				console.error('Failed to submit rating:', error);
				toast.error(
					error instanceof Error ? error.message : 'Failed to submit rating'
				);
			} finally {
				setIsSubmitting(false);
			}
		},
		[dispatch, toolId, readonly, user, isSubmitting]
	);

	const displayRating = hover > 0 ? hover : averageRating;

	const sizeConfig = useMemo(
		() => ({
			sm: {
				star: 'h-4 w-4',
				text: 'text-sm',
				spacing: 'space-x-1',
				padding: 'p-1',
			},
			md: {
				star: 'h-5 w-5',
				text: 'text-base',
				spacing: 'space-x-1.5',
				padding: 'p-1.5',
			},
			lg: {
				star: 'h-6 w-6',
				text: 'text-lg',
				spacing: 'space-x-2',
				padding: 'p-2',
			},
		}),
		[]
	);

	const config = sizeConfig[size];

	if (!tool) {
		return (
			<div className="flex items-center space-x-3">
				<div className={`flex items-center ${config.spacing}`}>
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							className={`${config.star} fill-gray-600 text-gray-600`}
						/>
					))}
				</div>
				<span className={`text-gray-400 ${config.text}`}>No ratings yet</span>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-3">
			<div className={`flex items-center ${config.spacing}`}>
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						disabled={readonly || !user || isSubmitting}
						className={`${config.padding} transition-all duration-200 ${
							readonly || !user
								? 'cursor-default'
								: 'cursor-pointer hover:scale-110'
						} ${isSubmitting ? 'opacity-50' : ''}`}
						onClick={() => handleRating(star)}
						onMouseEnter={() =>
							!readonly && !isSubmitting && user && setHover(star)
						}
						onMouseLeave={() =>
							!readonly && !isSubmitting && user && setHover(0)
						}
						aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>
						<Star
							className={`${config.star} transition-all duration-200 ${
								star <= displayRating
									? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
									: 'fill-gray-600 text-gray-600'
							} ${!readonly && user && !isSubmitting ? 'hover:scale-110' : ''}`}
						/>
					</button>
				))}
			</div>

			<div className="flex items-center space-x-2">
				<span className={`font-semibold text-yellow-400 ${config.text}`}>
					{(averageRating || 0).toFixed(1)}
				</span>
				<span className={`text-gray-400 ${config.text}`}>
					({numberOfRatings} {numberOfRatings === 1 ? 'review' : 'reviews'})
				</span>
			</div>

			{!readonly && !user && (
				<div className="flex items-center space-x-1 text-gray-500">
					<Lock className="h-3 w-3" />
					<span className="text-xs">Login to rate</span>
				</div>
			)}

			{isSubmitting && (
				<div className="flex items-center space-x-1 text-blue-400">
					<div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
					<span className="text-xs">Saving...</span>
				</div>
			)}
		</div>
	);
}

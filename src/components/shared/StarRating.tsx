// src/components/shared/StarRating.tsx

import { rateTool } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { Lock, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StarRatingProps {
	toolId: string;
	averageRating: number;
	numberOfRatings: number;
	onRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
	readonly?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
	toolId,
	averageRating,
	numberOfRatings,
	onRatingUpdate,
	readonly = false,
	size = 'md',
}: StarRatingProps) {
	const { user } = useAppSelector((state) => state.auth);
	const [hover, setHover] = useState(0);
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
			onRatingUpdate(toolId, response.averageRating, response.numberOfRatings);
			toast.success('Rating submitted successfully!');
		} catch (error) {
			console.error('Failed to submit rating:', error);
			toast.error('Failed to submit rating');
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayRating = hover > 0 ? hover : currentRating;

	// Size configurations
	const sizeConfig = {
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
	};

	const config = sizeConfig[size];

	return (
		<div className="flex flex-col space-y-2">
			{/* Stars Container */}
			<div className={`flex items-center ${config.spacing}`}>
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						disabled={readonly || !user || isSubmitting}
						onClick={() => !readonly && handleRating(star)}
						onMouseEnter={() => !readonly && setHover(star)}
						onMouseLeave={() => !readonly && setHover(0)}
						className={`
							${config.padding} rounded-lg transition-all duration-200 transform
							${
								!readonly && user
									? 'hover:scale-110 hover:bg-gray-800/50 cursor-pointer'
									: 'cursor-default'
							}
							${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
						`}>
						<Star
							className={`
								${config.star} transition-all duration-200
								${
									star <= displayRating
										? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
										: 'text-gray-600 hover:text-gray-500'
								}
								${star <= hover && !readonly ? 'scale-110' : ''}
							`}
						/>
					</button>
				))}

				{/* Loading indicator */}
				{isSubmitting && (
					<div className="ml-2">
						<div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}
			</div>

			{/* Rating Info */}
			<div className="flex items-center justify-between">
				<div className={`flex items-center space-x-2 ${config.text}`}>
					<span className="font-semibold text-white">
						{currentRating.toFixed(1)}
					</span>
					<span className="text-gray-400">
						({numberOfRatings} {numberOfRatings === 1 ? 'rating' : 'ratings'})
					</span>
				</div>

				{/* Auth prompt */}
				{!readonly && !user && (
					<div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700/50">
						<Lock className="h-3 w-3" />
						<span>Sign in to rate</span>
					</div>
				)}
			</div>

			{/* Rating Distribution Preview (for larger sizes) */}
			{size === 'lg' && numberOfRatings > 0 && (
				<div className="mt-2 space-y-1">
					{[5, 4, 3, 2, 1].map((starCount) => {
						// Mock distribution - in real app, this would come from API
						const percentage = Math.max(
							0,
							(6 - starCount) * 15 + Math.random() * 20
						);
						return (
							<div
								key={starCount}
								className="flex items-center space-x-2 text-xs">
								<span className="text-gray-400 w-2">{starCount}</span>
								<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
								<div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
										style={{ width: `${percentage}%` }}
									/>
								</div>
								<span className="text-gray-500 w-8 text-right">
									{Math.round(percentage)}%
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

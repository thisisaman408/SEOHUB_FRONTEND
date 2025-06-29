import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { colorMap } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { updateToolRating } from '@/store/slice/toolsSlice';
import { closeModal } from '@/store/slice/uiSlice';
import { ArrowRight, BarChart, Zap } from 'lucide-react';

export function ToolDetailModal() {
	const dispatch = useAppDispatch();
	const { activeModal, selectedTool } = useAppSelector((state) => state.ui);

	const isOpen = activeModal === 'toolDetail' && !!selectedTool;

	const handleClose = () => {
		dispatch(closeModal());
	};

	// const handleToolRatingUpdate = (
	// 	toolId: string,
	// 	newAverageRating: number,
	// 	newNumberOfRatings: number
	// ) => {
	// 	dispatch(
	// 		updateToolRating({
	// 			toolId,
	// 			averageRating: newAverageRating,
	// 			numberOfRatings: newNumberOfRatings,
	// 		})
	// 	);
	// };

	const handleVisitWebsite = () => {
		if (selectedTool) {
			window.open(selectedTool.websiteUrl, '_blank');
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
			<DialogContent className="sm:max-w-[650px]">
				{selectedTool && (
					<>
						<DialogHeader
							className={`relative flex flex-row items-start gap-4 p-6 rounded-t-lg overflow-hidden ${
								selectedTool.isFeatured
									? colorMap[selectedTool.visual?.color || 'default']?.bg
									: 'bg-background'
							}`}>
							{selectedTool.isFeatured && (
								<Badge
									variant="secondary"
									className={`absolute top-4 right-4 z-20 text-xs py-1 px-2 rounded-full
                                        ${
																					colorMap[
																						selectedTool.visual?.color ||
																							'default'
																					]?.text
																				}
                                        ${
																					colorMap[
																						selectedTool.visual?.color ||
																							'default'
																					]?.border
																				}
                                        ${
																					colorMap[
																						selectedTool.visual?.color ||
																							'default'
																					]?.bg
																				}`}>
									FEATURED
								</Badge>
							)}
							<div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center z-10">
								{selectedTool.logoUrl ? (
									<img
										src={selectedTool.logoUrl}
										alt={`${selectedTool.name} logo`}
										className="w-full h-full object-cover rounded-lg border"
									/>
								) : (
									<span className="text-4xl font-bold text-muted-foreground">
										{selectedTool.name.charAt(0).toUpperCase()}
									</span>
								)}
							</div>
							<div className="pt-2 z-10">
								<DialogTitle
									className={`text-2xl ${
										selectedTool.isFeatured ? 'text-black' : 'text-foreground'
									}`}>
									{selectedTool.name}
								</DialogTitle>
								<DialogDescription
									className={`${
										selectedTool.isFeatured
											? 'text-gray-600/80'
											: 'text-muted-foreground'
									}`}>
									{selectedTool.tagline}
								</DialogDescription>
								<div className="mt-2">
									<StarRating toolId={selectedTool._id} size="md" />
								</div>
							</div>
						</DialogHeader>
						<div className="grid gap-4 py-4 px-6">
							<p className="text-sm text-muted-foreground">
								{selectedTool.description}
							</p>
							<div className="flex flex-wrap gap-2">
								{selectedTool.tags?.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
							{selectedTool.visual?.content && (
								<div className="mt-2">
									<h4 className="font-semibold mb-2">Key AI Features:</h4>
									<ul className="space-y-2">
										{selectedTool.visual.content.map((item, index) => (
											<li
												key={index}
												className="flex items-center gap-2 text-sm">
												{item.icon === 'zap' ? (
													<Zap className="h-4 w-4 text-yellow-500" />
												) : (
													<BarChart className="h-4 w-4 text-blue-500" />
												)}
												<span>{item.text}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
						<Button
							size="lg"
							className="w-full mt-4 mx-6 mb-6"
							onClick={handleVisitWebsite}>
							Visit Website <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	colorMap,
	type SubmitToolFormData,
	type VisualElement,
} from '@/lib/types';
import { motion } from 'framer-motion';
import {
	BarChart3,
	Palette,
	Plus,
	Rocket,
	Shield,
	Star,
	Target,
	Trash2,
	TrendingUp,
	Zap,
} from 'lucide-react';

interface VisualsStepProps {
	formData: SubmitToolFormData;
	onFormChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}

export function VisualsStep({ formData, onFormChange }: VisualsStepProps) {
	// ✅ Remove Redux dependencies - use the formData prop instead

	const handleColorChange = (color: string) => {
		// ✅ Trigger onChange for the parent component to handle
		const fakeEvent = {
			target: { id: 'color', value: color },
		} as React.ChangeEvent<HTMLInputElement>;
		onFormChange(fakeEvent);
	};

	const addVisualElement = () => {
		const newElement: VisualElement = {
			type: 'feature',
			icon: 'zap',
			text: '',
		};

		// ✅ Use formData prop instead of Redux
		const currentContent = formData.content || [];
		const updatedContent = [...currentContent, newElement];

		// ✅ Trigger onChange for the parent to handle
		const fakeEvent = {
			target: {
				id: 'content',
				value: JSON.stringify(updatedContent),
			},
		} as React.ChangeEvent<HTMLInputElement>;
		onFormChange(fakeEvent);
	};

	const removeVisualElement = (index: number) => {
		// ✅ Use formData prop instead of Redux
		const currentContent = formData.content || [];
		const updatedContent = currentContent.filter((_, i) => i !== index);

		// ✅ Trigger onChange for the parent to handle
		const fakeEvent = {
			target: {
				id: 'content',
				value: JSON.stringify(updatedContent),
			},
		} as React.ChangeEvent<HTMLInputElement>;
		onFormChange(fakeEvent);
	};

	const updateVisualElement = (
		index: number,
		field: keyof VisualElement,
		value: string
	) => {
		// ✅ Use formData prop instead of Redux
		const currentContent = formData.content || [];
		const updatedContent = currentContent.map((item, i) =>
			i === index ? { ...item, [field]: value } : item
		);

		// ✅ Trigger onChange for the parent to handle
		const fakeEvent = {
			target: {
				id: 'content',
				value: JSON.stringify(updatedContent),
			},
		} as React.ChangeEvent<HTMLInputElement>;
		onFormChange(fakeEvent);
	};

	const getIconComponent = (iconName: string) => {
		switch (iconName) {
			case 'zap':
				return <Zap className="h-4 w-4" />;
			case 'chart':
				return <BarChart3 className="h-4 w-4" />;
			case 'trending':
				return <TrendingUp className="h-4 w-4" />;
			case 'star':
				return <Star className="h-4 w-4" />;
			case 'target':
				return <Target className="h-4 w-4" />;
			case 'rocket':
				return <Rocket className="h-4 w-4" />;
			case 'shield':
				return <Shield className="h-4 w-4" />;
			default:
				return <Zap className="h-4 w-4" />;
		}
	};

	const colorOptions = Object.entries(colorMap).map(([key, value]) => ({
		key,
		...value,
	}));

	const selectedColor =
		colorMap[formData.color || 'default'] || colorMap.default;

	return (
		<motion.div
			className="space-y-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header */}
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-bold text-white">Visual Design</h2>
				<p className="text-gray-400">
					Customize how your tool appears in cards and listings with colors,
					icons, and feature highlights.
				</p>
			</div>

			{/* Color Theme Selection */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6">
					<div className="space-y-4">
						<Label className="text-lg font-semibold text-white flex items-center space-x-2">
							<Palette className="h-5 w-5 text-purple-400" />
							<span>Color Theme</span>
						</Label>
						<p className="text-gray-400 text-sm">
							Choose a color theme that represents your tool's personality and
							brand.
						</p>

						<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
							{colorOptions.map((color) => (
								<motion.button
									key={color.key}
									type="button"
									onClick={() => handleColorChange(color.key)}
									className={`
										group relative p-4 rounded-xl border-2 transition-all duration-300 
										${
											formData.color === color.key
												? 'border-white shadow-lg scale-105'
												: 'border-gray-700/50 hover:border-gray-600 hover:scale-102'
										}
									`}
									style={{ backgroundColor: color.background }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<div className="space-y-3">
										<div
											className="w-8 h-8 rounded-full mx-auto shadow-md"
											style={{ backgroundColor: color.primary }}
										/>
										<div className="text-center">
											<div className="text-xs font-medium text-white capitalize">
												{color.key}
											</div>
										</div>
									</div>
									{formData.color === color.key && (
										<div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
											<div className="w-3 h-3 bg-green-500 rounded-full" />
										</div>
									)}
								</motion.button>
							))}
						</div>

						{/* Preview */}
						<div
							className="mt-6 p-4 rounded-xl border border-gray-700/50"
							style={{ backgroundColor: selectedColor.background }}>
							<div className="text-center">
								<h4 className="text-white font-semibold mb-2">Preview</h4>
								<div
									className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md"
									style={{ backgroundColor: selectedColor.primary }}>
									<Zap className="h-4 w-4 text-white" />
									<span className="text-white font-medium">
										{formData.name || 'Your Tool'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Feature Highlights */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<Label className="text-lg font-semibold text-white flex items-center space-x-2">
									<Star className="h-5 w-5 text-yellow-400" />
									<span>Feature Highlights</span>
								</Label>
								<p className="text-gray-400 text-sm mt-1">
									Add key features that will be displayed on your tool card to
									attract users.
								</p>
							</div>
							<Button
								type="button"
								onClick={addVisualElement}
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
								<Plus className="mr-2 h-4 w-4" />
								Add Feature
							</Button>
						</div>

						{/* Visual Elements List - ✅ Use formData instead of editModalData */}
						<div className="space-y-4">
							{(formData.content || []).map((element, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}>
									<Card className="bg-gray-800/50 border-gray-700/50">
										<CardContent className="p-4">
											<div className="flex items-start space-x-4">
												{/* Icon Selection */}
												<div className="space-y-2">
													<Label className="text-sm text-gray-300">Icon</Label>
													<Select
														value={element.icon}
														onValueChange={(value) =>
															updateVisualElement(index, 'icon', value)
														}>
														<SelectTrigger className="w-20 bg-gray-700/50 border-gray-600/50 text-white">
															<SelectValue>
																<div className="flex items-center justify-center">
																	{getIconComponent(element.icon)}
																</div>
															</SelectValue>
														</SelectTrigger>
														<SelectContent className="bg-gray-800 border-gray-700">
															{[
																{
																	value: 'zap',
																	label: 'Zap',
																	icon: <Zap className="h-4 w-4" />,
																},
																{
																	value: 'chart',
																	label: 'Chart',
																	icon: <BarChart3 className="h-4 w-4" />,
																},
																{
																	value: 'trending',
																	label: 'Trending',
																	icon: <TrendingUp className="h-4 w-4" />,
																},
																{
																	value: 'star',
																	label: 'Star',
																	icon: <Star className="h-4 w-4" />,
																},
																{
																	value: 'target',
																	label: 'Target',
																	icon: <Target className="h-4 w-4" />,
																},
																{
																	value: 'rocket',
																	label: 'Rocket',
																	icon: <Rocket className="h-4 w-4" />,
																},
																{
																	value: 'shield',
																	label: 'Shield',
																	icon: <Shield className="h-4 w-4" />,
																},
															].map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																	className="text-gray-300 hover:bg-gray-700">
																	<div className="flex items-center space-x-2">
																		{option.icon}
																		<span>{option.label}</span>
																	</div>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												{/* Text Input */}
												<div className="flex-1 space-y-2">
													<Label className="text-sm text-gray-300">
														Feature Description
													</Label>
													<Textarea
														value={element.text}
														onChange={(e) =>
															updateVisualElement(index, 'text', e.target.value)
														}
														placeholder="Describe this feature..."
														className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 resize-none"
														rows={2}
													/>
												</div>

												{/* Remove Button */}
												<Button
													type="button"
													onClick={() => removeVisualElement(index)}
													variant="ghost"
													size="sm"
													className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-6">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>

						{/* Empty State - ✅ Use formData instead of editModalData */}
						{(!formData.content || formData.content.length === 0) && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}>
								<Card className="bg-gray-800/30 border-gray-700/30 border-dashed">
									<CardContent className="p-8 text-center">
										<div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
											<Star className="h-8 w-8 text-gray-500" />
										</div>
										<h3 className="text-lg font-semibold text-gray-400 mb-2">
											No features added yet
										</h3>
										<p className="text-gray-500 mb-4">
											Add key features to highlight what makes your tool
											special.
										</p>
										<Button
											type="button"
											onClick={addVisualElement}
											variant="outline"
											className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
											<Plus className="mr-2 h-4 w-4" />
											Add Your First Feature
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{/* Feature Preview - ✅ Use formData instead of editModalData */}
						{formData.content && formData.content.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}>
								<div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
									<h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
										<Zap className="h-4 w-4 text-blue-400" />
										<span>Preview</span>
									</h4>
									<div className="space-y-2">
										{formData.content.slice(0, 3).map((feature, index) => (
											<div
												key={index}
												className="flex items-center space-x-2 text-sm">
												<div className="text-blue-400">
													{getIconComponent(feature.icon)}
												</div>
												<span className="text-gray-300">
													{feature.text || 'Feature description'}
												</span>
											</div>
										))}
										{formData.content.length > 3 && (
											<div className="text-xs text-gray-500 pl-6">
												+{formData.content.length - 3} more features
											</div>
										)}
									</div>
								</div>
							</motion.div>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

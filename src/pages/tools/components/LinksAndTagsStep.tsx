import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SubmitToolFormData } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setEditModalData } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Store, Tag } from 'lucide-react';

interface LinksAndTagsStepProps {
	formData: SubmitToolFormData;
	onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LinksAndTagsStep({
	formData,
	onFormChange,
}: LinksAndTagsStepProps) {
	const dispatch = useAppDispatch();
	const { editModalData } = useAppSelector((state) => state.tools);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedFormData = {
			...editModalData.formData,
			[e.target.id]: e.target.value,
		};
		dispatch(
			setEditModalData({
				...editModalData,
				formData: updatedFormData,
			})
		);
		onFormChange(e);
	};

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Website URL */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6">
					<div className="space-y-3">
						<Label
							htmlFor="websiteUrl"
							className="text-lg font-semibold text-white flex items-center space-x-2">
							<Globe className="h-5 w-5 text-blue-400" />
							<span>Website URL *</span>
						</Label>
						<Input
							id="websiteUrl"
							value={formData.websiteUrl}
							onChange={handleFormChange}
							placeholder="https://yourtool.com"
							type="url"
							className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg py-3"
							required
						/>
						<p className="text-gray-400 text-sm">
							The main website where users can access your tool
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Tags */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6">
					<div className="space-y-3">
						<Label
							htmlFor="tags"
							className="text-lg font-semibold text-white flex items-center space-x-2">
							<Tag className="h-5 w-5 text-green-400" />
							<span>Tags (comma-separated) *</span>
						</Label>
						<Input
							id="tags"
							value={formData.tags}
							onChange={handleFormChange}
							placeholder="SEO, Analytics, Marketing, Keywords, Backlinks"
							className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg py-3"
							required
						/>
						<p className="text-gray-400 text-sm">
							Help users discover your tool with relevant keywords
						</p>
						<div className="flex flex-wrap gap-2 mt-3">
							{formData.tags
								.split(',')
								.filter((tag) => tag.trim())
								.map((tag, index) => (
									<span
										key={index}
										className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
										{tag.trim()}
									</span>
								))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* App Store Links */}
			<div className="grid md:grid-cols-2 gap-6">
				{/* App Store URL */}
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-6">
						<div className="space-y-3">
							<Label
								htmlFor="appStoreUrl"
								className="text-lg font-semibold text-white flex items-center space-x-2">
								<Store className="h-5 w-5 text-gray-400" />
								<span>App Store URL (Optional)</span>
							</Label>
							<Input
								id="appStoreUrl"
								value={formData.appStoreUrl}
								onChange={handleFormChange}
								placeholder="https://apps.apple.com/..."
								type="url"
								className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
							/>
							<p className="text-gray-400 text-sm">
								iOS App Store link if available
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Google Play URL */}
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-6">
						<div className="space-y-3">
							<Label
								htmlFor="googlePlayUrl"
								className="text-lg font-semibold text-white flex items-center space-x-2">
								<Smartphone className="h-5 w-5 text-gray-400" />
								<span>Google Play URL (Optional)</span>
							</Label>
							<Input
								id="googlePlayUrl"
								value={formData.playStoreUrl}
								onChange={handleFormChange}
								placeholder="https://play.google.com/..."
								type="url"
								className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
							/>
							<p className="text-gray-400 text-sm">
								Google Play Store link if available
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</motion.div>
	);
}

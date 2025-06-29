import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Flag } from 'lucide-react';
import { useState } from 'react';
import { type ReportDialogProps } from './types';

export function ReportDialog({
	open,
	commentId,
	onClose,
	onReport,
}: ReportDialogProps) {
	const [reason, setReason] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = () => {
		if (!commentId || !reason) return;
		onReport(commentId, reason, description);
		setReason('');
		setDescription('');
	};

	const handleClose = () => {
		onClose();
		setReason('');
		setDescription('');
	};

	const reportReasons = [
		{
			value: 'spam',
			label: 'Spam',
			description: 'Repetitive or promotional content',
		},
		{
			value: 'inappropriate',
			label: 'Inappropriate Content',
			description: 'Offensive or inappropriate material',
		},
		{
			value: 'harassment',
			label: 'Harassment',
			description: 'Bullying or harassment of users',
		},
		{
			value: 'misinformation',
			label: 'Misinformation',
			description: 'False or misleading information',
		},
		{
			value: 'other',
			label: 'Other',
			description: 'Other violation of community guidelines',
		},
	];

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
				<DialogHeader className="space-y-4">
					<div className="flex items-center justify-center mb-4">
						<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
							<Flag className="h-8 w-8 text-red-400" />
						</div>
					</div>
					<DialogTitle className="text-2xl font-bold text-center text-white">
						Report Comment
					</DialogTitle>
					<DialogDescription className="text-gray-400 text-center leading-relaxed">
						Help us maintain a safe community by reporting inappropriate
						content. All reports are reviewed by our moderation team.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-3">
						<Label className="text-sm font-semibold text-gray-300">
							Reason for reporting *
						</Label>
						<Select value={reason} onValueChange={setReason}>
							<SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-red-500 focus:ring-red-500/20">
								<SelectValue placeholder="Select a reason" />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 border-gray-700">
								{reportReasons.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700">
										<div className="space-y-1">
											<div className="font-medium">{option.label}</div>
											<div className="text-xs text-gray-400">
												{option.description}
											</div>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-3">
						<Label className="text-sm font-semibold text-gray-300">
							Additional details (optional)
						</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Provide more context about why you're reporting this comment..."
							className="min-h-[100px] bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 resize-none"
							maxLength={500}
						/>
						<div className="flex justify-between text-xs text-gray-500">
							<span>Help us understand the issue better</span>
							<span>{description.length}/500</span>
						</div>
					</div>

					<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
						<div className="flex items-start space-x-3">
							<AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="text-sm font-medium text-yellow-300 mb-1">
									Important
								</h4>
								<p className="text-xs text-yellow-200/80 leading-relaxed">
									False reports may result in restrictions on your account.
									Please only report content that genuinely violates our
									community guidelines.
								</p>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter className="flex flex-col sm:flex-row gap-3">
					<Button
						variant="outline"
						onClick={handleClose}
						className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!reason}
						className="bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
						<Flag className="mr-2 h-4 w-4" />
						Submit Report
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

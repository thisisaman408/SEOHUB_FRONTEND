// src/pages/tools/components/comments/ReportDialog.tsx
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

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Report Comment</DialogTitle>
					<DialogDescription>
						Help us maintain a safe community by reporting inappropriate
						content.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for reporting</Label>
						<Select value={reason} onValueChange={setReason}>
							<SelectTrigger>
								<SelectValue placeholder="Select a reason" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="spam">Spam</SelectItem>
								<SelectItem value="inappropriate">
									Inappropriate Content
								</SelectItem>
								<SelectItem value="harassment">Harassment</SelectItem>
								<SelectItem value="misinformation">Misinformation</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Additional details (optional)</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Provide more context about why you're reporting this comment..."
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!reason}>
						Submit Report
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

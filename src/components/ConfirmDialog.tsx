import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	confirmVariant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
}

/**
 * A reusable custom confirmation dialog component.
 * It replaces native browser 'confirm' pop-ups for better UI/UX.
 *
 * @param {boolean} isOpen - Controls the visibility of the dialog.
 * @param {Function} onClose - Callback function when the dialog is closed (e.g., by clicking outside or cancel).
 * @param {Function} onConfirm - Callback function when the user confirms the action.
 * @param {string} title - The title of the confirmation dialog.
 * @param {string} description - The descriptive text explaining the action.
 * @param {string} [confirmText='Confirm'] - Text for the confirm button.
 * @param {string} [cancelText='Cancel'] - Text for the cancel button.
 * @param {string} [confirmVariant='destructive'] - Variant for the confirm button.
 */
export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmVariant = 'destructive',
}: ConfirmDialogProps) {
	const [isConfirming, setIsConfirming] = useState(false);

	const handleConfirmClick = async () => {
		setIsConfirming(true);
		try {
			await onConfirm();
			onClose();
		} catch (error) {
			console.error('Error during confirmation action:', error);
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isConfirming}>
						{cancelText}
					</Button>
					<Button
						variant={confirmVariant}
						onClick={handleConfirmClick}
						disabled={isConfirming}>
						{isConfirming ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

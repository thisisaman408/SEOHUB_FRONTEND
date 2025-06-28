import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeConfirmDialog } from '@/store/slice/uiSlice';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ConfirmDialog() {
	const dispatch = useAppDispatch();
	const { isConfirmDialogOpen, confirmDialogProps } = useAppSelector(
		(state) => state.ui
	);
	const [isConfirming, setIsConfirming] = useState(false);

	const handleClose = () => {
		dispatch(closeConfirmDialog());
	};

	const handleConfirmClick = async () => {
		if (!confirmDialogProps.onConfirm) return;

		setIsConfirming(true);
		try {
			await confirmDialogProps.onConfirm();
			handleClose();
		} catch (error) {
			console.error('Error during confirmation action:', error);
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{confirmDialogProps.title}</DialogTitle>
					<DialogDescription>
						{confirmDialogProps.description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={isConfirming}>
						Cancel
					</Button>
					<Button onClick={handleConfirmClick} disabled={isConfirming}>
						{isConfirming ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Confirming...
							</>
						) : (
							'Confirm'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

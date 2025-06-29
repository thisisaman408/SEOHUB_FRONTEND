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
import {
	AlertTriangle,
	CheckCircle,
	Info,
	Loader2,
	XCircle,
} from 'lucide-react';
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

	// Determine icon and color based on dialog type
	const getDialogIcon = () => {
		if (
			confirmDialogProps.title?.toLowerCase().includes('delete') ||
			confirmDialogProps.title?.toLowerCase().includes('remove')
		) {
			return <XCircle className="h-8 w-8 text-red-400" />;
		}
		if (
			confirmDialogProps.title?.toLowerCase().includes('confirm') ||
			confirmDialogProps.title?.toLowerCase().includes('save')
		) {
			return <CheckCircle className="h-8 w-8 text-green-400" />;
		}
		if (confirmDialogProps.title?.toLowerCase().includes('warning')) {
			return <AlertTriangle className="h-8 w-8 text-yellow-400" />;
		}
		return <Info className="h-8 w-8 text-blue-400" />;
	};

	const getButtonStyles = () => {
		if (
			confirmDialogProps.title?.toLowerCase().includes('delete') ||
			confirmDialogProps.title?.toLowerCase().includes('remove')
		) {
			return {
				confirm:
					'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
				cancel:
					'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white',
			};
		}
		return {
			confirm:
				'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
			cancel:
				'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white',
		};
	};

	const buttonStyles = getButtonStyles();

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
				{/* Header with Icon */}
				<DialogHeader className="text-center space-y-4">
					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
							{getDialogIcon()}
						</div>
					</div>
					<DialogTitle className="text-2xl font-bold text-white text-center">
						{confirmDialogProps.title}
					</DialogTitle>
					<DialogDescription className="text-gray-400 text-center leading-relaxed text-lg">
						{confirmDialogProps.description}
					</DialogDescription>
				</DialogHeader>

				{/* Action Buttons */}
				<DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={isConfirming}
						className={`${buttonStyles.cancel} font-medium py-2.5 px-6 rounded-lg transition-all duration-200`}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmClick}
						disabled={isConfirming}
						className={`${buttonStyles.confirm} font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
						{isConfirming ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								<span>Confirming...</span>
							</>
						) : (
							<span>Confirm</span>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// src/pages/tools/components/comments/ReplyForm.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type ReplyFormProps } from './types';

export function ReplyForm({
	onSubmit,
	onCancel,
	isSubmitting,
	initialValue = '',
	autoFocus = true,
}: ReplyFormProps) {
	const { user } = useAppSelector((state) => state.auth);
	const [content, setContent] = useState(initialValue);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (autoFocus && textareaRef.current) {
			textareaRef.current.focus();
			// Scroll into view
			textareaRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [autoFocus]);

	const handleSubmit = () => {
		if (!content.trim()) return;
		onSubmit(content.trim());
		setContent('');
	};

	if (!user) return null;

	return (
		<Card className="ml-8">
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.companyLogoUrl} />
						<AvatarFallback>
							{user.companyName?.charAt(0).toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-2">
						<Textarea
							ref={textareaRef}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Write a reply..."
							className="min-h-[80px]"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleSubmit}
								disabled={isSubmitting || !content.trim()}>
								{isSubmitting ? (
									<>
										<Loader2 className="h-3 w-3 mr-2 animate-spin" />
										Posting...
									</>
								) : (
									'Reply'
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									onCancel();
									setContent('');
								}}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

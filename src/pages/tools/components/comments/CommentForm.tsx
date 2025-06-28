// src/pages/tools/components/comments/CommentForm.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { type CommentFormProps } from './types';

export function CommentForm({
	onSubmit,
	isSubmitting,
	placeholder = 'Share your thoughts...',
	buttonText = 'Comment',
}: CommentFormProps) {
	const { user } = useAppSelector((state) => state.auth);
	const [content, setContent] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = () => {
		if (!content.trim()) return;
		onSubmit(content.trim());
		setContent('');
	};

	if (!user) {
		return (
			<Card>
				<CardContent className="p-4 text-center">
					<p className="text-muted-foreground">
						Please sign in to leave a comment
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
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
							placeholder={placeholder}
							className="min-h-[80px]"
						/>
						<div className="flex gap-2">
							<Button
								onClick={handleSubmit}
								disabled={isSubmitting || !content.trim()}>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Posting...
									</>
								) : (
									buttonText
								)}
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

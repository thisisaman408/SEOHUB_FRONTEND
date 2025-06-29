import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';
import { Loader2, Send, X } from 'lucide-react';
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
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			<Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
				<CardContent className="p-4">
					<div className="flex items-start space-x-3">
						{/* User Avatar */}
						<Avatar className="h-8 w-8 ring-2 ring-gray-600 flex-shrink-0">
							<AvatarImage src={user.companyLogoUrl} alt={user.companyName} />
							<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
								{user.companyName?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>

						{/* Reply Input Area */}
						<div className="flex-1 space-y-3">
							<div className="relative">
								<Textarea
									ref={textareaRef}
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="Write a reply..."
									className="min-h-[80px] bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-lg"
									disabled={isSubmitting}
								/>

								{/* Character count */}
								<div className="absolute bottom-2 right-2 text-xs text-gray-500">
									{content.length}/500
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center justify-between">
								<div className="text-xs text-gray-400">
									Replying as{' '}
									<span className="font-medium text-gray-300">
										{user.companyName}
									</span>
								</div>

								<div className="flex items-center space-x-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onCancel();
											setContent('');
										}}
										disabled={isSubmitting}
										className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
										<X className="mr-1 h-3 w-3" />
										Cancel
									</Button>
									<Button
										size="sm"
										onClick={handleSubmit}
										disabled={isSubmitting || !content.trim()}
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
										{isSubmitting ? (
											<>
												<Loader2 className="mr-1 h-3 w-3 animate-spin" />
												Posting...
											</>
										) : (
											<>
												<Send className="mr-1 h-3 w-3" />
												Reply
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

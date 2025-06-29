import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';
import { Loader2, MessageSquare, Send } from 'lucide-react';
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
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
							<MessageSquare className="h-8 w-8 text-gray-500" />
						</div>
						<h3 className="text-xl font-semibold text-gray-300 mb-2">
							Join the conversation
						</h3>
						<p className="text-gray-400 mb-6">
							Please sign in to leave a comment and share your thoughts with the
							community.
						</p>
						<Button
							variant="outline"
							className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
							Sign In to Comment
						</Button>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
				<CardContent className="p-6">
					<div className="flex items-start space-x-4">
						{/* User Avatar */}
						<Avatar className="h-12 w-12 ring-2 ring-gray-700 flex-shrink-0">
							<AvatarImage src={user.companyLogoUrl} alt={user.companyName} />
							<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
								{user.companyName?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>

						{/* Comment Input Area */}
						<div className="flex-1 space-y-4">
							<div className="relative">
								<Textarea
									ref={textareaRef}
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder={placeholder}
									className="min-h-[100px] bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-xl"
									disabled={isSubmitting}
								/>

								{/* Character count */}
								<div className="absolute bottom-3 right-3 text-xs text-gray-500">
									{content.length}/500
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center justify-between">
								<div className="flex items-center text-sm text-gray-400">
									<span>
										Posting as{' '}
										<span className="font-medium text-gray-300">
											{user.companyName}
										</span>
									</span>
								</div>

								<div className="flex items-center space-x-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setContent('')}
										disabled={isSubmitting || !content.trim()}
										className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
										Clear
									</Button>
									<Button
										onClick={handleSubmit}
										disabled={isSubmitting || !content.trim()}
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Posting...
											</>
										) : (
											<>
												<Send className="mr-2 h-4 w-4" />
												{buttonText}
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

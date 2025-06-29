import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
	Check,
	ChevronDown,
	ChevronUp,
	Edit,
	Flag,
	Loader2,
	MoreHorizontal,
	Reply,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { ReplyForm } from './ReplyForm';
import { type CommentItemProps } from './types';

export function CommentItem({
	comment,
	level = 0,
	toolId,
	onVoteComment,
	onReply,
	onEdit,
	onDelete,
	onReport,
	votingState,
}: CommentItemProps) {
	const { user } = useAppSelector((state) => state.auth);
	const isOwner = user?._id === comment.user._id;
	const [showReplies, setShowReplies] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(comment.content);
	const [isReplying, setIsReplying] = useState(false);

	const handleEdit = () => {
		if (!editText.trim()) return;
		onEdit(comment._id, editText.trim());
		setIsEditing(false);
	};

	const handleReply = (content: string) => {
		onReply(comment._id, content);
		setIsReplying(false);
	};

	const handleStartReply = () => {
		setIsReplying(true);
	};

	const maxDepth = 3;
	const isNested = level > 0;
	const canNest = level < maxDepth;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`${isNested ? 'ml-6 sm:ml-12' : ''}`}>
			<Card
				className={`bg-gray-900/30 backdrop-blur-sm border-gray-800/30 hover:bg-gray-900/50 transition-all duration-300 ${
					isNested ? 'border-l-2 border-l-blue-500/30' : ''
				}`}>
				<CardContent className="p-4 sm:p-6">
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<div className="flex items-center space-x-3">
								<Avatar className="h-10 w-10 ring-2 ring-gray-700">
									<AvatarImage
										src={comment.user.companyLogoUrl}
										alt={comment.user.companyName}
									/>
									<AvatarFallback className="bg-gray-700 text-gray-300 font-semibold">
										{comment.user.companyName?.charAt(0).toUpperCase() || 'U'}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="flex items-center space-x-2">
										<span className="font-semibold text-white">
											{comment.user.companyName}
										</span>
										{isOwner && (
											<Badge
												variant="secondary"
												className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
												You
											</Badge>
										)}
									</div>
									<span className="text-sm text-gray-400">
										{formatDistanceToNow(new Date(comment.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-gray-400 hover:text-white hover:bg-gray-800/50">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="bg-gray-800 border-gray-700">
									{isOwner && (
										<>
											<DropdownMenuItem
												onClick={() => setIsEditing(true)}
												className="text-gray-300 hover:bg-gray-700">
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(comment._id)}
												className="text-red-400 hover:bg-red-900/30">
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</>
									)}
									{!isOwner && (
										<DropdownMenuItem
											onClick={() => onReport(comment._id)}
											className="text-yellow-400 hover:bg-yellow-900/30">
											<Flag className="mr-2 h-4 w-4" />
											Report
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="ml-13">
							{isEditing ? (
								<div className="space-y-3">
									<Textarea
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
									/>
									<div className="flex items-center space-x-2">
										<Button
											size="sm"
											onClick={handleEdit}
											className="bg-green-600 hover:bg-green-700">
											<Check className="mr-1 h-3 w-3" />
											Save
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setIsEditing(false)}
											className="border-gray-600 text-gray-300 hover:bg-gray-800">
											<X className="mr-1 h-3 w-3" />
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<p className="text-gray-300 leading-relaxed">
									{comment.content}
								</p>
							)}
						</div>

						<div className="ml-13 flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onVoteComment(comment._id, 'upvote')}
										disabled={!user || votingState[comment._id]}
										className={`p-2 rounded-lg transition-all duration-200 ${
											comment.userVote === 'upvote'
												? 'text-green-400 bg-green-500/20 hover:bg-green-500/30'
												: 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
										}`}>
										{votingState[comment._id] ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<ThumbsUp className="h-4 w-4" />
										)}
									</Button>
									<span className="text-sm font-medium text-gray-300 min-w-[1rem] text-center">
										{(comment.votes?.upvotes || 0) -
											(comment.votes?.downvotes || 0)}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onVoteComment(comment._id, 'downvote')}
										disabled={!user || votingState[comment._id]}
										className={`p-2 rounded-lg transition-all duration-200 ${
											comment.userVote === 'downvote'
												? 'text-red-400 bg-red-500/20 hover:bg-red-500/30'
												: 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
										}`}>
										<ThumbsDown className="h-4 w-4" />
									</Button>
								</div>
								{canNest && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleStartReply}
										disabled={!user}
										className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all duration-200">
										<Reply className="mr-2 h-4 w-4" />
										Reply
									</Button>
								)}
							</div>
							{comment.replies && comment.replies.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowReplies(!showReplies)}
									className="text-gray-400 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200">
									{showReplies ? (
										<>
											<ChevronUp className="mr-1 h-4 w-4" />
											Hide {comment.replies.length}{' '}
											{comment.replies.length === 1 ? 'reply' : 'replies'}
										</>
									) : (
										<>
											<ChevronDown className="mr-1 h-4 w-4" />
											Show {comment.replies.length}{' '}
											{comment.replies.length === 1 ? 'reply' : 'replies'}
										</>
									)}
								</Button>
							)}
						</div>
						{isReplying && (
							<div className="ml-13">
								<ReplyForm
									onSubmit={handleReply}
									onCancel={() => setIsReplying(false)}
									isSubmitting={false}
								/>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
			{showReplies && comment.replies && comment.replies.length > 0 && (
				<div className="mt-4 space-y-4">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply._id}
							comment={reply}
							level={level + 1}
							toolId={toolId}
							onVoteComment={onVoteComment}
							onReply={onReply}
							onEdit={onEdit}
							onDelete={onDelete}
							onReport={onReport}
							votingState={votingState}
						/>
					))}
				</div>
			)}
		</motion.div>
	);
}

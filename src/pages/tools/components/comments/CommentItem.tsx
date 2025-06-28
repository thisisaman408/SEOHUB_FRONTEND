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
import {
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

	return (
		<div className={`${level > 0 ? 'ml-8 border-l pl-4' : ''} space-y-4`}>
			<Card>
				<CardContent className="p-4">
					<div className="flex items-start gap-3">
						<Avatar className="h-8 w-8">
							<AvatarImage src={comment.user.companyLogoUrl} />
							<AvatarFallback>
								{comment.user.companyName?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-2">
							<div className="flex items-center gap-2">
								<span className="font-medium">
									{comment.user.companyName || 'Anonymous User'}
								</span>
								{comment.isEdited && (
									<Badge variant="secondary" className="text-xs">
										edited
									</Badge>
								)}
								<span className="text-sm text-muted-foreground">
									{formatDistanceToNow(new Date(comment.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>

							{isEditing ? (
								<div className="space-y-2">
									<Textarea
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className="min-h-[60px]"
										placeholder="Edit your comment..."
									/>
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={handleEdit}
											disabled={!editText.trim()}>
											Save
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setIsEditing(false);
												setEditText(comment.content);
											}}>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<p className="text-sm whitespace-pre-wrap">{comment.content}</p>
							)}

							<div className="flex items-center gap-4">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onVoteComment(comment._id, 'upvote')}
									disabled={!user || votingState[comment._id]}
									className="flex items-center gap-1 hover:bg-green-50">
									{votingState[comment._id] ? (
										<Loader2 className="h-3 w-3 animate-spin" />
									) : (
										<ThumbsUp className="h-3 w-3" />
									)}
									{comment.votes?.upvotes || 0}
								</Button>

								<Button
									variant="ghost"
									size="sm"
									onClick={() => onVoteComment(comment._id, 'downvote')}
									disabled={!user || votingState[comment._id]}
									className="flex items-center gap-1 hover:bg-red-50">
									{votingState[comment._id] ? (
										<Loader2 className="h-3 w-3 animate-spin" />
									) : (
										<ThumbsDown className="h-3 w-3" />
									)}
									{comment.votes?.downvotes || 0}
								</Button>

								{user && level < 3 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleStartReply}
										className="flex items-center gap-1">
										<Reply className="h-3 w-3" />
										Reply
									</Button>
								)}

								{(comment.replyCount > 0 ||
									(comment.replies && comment.replies.length > 0)) && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowReplies(!showReplies)}
										className="flex items-center gap-1">
										{showReplies ? (
											<ChevronUp className="h-3 w-3" />
										) : (
											<ChevronDown className="h-3 w-3" />
										)}
										{comment.replyCount || comment.replies?.length || 0}{' '}
										{(comment.replyCount || comment.replies?.length || 0) === 1
											? 'reply'
											: 'replies'}
									</Button>
								)}

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											<MoreHorizontal className="h-3 w-3" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{isOwner && (
											<>
												<DropdownMenuItem onClick={() => setIsEditing(true)}>
													<Edit className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => onDelete(comment._id)}
													className="text-destructive">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</>
										)}
										{!isOwner && user && (
											<DropdownMenuItem onClick={() => onReport(comment._id)}>
												<Flag className="h-4 w-4 mr-2" />
												Report
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Reply form */}
			{isReplying && (
				<ReplyForm
					onSubmit={handleReply}
					onCancel={() => setIsReplying(false)}
					isSubmitting={false}
					initialValue={`@${comment.user.companyName || 'User'} `}
				/>
			)}

			{/* Nested replies */}
			{showReplies && comment.replies && comment.replies.length > 0 && (
				<div className="space-y-4">
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
		</div>
	);
}

// src/pages/tools/components/comments/types.ts
import { type Comment } from '@/lib/types';

export interface CommentSectionProps {
  toolId: string;
}

export interface CommentItemProps {
  comment: Comment;
  level?: number;
  toolId: string;
  onVoteComment: (commentId: string, voteType: 'upvote' | 'downvote') => void;
  onReply: (commentId: string, userName: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
  votingState: Record<string, boolean>;
}

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
  buttonText?: string;
}

export interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialValue?: string;
  autoFocus?: boolean;
}

export interface ReportDialogProps {
  open: boolean;
  commentId: string | null;
  onClose: () => void;
  onReport: (commentId: string, reason: string, description?: string) => void;
}

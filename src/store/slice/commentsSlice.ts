import { createComment, deleteComment, getComments, updateComment } from '@/lib/api';
import { type Comment, type CommentResponse } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CommentsState {
    commentsByTool: Record<string, Comment[]>;
    paginationByTool: Record<string, CommentResponse['pagination']>;
    isLoading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    commentsByTool: {},
    paginationByTool: {},
    isLoading: false,
    error: null,
};

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async ({ toolId, page = 1, limit = 20, sort = 'newest' }: {
        toolId: string;
        page?: number;
        limit?: number;
        sort?: 'newest' | 'oldest' | 'popular';
    }) => {
        const response = await getComments(toolId, { page, limit, sort });
        return { toolId, ...response };
    }
);

export const createCommentThunk = createAsyncThunk(
    'comments/createComment',
    async ({ toolId, content, parentComment }: {
        toolId: string;
        content: string;
        parentComment?: string;
    }) => {
        const response = await createComment(toolId, { content, parentComment });
        return { toolId, comment: response };
    }
);

// ✅ Added missing updateComment thunk
export const updateCommentThunk = createAsyncThunk(
    'comments/updateComment',
    async ({ toolId, commentId, content }: {
        toolId: string;
        commentId: string;
        content: string;
    }) => {
        const response = await updateComment(toolId, commentId, { content });
        return { toolId, commentId, comment: response };
    }
);

export const deleteCommentThunk = createAsyncThunk(
    'comments/deleteComment',
    async ({ toolId, commentId }: {
        toolId: string;
        commentId: string;
    }) => {
        await deleteComment(toolId, commentId);
        return { toolId, commentId };
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<{ toolId: string; comment: Comment }>) => {
            const { toolId, comment } = action.payload;
            if (!state.commentsByTool[toolId]) {
                state.commentsByTool[toolId] = [];
            }
            state.commentsByTool[toolId].unshift(comment);
            
            if (state.paginationByTool[toolId]) {
                state.paginationByTool[toolId].totalComments += 1;
            }
        },
        removeComment: (state, action: PayloadAction<{ toolId: string; commentId: string }>) => {
            const { toolId, commentId } = action.payload;
            if (state.commentsByTool[toolId]) {
                state.commentsByTool[toolId] = state.commentsByTool[toolId].filter(
                    comment => comment._id !== commentId
                );
                
                if (state.paginationByTool[toolId]) {
                    state.paginationByTool[toolId].totalComments -= 1;
                }
            }
        },
        updateCommentContent: (state, action: PayloadAction<{
            toolId: string;
            commentId: string;
            content: string;
        }>) => {
            const { toolId, commentId, content } = action.payload;
            const comments = state.commentsByTool[toolId];
            if (comments) {
                const comment = comments.find(c => c._id === commentId);
                if (comment) {
                    comment.content = content;
                    comment.isEdited = true;
                }
            }
        },
        updateCommentVotes: (state, action: PayloadAction<{
            toolId: string;
            commentId: string;
            votes: { upvotes: number; downvotes: number };
        }>) => {
            const { toolId, commentId, votes } = action.payload;
            const comments = state.commentsByTool[toolId];
            if (comments) {
                const comment = comments.find(c => c._id === commentId);
                if (comment) {
                    comment.votes = votes;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.isLoading = false;
                const { toolId, comments, pagination } = action.payload;
                state.commentsByTool[toolId] = comments;
                state.paginationByTool[toolId] = pagination;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch comments';
            })
            .addCase(createCommentThunk.fulfilled, (state, action) => {
                const { toolId, comment } = action.payload;
                if (!state.commentsByTool[toolId]) {
                    state.commentsByTool[toolId] = [];
                }
                state.commentsByTool[toolId].unshift(comment);
                
                if (state.paginationByTool[toolId]) {
                    state.paginationByTool[toolId].totalComments += 1;
                }
            })
            .addCase(updateCommentThunk.fulfilled, (state, action) => {
                const { toolId, commentId, comment } = action.payload;
                const comments = state.commentsByTool[toolId];
                if (comments) {
                    const index = comments.findIndex(c => c._id === commentId);
                    if (index !== -1) {
                        comments[index] = comment;
                    }
                }
            })
            .addCase(deleteCommentThunk.fulfilled, (state, action) => {
                const { toolId, commentId } = action.payload;
                if (state.commentsByTool[toolId]) {
                    state.commentsByTool[toolId] = state.commentsByTool[toolId].filter(
                        comment => comment._id !== commentId
                    );
                    
                    if (state.paginationByTool[toolId]) {
                        state.paginationByTool[toolId].totalComments -= 1;
                    }
                }
            });
    },
});

export const { addComment, removeComment, updateCommentContent, updateCommentVotes } = commentsSlice.actions;
export default commentsSlice.reducer;

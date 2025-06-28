import {
    getAdminStats,
    getAllToolsAdmin,
    getApprovedTools,
    getCommentById,
    getPendingTools,
    getRejectedTools,
    getReportedComments,
    moderateComment
} from '@/lib/api';
import { type AdminStats, type Comment, type Tool } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  tools: Tool[];
  comments: Comment[];
  selectedComment: Comment | null;
  stats: AdminStats | null;
  isLoading: boolean;
  isCommentsLoading: boolean;
  isModerating: string | null;
  error: string | null;
}

const initialState: AdminState = {
  tools: [],
  comments: [],
  selectedComment: null,
  stats: null,
  isLoading: false,
  isCommentsLoading: false,
  isModerating: null,
  error: null,
};

export const fetchAdminTools = createAsyncThunk(
  'admin/fetchTools',
  async () => {
    const response = await getAllToolsAdmin();
    return response;
  }
);

export const fetchPendingTools = createAsyncThunk(
  'admin/fetchPendingTools',
  async () => {
    const response = await getPendingTools();
    return response;
  }
);

export const fetchApprovedTools = createAsyncThunk(
  'admin/fetchApprovedTools',
  async () => {
    const response = await getApprovedTools();
    return response;
  }
);

export const fetchRejectedTools = createAsyncThunk(
  'admin/fetchRejectedTools',
  async () => {
    const response = await getRejectedTools();
    return response;
  }
);

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    const response = await getAdminStats();
    return response;
  }
);

export const fetchReportedComments = createAsyncThunk(
  'admin/fetchReportedComments',
  async () => {
    const response = await getReportedComments();
    return response;
  }
);

export const fetchCommentById = createAsyncThunk(
  'admin/fetchCommentById',
  async (commentId: string) => {
    const response = await getCommentById(commentId);
    return response;
  }
);

export const moderateCommentThunk = createAsyncThunk(
  'admin/moderateComment',
  async ({ commentId, status }: { commentId: string; status: 'approved' | 'rejected' }) => {
    const response = await moderateComment(commentId, status);
    return { commentId, status, response };
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateToolStatus: (state, action: PayloadAction<{
      toolId: string;
      status?: 'pending' | 'approved' | 'rejected';
      isFeatured?: boolean;
    }>) => {
      const { toolId, status, isFeatured } = action.payload;
      const tool = state.tools.find(t => t._id === toolId);
      if (tool) {
        if (status !== undefined) tool.status = status;
        if (isFeatured !== undefined) tool.isFeatured = isFeatured;
      }
    },
    removeTool: (state, action: PayloadAction<string>) => {
      const toolId = action.payload;
      state.tools = state.tools.filter(t => t._id !== toolId);
    },
    clearSelectedComment: (state) => {
      state.selectedComment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTools.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTools.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tools = action.payload;
      })
      .addCase(fetchAdminTools.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch admin tools';
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchReportedComments.pending, (state) => {
        state.isCommentsLoading = true;
        state.error = null;
      })
      .addCase(fetchReportedComments.fulfilled, (state, action) => {
        state.isCommentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchReportedComments.rejected, (state, action) => {
        state.isCommentsLoading = false;
        state.error = action.error.message || 'Failed to fetch reported comments';
      })
      .addCase(fetchCommentById.fulfilled, (state, action) => {
        state.selectedComment = action.payload;
      })
      .addCase(moderateCommentThunk.pending, (state, action) => {
        state.isModerating = action.meta.arg.commentId;
      })
      .addCase(moderateCommentThunk.fulfilled, (state, action) => {
        state.isModerating = null;
        // Remove moderated comment from list
        state.comments = state.comments.filter(comment => comment._id !== action.payload.commentId);
        // Clear selected comment if it was the moderated one
        if (state.selectedComment?._id === action.payload.commentId) {
          state.selectedComment = null;
        }
      })
      .addCase(moderateCommentThunk.rejected, (state) => {
        state.isModerating = null;
      });
  },
});

export const { updateToolStatus, removeTool, clearSelectedComment } = adminSlice.actions;
export default adminSlice.reducer;

import { getToolMedia } from '@/lib/api';
import { type ToolMedia } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MediaState {
    mediaByTool: Record<string, ToolMedia[]>;
    isLoading: boolean;
    error: string | null;
}

const initialState: MediaState = {
    mediaByTool: {},
    isLoading: false,
    error: null,
};

export const fetchToolMedia = createAsyncThunk(
    'media/fetchToolMedia',
    async ({ toolId, category, type }: {
        toolId: string;
        category?: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
        type?: 'image' | 'video' | 'document';
    }) => {
        const response = await getToolMedia(toolId, { category, type });
        return { toolId, media: response };
    }
);

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        addMedia: (state, action: PayloadAction<{ toolId: string; media: ToolMedia }>) => {
            const { toolId, media } = action.payload;
            if (!state.mediaByTool[toolId]) {
                state.mediaByTool[toolId] = [];
            }
            state.mediaByTool[toolId].push(media);
        },
        removeMedia: (state, action: PayloadAction<{ toolId: string; mediaId: string }>) => {
            const { toolId, mediaId } = action.payload;
            if (state.mediaByTool[toolId]) {
                state.mediaByTool[toolId] = state.mediaByTool[toolId].filter(
                    media => media._id !== mediaId
                );
            }
        },
        updateMedia: (state, action: PayloadAction<{ toolId: string; media: ToolMedia }>) => {
            const { toolId, media } = action.payload;
            if (state.mediaByTool[toolId]) {
                const index = state.mediaByTool[toolId].findIndex(m => m._id === media._id);
                if (index !== -1) {
                    state.mediaByTool[toolId][index] = media;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchToolMedia.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchToolMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                const { toolId, media } = action.payload;
                state.mediaByTool[toolId] = media;
            })
            .addCase(fetchToolMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch media';
            });
    },
});

export const { addMedia, removeMedia, updateMedia } = mediaSlice.actions;
export default mediaSlice.reducer;

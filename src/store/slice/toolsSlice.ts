import { getAllTools, getToolBySlug, rateTool, searchToolsWithAI } from '@/lib/api';
import { type SearchFilters, type SearchResponse, type Tool } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface EditModalData {
  isEditing: boolean;
  formData: {
    name: string;
    tagline: string;
    description: string;
    websiteUrl: string;
  };
  logoFile: File | null;
  logoPreview: string | null;
}

interface ToolsState {
  allTools: Tool[];
  searchResults: Tool[];
  featuredTools: Tool[];
  currentTool: Tool | null;
  searchTerm: string;
  searchPagination: SearchResponse['data']['pagination'] | null;
  searchMeta: SearchResponse['data']['searchMeta'] | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  editModalData: EditModalData;
  isEditModalLoading: boolean;
}

const initialState: ToolsState = {
  allTools: [],
  searchResults: [],
  featuredTools: [],
  currentTool: null,
  searchTerm: '',
  searchPagination: null,
  searchMeta: null,
  isLoading: false,
  isSearching: false,
  error: null,
  editModalData: {
    isEditing: false,
    formData: {
      name: '',
      tagline: '',
      description: '',
      websiteUrl: '',
    },
    logoFile: null,
    logoPreview: null,
  },
  isEditModalLoading: false,
};

// Async Thunks
export const fetchAllTools = createAsyncThunk(
  'tools/fetchAllTools',
  async () => {
    const response = await getAllTools();
    return response;
  }
);

export const fetchToolBySlug = createAsyncThunk(
  'tools/fetchToolBySlug',
  async (slug: string) => {
    const response = await getToolBySlug(slug);
    return response;
  }
);

export const performSearch = createAsyncThunk(
  'tools/performSearch',
  async ({
    searchTerm,
    filters = {},
    page = 1,
    limit = 20
  }: {
    searchTerm: string;
    filters?: SearchFilters;
    page?: number;
    limit?: number;
  }) => {
    const response: SearchResponse = await searchToolsWithAI(searchTerm, filters, page, limit);
    return {
      results: response.data.tools,
      searchTerm,
      pagination: response.data.pagination,
      searchMeta: response.data.searchMeta
    };
  }
);

export const submitRating = createAsyncThunk(
  'tools/submitRating',
  async ({ toolId, rating }: { toolId: string; rating: number }) => {
    const response = await rateTool(toolId, rating);
    return { toolId, ...response };
  }
);

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchTerm = '';
      state.searchPagination = null;
      state.searchMeta = null;
    },
    updateToolRating: (state, action: PayloadAction<{
      toolId: string;
      averageRating: number;
      numberOfRatings: number;
    }>) => {
      const { toolId, averageRating, numberOfRatings } = action.payload;
      
      const toolIndex = state.allTools.findIndex(tool => tool._id === toolId);
      if (toolIndex !== -1) {
        state.allTools[toolIndex].averageRating = averageRating;
        state.allTools[toolIndex].numberOfRatings = numberOfRatings;
      }

      const searchIndex = state.searchResults.findIndex(tool => tool._id === toolId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].averageRating = averageRating;
        state.searchResults[searchIndex].numberOfRatings = numberOfRatings;
      }

      const featuredIndex = state.featuredTools.findIndex(tool => tool._id === toolId);
      if (featuredIndex !== -1) {
        state.featuredTools[featuredIndex].averageRating = averageRating;
        state.featuredTools[featuredIndex].numberOfRatings = numberOfRatings;
      }

      if (state.currentTool && state.currentTool._id === toolId) {
        state.currentTool.averageRating = averageRating;
        state.currentTool.numberOfRatings = numberOfRatings;
      }
    },
    setEditModalData: (state, action: PayloadAction<EditModalData>) => {
      state.editModalData = action.payload;
    },
    setEditModalLoading: (state, action: PayloadAction<boolean>) => {
      state.isEditModalLoading = action.payload;
    },
    updateToolInStore: (state, action: PayloadAction<Tool>) => {
      const updatedTool = action.payload;
      
      const allToolsIndex = state.allTools.findIndex(tool => tool._id === updatedTool._id);
      if (allToolsIndex !== -1) {
        state.allTools[allToolsIndex] = updatedTool;
      }

      const searchIndex = state.searchResults.findIndex(tool => tool._id === updatedTool._id);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex] = updatedTool;
      }

      const featuredIndex = state.featuredTools.findIndex(tool => tool._id === updatedTool._id);
      if (featuredIndex !== -1) {
        state.featuredTools[featuredIndex] = updatedTool;
      }

      if (state.currentTool && state.currentTool._id === updatedTool._id) {
        state.currentTool = updatedTool;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTools.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTools.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTools = action.payload;
        state.featuredTools = action.payload.filter(tool => tool.isFeatured);
        // When fetching all tools, also update search results if no search term
        if (!state.searchTerm) {
          state.searchResults = action.payload;
        }
      })
      .addCase(fetchAllTools.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tools';
      })
      .addCase(fetchToolBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchToolBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTool = action.payload;
      })
      .addCase(fetchToolBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tool';
      })
      .addCase(performSearch.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.results;
        state.searchTerm = action.payload.searchTerm;
        state.searchPagination = action.payload.pagination;
        state.searchMeta = action.payload.searchMeta;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        const { toolId, averageRating, numberOfRatings } = action.payload;
        toolsSlice.caseReducers.updateToolRating(state, {
          type: 'tools/updateToolRating',
          payload: { toolId, averageRating, numberOfRatings }
        });
      });
  },
});

export const { 
  setSearchTerm, 
  clearSearch, 
  updateToolRating,
  setEditModalData,
  setEditModalLoading,
  updateToolInStore
} = toolsSlice.actions;

export default toolsSlice.reducer;

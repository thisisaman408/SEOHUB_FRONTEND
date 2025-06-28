import { type Tool } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeModal: 'login' | 'signup' | 'toolDetail' | null;
  selectedTool: Tool | null;
  isConfirmDialogOpen: boolean;
  confirmDialogProps: {
    title: string;
    description: string;
    onConfirm: (() => void) | null;
  };
  newsletterEmail: string;
  isSubscribing: boolean;
}

const initialState: UIState = {
  activeModal: null,
  selectedTool: null,
  isConfirmDialogOpen: false,
  confirmDialogProps: {
    title: '',
    description: '',
    onConfirm: null,
  },
  newsletterEmail: '',
  isSubscribing: false,
};

export const subscribeToNewsletter = createAsyncThunk(
  'ui/subscribeToNewsletter',
  async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { email, success: true };
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ modal: 'login' | 'signup' | 'toolDetail'; tool?: Tool }>) => {
      state.activeModal = action.payload.modal;
      if (action.payload.tool) {
        state.selectedTool = action.payload.tool;
      }
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.selectedTool = null;
    },
    openConfirmDialog: (state, action: PayloadAction<{
      title: string;
      description: string;
      onConfirm: () => void;
    }>) => {
      state.isConfirmDialogOpen = true;
      state.confirmDialogProps = action.payload;
    },
    closeConfirmDialog: (state) => {
      state.isConfirmDialogOpen = false;
      state.confirmDialogProps = {
        title: '',
        description: '',
        onConfirm: null,
      };
    },
    setNewsletterEmail: (state, action: PayloadAction<string>) => {
      state.newsletterEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.isSubscribing = true;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.isSubscribing = false;
        state.newsletterEmail = '';
      })
      .addCase(subscribeToNewsletter.rejected, (state) => {
        state.isSubscribing = false;
      });
  },
});

export const { 
  openModal, 
  closeModal, 
  openConfirmDialog, 
  closeConfirmDialog, 
  setNewsletterEmail 
} = uiSlice.actions;

export default uiSlice.reducer;

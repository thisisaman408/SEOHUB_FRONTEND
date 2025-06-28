import { updateUserProfile } from '@/lib/api';
import { type User } from '@/lib/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;

	isUpdatingProfile: boolean;
}

const initialState: AuthState = {
	user: (() => {
		try {
			const savedUser = localStorage.getItem('user');
			return savedUser ? JSON.parse(savedUser) : null;
		} catch {
			return null;
		}
	})(),
	isLoading: false,
	error: null,
	isUpdatingProfile: false,
};

// Add profile update thunk
export const updateProfile = createAsyncThunk(
	'auth/updateProfile',
	async (formData: FormData) => {
		const response = await updateUserProfile(formData);
		return response;
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		loginSuccess: (state, action: PayloadAction<User>) => {
			state.isLoading = false;
			state.user = action.payload;
			state.error = null;
			localStorage.setItem('user', JSON.stringify(action.payload));
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		logout: (state) => {
			state.user = null;
			state.error = null;
			state.isLoading = false;
			localStorage.removeItem('user');
		},
		clearError: (state) => {
			state.error = null;
		},
		
		profileUpdateStart: (state) => {
			state.isUpdatingProfile = true;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateProfile.pending, (state) => {
				state.isUpdatingProfile = true;
				state.error = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isUpdatingProfile = false;
				state.user = action.payload;
				localStorage.setItem('user', JSON.stringify(action.payload));
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isUpdatingProfile = false;
				state.error = action.error.message || 'Failed to update profile';
			});
	},
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, profileUpdateStart } = authSlice.actions;
export default authSlice.reducer;

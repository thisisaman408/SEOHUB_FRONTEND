import { login as apiLogin, signup as apiSignup } from '@/lib/api';
import { type SignupData, type User } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	loginFailure,
	loginStart,
	loginSuccess,
	logout,
} from '@/store/slice/authSlice';
import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	login: (userData: User) => void;
	logout: () => void;
	loginWithCredentials: (email: string, password: string) => Promise<void>;
	signupWithCredentials: (userData: SignupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const dispatch = useAppDispatch();
	const { user, isLoading, error } = useAppSelector((state) => state.auth);

	const login = (userData: User) => {
		dispatch(loginSuccess(userData));
	};

	const handleLogout = () => {
		dispatch(logout());
	};

	const loginWithCredentials = async (email: string, password: string) => {
		dispatch(loginStart());
		try {
			const response = await apiLogin({ email, password });
			dispatch(loginSuccess(response));
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed';
			dispatch(loginFailure(errorMessage));
			throw error;
		}
	};

	const signupWithCredentials = async (userData: SignupData) => {
		dispatch(loginStart());
		try {
			const response = await apiSignup(userData);
			dispatch(loginSuccess(response));
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Signup failed';
			dispatch(loginFailure(errorMessage));
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				error,
				login,
				logout: handleLogout,
				loginWithCredentials,
				signupWithCredentials,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

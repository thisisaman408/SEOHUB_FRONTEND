import { type AuthContextType, type User } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
// Create the context. It will hold the auth state and functions.
const AuthContext = createContext<AuthContextType | null>(null);

// Create the AuthProvider component. It will wrap the application.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// On initial app load, try to load the user from localStorage.
	useEffect(() => {
		try {
			const storedUser = localStorage.getItem('user');
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		} catch (error) {
			console.error('Failed to parse user from localStorage', error);
			localStorage.removeItem('user');
		} finally {
			setIsLoading(false); // Finished loading phase
		}
	}, []);

	// Login: saves user data to state and localStorage.
	const login = (userData: User) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};

	// Logout: clears user data from state and localStorage.
	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	// While checking localStorage, don't render children to avoid UI flicker.
	if (isLoading) {
		return null;
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook for easy access to the auth context.
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

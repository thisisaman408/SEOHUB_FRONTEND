import { type AuthContextType, type User } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
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
			setIsLoading(false);
		}
	}, []);
	const login = (userData: User) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};
	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};
	if (isLoading) {
		return null;
	}
	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

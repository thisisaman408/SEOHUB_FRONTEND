import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { type User } from '@/lib/types';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

export function AppLayout() {
	const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(
		null
	);
	const { login } = useAuth();
	const navigate = useNavigate();
	const handleLoginSuccess = (userData: User) => {
		login(userData);
		setActiveModal(null);
		navigate('/my-tools');
	};
	const handleSignupSuccess = (userData: User) => {
		login(userData);
		setActiveModal(null);
		navigate('/submit-tool');
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header
				onShowLogin={() => setActiveModal('login')}
				onShowSignup={() => setActiveModal('signup')}
			/>
			<main className="flex-grow">
				<Outlet />
			</main>
			<Footer />
			{activeModal === 'login' && (
				<LoginPage
					onClose={() => setActiveModal(null)}
					onShowSignup={() => setActiveModal('signup')}
					onLoginSuccess={handleLoginSuccess}
				/>
			)}

			{activeModal === 'signup' && (
				<SignupPage
					onClose={() => setActiveModal(null)}
					onShowLogin={() => setActiveModal('login')}
					onSignupSuccess={handleSignupSuccess}
				/>
			)}
		</div>
	);
}

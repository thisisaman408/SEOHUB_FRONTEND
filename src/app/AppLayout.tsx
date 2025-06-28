// src/app/AppLayout.tsx
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { type User } from '@/lib/types';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginDialog';
import { SignupPage } from '../pages/auth/SignupDialog';

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

	const handleOpenLogin = () => {
		setActiveModal('login');
	};

	const handleOpenSignup = () => {
		setActiveModal('signup');
	};

	const handleCloseModal = () => {
		setActiveModal(null);
	};

	const handleShowSignup = () => {
		setActiveModal('signup');
	};

	const handleShowLogin = () => {
		setActiveModal('login');
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />

			<main className="flex-1">
				<Outlet />
			</main>

			<Footer />
			{activeModal === 'login' && (
				<LoginPage
					onShowSignup={handleShowSignup}
					onLoginSuccess={handleLoginSuccess}
					onClose={handleCloseModal}
				/>
			)}
			{activeModal === 'signup' && (
				<SignupPage
					onShowLogin={handleShowLogin}
					onSignupSuccess={handleSignupSuccess}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	);
}

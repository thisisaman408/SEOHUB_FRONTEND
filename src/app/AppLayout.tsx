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
		console.log('Opening login modal'); // Debug log
		setActiveModal('login');
	};

	const handleOpenSignup = () => {
		console.log('Opening signup modal'); // Debug log
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
		<div className="min-h-screen flex flex-col bg-gray-950">
			<Header onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />

			{/* Login Modal */}
			<LoginPage
				isOpen={activeModal === 'login'}
				onShowSignup={handleShowSignup}
				onLoginSuccess={handleLoginSuccess}
				onClose={handleCloseModal}
			/>

			{/* Signup Modal */}
			<SignupPage
				isOpen={activeModal === 'signup'}
				onShowLogin={handleShowLogin}
				onSignupSuccess={handleSignupSuccess}
				onClose={handleCloseModal}
			/>
		</div>
	);
}

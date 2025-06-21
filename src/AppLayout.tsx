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
	const { login } = useAuth(); // Get the login function from our context
	const navigate = useNavigate();

	// This function will be called by the LoginPage on success
	const handleLoginSuccess = (userData: User) => {
		login(userData); // 1. Update the global state
		setActiveModal(null); // 2. Close the modal
		navigate('/my-tools'); // 3. Redirect to the user's dashboard
	};

	// This function will be called by the SignupPage on success
	const handleSignupSuccess = (userData: User) => {
		login(userData); // 1. Update the global state
		setActiveModal(null); // 2. Close the modal
		navigate('/submit-tool'); // 3. Redirect to the submit tool page
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* The Header component will now automatically update when the 'user' in AuthContext changes */}
			<Header
				onShowLogin={() => setActiveModal('login')}
				onShowSignup={() => setActiveModal('signup')}
			/>
			<main className="flex-grow">
				<Outlet />
			</main>
			<Footer />

			{/* The login and signup modals are controlled here */}
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

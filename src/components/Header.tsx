import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { UserNav } from './UserNav';

interface HeaderProps {
	onShowLogin: () => void;
	onShowSignup: () => void;
}

export function Header({ onShowLogin, onShowSignup }: HeaderProps) {
	const { user } = useAuth();

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
			<div className="container flex h-16 items-center justify-between">
				<Link to="/" className="flex items-center space-x-2 ml-10 sm:ml-30">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-6 w-6 text-primary">
						<path d="M12 2L2 7l10 5 10-5-10-5z" />
						<path d="M2 17l10 5 10-5" />
						<path d="M2 12l10 5 10-5" />
					</svg>
					<span className="inline-block font-bold">GT Motion</span>
				</Link>

				<div className="flex items-center">
					{user ? (
						<UserNav />
					) : (
						<nav className="flex items-center space-x-2">
							<Button onClick={onShowLogin} variant="outline">
								Login
							</Button>
							<Button onClick={onShowSignup}>Sign Up to List</Button>
						</nav>
					)}
				</div>
			</div>
		</header>
	);
}

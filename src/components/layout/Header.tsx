import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { Link } from 'react-router-dom';
import { UserNav } from './UserNav';

interface HeaderProps {
	onOpenLogin: () => void;
	onOpenSignup: () => void;
}

export function Header({ onOpenLogin, onOpenSignup }: HeaderProps) {
	const { user } = useAppSelector((state) => state.auth);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<Link to="/" className="flex items-center space-x-2">
						<div className="h-8 w-8 rounded-lg bg-primary" />
						<span className="text-xl font-bold text-foreground">GT Motion</span>
					</Link>
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground transition-colors">
							Home
						</Link>
						<Link
							to="/tools"
							className="text-muted-foreground hover:text-foreground transition-colors">
							Browse Tools
						</Link>
						<Link
							to="/submit-tool"
							className="text-muted-foreground hover:text-foreground transition-colors">
							Submit Tool
						</Link>
						<Link
							to="/about"
							className="text-muted-foreground hover:text-foreground transition-colors">
							About
						</Link>
					</nav>

					{/* Auth Section */}
					<div className="flex items-center space-x-4">
						{user ? (
							<UserNav />
						) : (
							<>
								<Button variant="ghost" onClick={onOpenLogin}>
									Log in
								</Button>
								<Button onClick={onOpenSignup}>Sign up</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

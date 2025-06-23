import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import {
	LifeBuoy,
	LogOut,
	Settings,
	Star,
	User as UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	if (!user) return null;

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10 border">
						<AvatarImage
							src={user.companyLogoUrl || ''}
							alt={user.companyName}
						/>
						<AvatarFallback>
							{user.companyName?.[0]?.toUpperCase() ?? 'U'}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.companyName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={() => navigate('/profile')}>
					<UserIcon className="mr-2 h-4 w-4" />
					<span>My Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => navigate('/my-tools')}>
					<Settings className="mr-2 h-4 w-4" />
					<span>My Tools</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => navigate('/submit-tool')}>
					<Star className="mr-2 h-4 w-4" />
					<span>Submit New Tool</span>
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<LifeBuoy className="mr-2 h-4 w-4" />
					<span>Support</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

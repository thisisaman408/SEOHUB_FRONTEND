export interface Tool {
	_id: string;
	name: string;
	tagline: string;
	description: string;
	websiteUrl: string;
    logoUrl?: string;
	tags: string[];
	appStoreUrl?: string;
	playStoreUrl?: string;
	status: 'pending' | 'approved' | 'rejected';
	isFeatured: boolean;
	submittedBy?: {
		_id?: string;
		companyName?: string;
	};
	visual?: {
		type?: string;
		color?: string;
		content?: {
			icon?: string;
			text?: string;
		}[];
	};
	createdAt: string;
	updatedAt: string;
	totalRatingSum: number;
    numberOfRatings: number;
    averageRating: number;
}
export interface User {
	_id: string;
	companyName: string;
	email: string;
	role: 'user' | 'admin';
    companyLogoUrl?: string; 
	createdAt: string;
	updatedAt: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface SignupData {
	companyName: string;
	email: string;
	password: string;
}

export interface SubmitToolFormData {
    name: string;
    tagline: string;
    description: string;
    websiteUrl: string;
    tags: string;
    appStoreUrl?: string;
    playStoreUrl?: string;
    visual: {
        color: string;
        content: {
            icon: string;
            text: string;
        }[];
    };
}

interface ColorStyle {
	bg: string;
	text: string;
	border: string;
	icon: string;
}

export interface ColorMap {
	[key: string]: ColorStyle;
}


export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading : boolean
}

export const colorMap: ColorMap = {
	blue: {
		bg: 'bg-blue-500/20',
		text: 'text-blue-500',
		border: 'border-blue-500',
		icon: 'text-blue-400',
	},
	green: {
		bg: 'bg-green-500/20',
		text: 'text-green-500',
		border: 'border-green-500',
		icon: 'text-green-400',
	},
	purple: {
		bg: 'bg-purple-500/20',
		text: 'text-purple-500',
		border: 'border-purple-500',
		icon: 'text-purple-400',
	},
	orange: {
		bg: 'bg-orange-500/20',
		text: 'text-orange-500',
		border: 'border-orange-500',
		icon: 'text-orange-400',
	},
	default: {
		bg: 'bg-gray-500/20',
		text: 'text-gray-500',
		border: 'border-gray-500',
		icon: 'text-gray-400',
	},
};
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

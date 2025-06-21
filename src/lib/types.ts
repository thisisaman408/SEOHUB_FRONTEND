/**
 * Represents the structure of a Tool object received from the backend API.
 * This is the single source of truth for tool data throughout the frontend.
 */
export interface Tool {
	_id: string;
	name: string;
	tagline: string;
	description: string;
	websiteUrl: string;
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

/**
 * Represents the structure of a User object.
 */
export interface User {
	_id: string;
	companyName: string;
	email: string;
	role: 'user' | 'admin';
	createdAt: string;
	updatedAt: string;
}

// --- NEW TYPES FOR API FUNCTIONS ---

/**
 * Type for user login credentials.
 */
export interface LoginCredentials {
	email: string;
	password: string;
}

/**
 * Type for new user signup data.
 */
export interface SignupData {
	companyName: string;
	email: string;
	password: string;
}

/**
 * Type for the data required to submit a new tool.
 */
export interface SubmitToolData {
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

/**
 * Type for the color map object in ToolCard.
 */
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

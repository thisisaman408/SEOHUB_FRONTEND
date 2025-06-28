
// ==================== CORE ENTITIES ====================

export interface Tool {
    _id: string;
	slug: string;
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
    
    // New analytics fields
    analytics: {
        totalViews: number;
        uniqueViews: number;
        weeklyViews: number;
        monthlyViews: number;
        lastViewedAt?: string;
    };
    
    // Comment stats
    commentStats: {
        totalComments: number;
        approvedComments: number;
        lastCommentAt?: string;
    };
    
    // Media stats
    mediaStats: {
        totalMedia: number;
        screenshots: number;
        videos: number;
    };
    relevanceScore?: number;
    semanticScore?: number;
    searchType?: 'text' | 'semantic';
    matchedFields?: string[];
    searchHighlights?: {
        field: string;
        matches: string[];
    }[];
}

export interface User {
    _id: string;
    companyName: string;
    email: string;
    role: 'user' | 'admin';
    companyLogoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    token?: string; 
}

// ==================== AUTHENTICATION ====================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    companyName: string;
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

// ==================== FORMS ====================

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

// ==================== COMMENTS ====================

export interface Comment {
    _id: string;
    tool: string | { _id: string; name: string };
    user: {
        _id: string;
        companyName: string;
        companyLogoUrl?: string;
    };
    content: string;
    parentComment?: string;
    status: 'approved' | 'pending' | 'rejected' | 'reported';
    votes: {
        upvotes: number;
        downvotes: number;
    };
    reports: CommentReport[];
    editHistory: CommentEditHistory[];
    isEdited: boolean;
    replyCount: number;
    replies?: Comment[];
    hasMoreReplies?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentReport {
    reportedBy: string;
    reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
    description?: string;
    reportedAt: string;
}

export interface CommentEditHistory {
    content: string;
    editedAt: string;
}

export interface CommentVoteResponse {
    message: string;
    action: 'added' | 'removed' | 'changed';
}

export interface CommentFormData {
    content: string;
    parentComment?: string;
}

export interface CommentReportData {
    reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
    description?: string;
}

export interface CommentFilters {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'popular';
}

export interface CommentResponse {
    comments: Comment[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalComments: number;
        hasNextPage: boolean;
    };
}

// ==================== VIEW TRACKING & ANALYTICS ====================

export interface ViewTrackingData {
    duration?: number;
    source?: 'direct' | 'search' | 'referral' | 'marketplace';
}

export interface ToolView {
    _id: string;
    tool: string;
    user?: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    viewDuration: number;
    source: 'direct' | 'search' | 'referral' | 'marketplace';
    country: string;
    createdAt: string;
    updatedAt: string;
}

export interface ToolAnalytics {
    period: string;
    totalViews: number;
    uniqueViews: number;
    weeklyViews: number;
    monthlyViews: number;
    dailyBreakdown: DailyAnalytics[];
    topCountries: CountryAnalytics[];
    lastUpdated?: string;
}

export interface DailyAnalytics {
    _id: string; // date
    totalViews: number;
    uniqueViews: number;
    avgDuration: number;
    sources: SourceAnalytics[];
    countries: string[];
}

export interface SourceAnalytics {
    source: string;
    views: number;
}

export interface CountryAnalytics {
    _id: string; 
    views: number;
}

// ==================== MEDIA ====================

export interface ToolMedia {
    _id: string;
    tool: string;
    uploadedBy: {
        _id: string;
        companyName: string;
    };
    type: 'image' | 'video' | 'document';
    category: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
    url: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    order: number;
    fileSize?: number;
    dimensions?: {
        width: number;
        height: number;
    };
    duration?: number; 
    status: 'active' | 'archived' | 'processing';
    createdAt: string;
    updatedAt: string;
}

export interface MediaUploadData {
    category: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
    title?: string;
    description?: string;
    order?: number;
}

export interface MediaUpdateData {
    title?: string;
    description?: string;
    order?: number;
    category?: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
}

export interface MediaFilters {
    category?: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
    type?: 'image' | 'video' | 'document';
}

// ==================== ADMIN ====================

export interface AdminStats {
    tools: {
        approved: number;
        pending: number;
        rejected: number;
        featured: number;
        all: number;
    };
    users: {
        total: number;
    };
}

export interface AdminActivity {
    type: 'tool_submitted' | 'tool_approved' | 'tool_rejected' | 'comment_reported' | 'user_registered';
    description: string;
    timestamp: string;
    relatedId?: string;
}

export interface CommentModerationData {
    status: 'approved' | 'rejected';
}

// ==================== UI & STYLING ====================

export interface ColorStyle {
    bg: string;
    text: string;
    border: string;
    icon: string;
}

export interface ColorMap {
    [key: string]: ColorStyle;
}

// ==================== API RESPONSES ====================
export interface RateToolResponse {
    success: boolean;
    message: string;
    averageRating: number;
    numberOfRatings: number;
    userRating?: number; // The rating the current user gave
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ==================== SEARCH & FILTERS ====================

export interface SearchFilters {
    query?: string;
    category?: string;
    isFeatured?: boolean;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'views';
    page?: number;
    limit?: number;
}

export interface SearchResult {
    tools: Tool[];
    totalCount: number;
    filters: {
        categories: string[];
        featuredCount: number;
    };
}

// ==================== NOTIFICATIONS ====================

export interface Notification {
    _id: string;
    userId: string;
    type: 'tool_approved' | 'tool_rejected' | 'comment_reply' | 'comment_vote' | 'tool_featured';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: string; // tool ID, comment ID, etc.
    createdAt: string;
}

// ==================== HOOKS & UTILITIES ====================

export interface UseToolDetailReturn {
    tool: Tool | null;
    isLoading: boolean;
    error: string | null;
    handleToolRatingUpdate: (toolId: string, newAverageRating: number, newNumberOfRatings: number) => void;
}

export interface UseCommentsReturn {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    pagination: CommentResponse['pagination'] | null;
    createComment: (content: string, parentComment?: string) => Promise<void>;
    updateComment: (commentId: string, content: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    voteComment: (commentId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
    reportComment: (commentId: string, reportData: CommentReportData) => Promise<void>;
    loadMore: () => Promise<void>;
    refreshComments: () => Promise<void>;
}

export interface UseMediaReturn {
    media: ToolMedia[];
    isLoading: boolean;
    error: string | null;
    uploadMedia: (file: File, data: MediaUploadData) => Promise<void>;
    updateMedia: (mediaId: string, data: MediaUpdateData) => Promise<void>;
    deleteMedia: (mediaId: string) => Promise<void>;
    refreshMedia: () => Promise<void>;
}

// ==================== COLOR MAP CONSTANT ====================

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

// ==================== CONSTANTS ====================

export const COMMENT_SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
] as const;

export const MEDIA_CATEGORIES = [
    { value: 'screenshot', label: 'Screenshot' },
    { value: 'demo_video', label: 'Demo Video' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'feature_highlight', label: 'Feature Highlight' },
    { value: 'logo', label: 'Logo' },
    { value: 'banner', label: 'Banner' },
] as const;

export const REPORT_REASONS = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'other', label: 'Other' },
] as const;

export const VIEW_SOURCES = [
    { value: 'direct', label: 'Direct' },
    { value: 'search', label: 'Search' },
    { value: 'referral', label: 'Referral' },
    { value: 'marketplace', label: 'Marketplace' },
] as const;

export const ANALYTICS_PERIODS = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
] as const;


//=============SEARCH==================
export interface AIQuerySuggestions {
    keywords?: string[];
    synonyms?: string[];
    categories?: string[];
    relatedTerms?: string[];
    confidence?: number;
    model?: string;
    processingTime?: number;
}

// ✅ Define enhanced query structure
export interface EnhancedQuery {
    original: string;
    expanded: string[];
    intent: 'general' | 'help_seeking' | 'recommendation' | 'creation' | 'analysis' | 'budget_conscious';
    keywords: string[];
    synonyms: string[];
    aiSuggestions?: AIQuerySuggestions; // ✅ Now properly typed instead of any
}

// ✅ Update SearchMeta interface
export interface SearchMeta {
    query: string;
    enhancedQuery?: EnhancedQuery; // ✅ Use the proper interface
    searchTime: number;
    searchType?: 'text' | 'semantic' | 'hybrid';
    totalResults?: number;
    processingTimeMs?: number;
    confidence?: number;
}

// ✅ Define search filters interface
export interface SearchFilters {
    featured?: boolean;
    category?: string;
    minRating?: number;
    maxRating?: number;
    tags?: string[];
    priceRange?: 'free' | 'paid' | 'freemium';
    sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'views';
}


export interface SearchResponse {
    success: boolean;
    data: {
        tools: Tool[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalResults: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            limit: number;
        };
        searchMeta: SearchMeta;
        suggestions?: SearchSuggestion[];
    };
    error?: string;
}

// ✅ Define search suggestion interface
export interface SearchSuggestion {
    text: string;
    type: 'query' | 'category' | 'tool' | 'intent' | 'filter';
    metadata?: {
        description?: string;
        icon?: string;
        category?: string;
        confidence?: number;
        resultCount?: number;
    };
}

export interface SearchContext {
    userHistory?: string[];
    preferences?: {
        categories: string[];
        pricePreference: 'free' | 'paid' | 'any';
        features: string[];
    };
    location?: string;
    device?: 'mobile' | 'desktop' | 'tablet';
    sessionId?: string;
}


export interface SearchAnalytics {
    query: string;
    resultsCount: number;
    clickedResults: string[];
    searchTime: number;
    userInteraction: {
        scrollDepth: number;
        timeOnResults: number;
        filtersUsed: string[];
    };
    timestamp: string;
}

export interface SemanticSearchResult {
  tool: Tool;
  score: number;
  summary: string;
  matchedFeatures: string[];
}
export type SearchIntent = EnhancedQuery['intent'];
export type SearchSortOption = SearchFilters['sortBy'];
export type ToolCategory = 'ai' | 'seo' | 'content' | 'design' | 'analytics' | 'social' | 'automation' | 'productivity' | 'ecommerce' | 'other';

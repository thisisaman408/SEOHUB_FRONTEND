import axios from 'axios';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import {
    type AdminStats,
    type Comment,
    type CommentReportData,
    type CommentVoteResponse,
    type GoogleAuthData,
    type GoogleAuthResponse,
    type LoginCredentials,
    type RateToolResponse,
    type SearchFilters,
    type SearchResponse,
    type SignupData,
    type Tool,
    type ToolAnalytics,
    type ToolMedia,
    type User,
    type ViewTrackingData,
} from './types';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==================== AUTHENTICATION ====================
export const login = async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const adminLogin = async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await api.post('/auth/admin/login', credentials);
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const signup = async (userData: SignupData): Promise<User> => {
    const { data } = await api.post('/auth/signup', userData);
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const logout = (): void => {
    localStorage.removeItem('token');
    window.location.reload();
};

// ==================== TOOLS ====================
export const getAllTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/tools');
    return data;
};

export const getFeaturedTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/tools/featured');
    return data;
};

export const getToolBySlug = async (slug: string): Promise<Tool> => {
    const { data } = await api.get(`/tools/slug/${slug}`);
    return data;
};

export const getToolById = async (toolId: string): Promise<Tool> => {
    const { data } = await api.get(`/tools/${toolId}`);
    return data;
};

export const submitTool = async (formData: FormData): Promise<Tool> => {
    const { data } = await api.post('/tools', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const updateTool = async (id: string, formData: FormData): Promise<Tool> => {
    const { data } = await api.put(`/tools/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const getMyTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/tools/my-tools');
    return data;
};

export const rateTool = async (toolId: string, rating: number): Promise<RateToolResponse> => {
    const { data } = await api.post(`/tools/${toolId}/rate`, { rating });
    return data;
};

// ==================== VIEW TRACKING ====================
export const trackView = async (
    toolId: string,
    viewData: ViewTrackingData
): Promise<{ message: string; isNewView: boolean }> => {
    const { data } = await api.post(`/tools/${toolId}/view`, viewData);
    return data;
};

export const getToolAnalytics = async (
    toolId: string,
    period: '7d' | '30d' | '90d' = '30d'
): Promise<ToolAnalytics> => {
    const { data } = await api.get(`/tools/${toolId}/analytics?period=${period}`);
    return data;
};

// ==================== COMMENTS ====================
export const getComments = async (
    toolId: string,
    params: {
        page?: number;
        limit?: number;
        sort?: 'newest' | 'oldest' | 'popular';
    } = {}
): Promise<{
    comments: Comment[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalComments: number;
        hasNextPage: boolean;
    };
}> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sort) searchParams.append('sort', params.sort);
    
    const queryString = searchParams.toString();
    const url = `/tools/${toolId}/comments${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await api.get(url);
    return data;
};

export const createComment = async (
    toolId: string,
    commentData: {
        content: string;
        parentComment?: string;
    }
): Promise<Comment> => {
    const { data } = await api.post(`/tools/${toolId}/comments`, commentData);
    return data;
};

export const updateComment = async (
    toolId: string,
    commentId: string,
    updateData: {
        content: string;
    }
): Promise<Comment> => {
    const { data } = await api.put(`/tools/${toolId}/comments/${commentId}`, updateData);
    return data;
};

export const deleteComment = async (
    toolId: string,
    commentId: string
): Promise<{ message: string }> => {
    const { data } = await api.delete(`/tools/${toolId}/comments/${commentId}`);
    return data;
};

export const voteComment = async (
    toolId: string,
    commentId: string,
    voteType: 'upvote' | 'downvote'
): Promise<CommentVoteResponse> => {
    const { data } = await api.post(`/tools/${toolId}/comments/${commentId}/vote`, {
        voteType,
    });
    return data;
};

export const reportComment = async (
    toolId: string,
    commentId: string,
    reportData: CommentReportData
): Promise<{ message: string }> => {
    const { data } = await api.post(`/tools/${toolId}/comments/${commentId}/report`, reportData);
    return data;
};

// ==================== MEDIA ====================
export const getToolMedia = async (
    toolId: string,
    params: {
        category?: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
        type?: 'image' | 'video' | 'document';
    } = {}
): Promise<ToolMedia[]> => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.type) searchParams.append('type', params.type);
    
    const queryString = searchParams.toString();
    const url = `/tools/${toolId}/media${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await api.get(url);
    return data;
};

export const uploadMedia = async (
    toolId: string,
    formData: FormData
): Promise<ToolMedia> => {
    const { data } = await api.post(`/tools/${toolId}/media`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const updateMedia = async (
    toolId: string,
    mediaId: string,
    updateData: {
        title?: string;
        description?: string;
        order?: number;
        category?: 'screenshot' | 'demo_video' | 'tutorial' | 'feature_highlight' | 'logo' | 'banner';
    }
): Promise<ToolMedia> => {
    const { data } = await api.put(`/tools/${toolId}/media/${mediaId}`, updateData);
    return data;
};

export const deleteMedia = async (
    toolId: string,
    mediaId: string
): Promise<{ message: string }> => {
    const { data } = await api.delete(`/tools/${toolId}/media/${mediaId}`);
    return data;
};

// ==================== ADMIN ====================
export const getPendingTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/pending');
    return data;
};

export const updateToolStatus = async (
    id: string,
    status: 'approved' | 'rejected',
    isFeatured: boolean
): Promise<Tool> => {
    const { data } = await api.put(`/admin/tools/${id}`, { status, isFeatured });
    return data;
};

export const deleteTool = async (id: string): Promise<void> => {
    const { data } = await api.delete(`/admin/tools/${id}`);
    return data;
};

export const getAdminStats = async (): Promise<AdminStats> => {
    const { data } = await api.get('/admin/stats');
    return data;
};

export const getApprovedTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/approved');
    return data;
};

export const getRejectedTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/rejected');
    return data;
};

export const getAllToolsAdmin = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/all');
    return data;
};

// ✅ ADMIN COMMENT MODERATION (NO DUPLICATES)
export const getReportedComments = async (): Promise<Comment[]> => {
    const { data } = await api.get('/admin/comments/reported');
    return data;
};

export const moderateComment = async (
    commentId: string,
    status: 'approved' | 'rejected'
): Promise<Comment> => {
    const { data } = await api.put(`/admin/comments/${commentId}/moderate`, { status });
    return data;
};

export const getCommentById = async (commentId: string): Promise<Comment> => {
    const { data } = await api.get(`/admin/comments/${commentId}`);
    return data;
};

// ==================== USER PROFILE ====================
export const getUserProfile = async (): Promise<User> => {
    const { data } = await api.get('/users/profile');
    return data;
};

export const updateUserProfile = async (formData: FormData): Promise<User> => {
    const { data } = await api.put('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};


// =================AI SEARCH =====================
export const searchToolsWithAI = async (
  query: string,
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse> => {
  const searchParams = new URLSearchParams();
  if (query.trim()) searchParams.append('q', query);
  if (page > 1) searchParams.append('page', page.toString());
  if (limit !== 20) searchParams.append('limit', limit.toString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(`filters[${key}]`, value.toString());
    }
  });

  const { data } = await api.get(`/tools/search/ai?${searchParams.toString()}`);
  return data;
};


export const getSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
    if (!partialQuery.trim()) return [];
    
    try {
        const { data } = await api.get(`/tools/search/suggestions?q=${encodeURIComponent(partialQuery)}`);
        return data.suggestions || [];
    } catch (error) {
        console.error('Failed to get search suggestions:', error);
        return [];
    }
};


export const trackClick = async (
	toolId: string,
	clickData: {
		clickType?: 'website' | 'app_store' | 'google_play';
		source?: 'direct' | 'search' | 'referral' | 'marketplace';
	}
): Promise<{ message: string }> => {
	const { data } = await api.post(`/tools/${toolId}/click`, clickData);
	return data;
};



export const initiateGoogleAuth = async (): Promise<GoogleAuthData> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    return {
      idToken,
      email: result.user.email!,
      name: result.user.displayName!,
      profilePicture: result.user.photoURL || undefined,
    };
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw new Error('Google authentication failed');
  }
};

export const verifyGoogleToken = async (googleAuthData: GoogleAuthData): Promise<GoogleAuthResponse> => {
  const { data } = await api.post('/auth/google/verify', googleAuthData);
  return data;
};

export const createGoogleAccount = async (accountData: {
  tempToken: string;
  companyName: string;
}): Promise<User> => {
  const { data } = await api.post('/auth/google/create-account', accountData);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const logoutGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
    logout(); 
  } catch (error) {
    console.error('Google logout error:', error);
  }
};

export default api;

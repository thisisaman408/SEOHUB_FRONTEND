// src/pages/tools/hooks/useMedia.ts
import {
    deleteMedia as apiDeleteMedia,
    updateMedia as apiUpdateMedia,
    uploadMedia as apiUploadMedia,
    getToolMedia,
} from '@/lib/api';
import { type MediaUpdateData, type MediaUploadData, type ToolMedia } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useMedia(toolId: string | undefined) {
    const [media, setMedia] = useState<ToolMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMedia = useCallback(async () => {
        if (!toolId || toolId.trim() === '') {
            setMedia([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const mediaData = await getToolMedia(toolId);
            setMedia(mediaData.sort((a, b) => a.order - b.order));
            setError(null);
        } catch (err) {
            setError('Failed to load media');
            console.log(err);
            toast.error('Failed to load media');
        } finally {
            setIsLoading(false);
        }
    }, [toolId]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const uploadMedia = async (file: File, data: MediaUploadData) => {
         if (!toolId) {
            toast.error('Tool ID is required');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('media', file);
            formData.append('category', data.category);
            if (data.title) formData.append('title', data.title);
            if (data.description) formData.append('description', data.description);
            if (data.order !== undefined) formData.append('order', data.order.toString());

            const newMedia = await apiUploadMedia(toolId, formData);
            setMedia(prev => [...prev, newMedia].sort((a, b) => a.order - b.order));
            toast.success('Media uploaded successfully!');
        } catch (err) {
            toast.error('Failed to upload media');
            throw err;
        }
    };

    const updateMedia = async (mediaId: string, data: MediaUpdateData) => {
         if (!toolId) {
            toast.error('Tool ID is required');
            return;
        }
        try {
            const updatedMedia = await apiUpdateMedia(toolId, mediaId, data);
            setMedia(prev => prev.map(item => 
                item._id === mediaId ? updatedMedia : item
            ).sort((a, b) => a.order - b.order));
            toast.success('Media updated successfully!');
        } catch (err) {
            toast.error('Failed to update media');
            throw err;
        }
    };

    const deleteMedia = async (mediaId: string) => {
         if (!toolId) {
            toast.error('Tool ID is required');
            return;
        }
        try {
            await apiDeleteMedia(toolId, mediaId);
            setMedia(prev => prev.filter(item => item._id !== mediaId));
            toast.success('Media deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete media');
            throw err;
        }
    };

   const refreshMedia = () => {
        if (toolId) {
            fetchMedia();
        }
    };

    return {
        media,
        isLoading,
        error,
        uploadMedia,
        updateMedia,
        deleteMedia,
        refreshMedia,
    };
}

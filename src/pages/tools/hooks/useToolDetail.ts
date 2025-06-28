// src/pages/tools/hooks/useToolDetail.ts
import { getToolBySlug } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useToolDetail(toolSlug: string | undefined) {
    console.log("🔵 Hook started", { toolSlug });
    const [tool, setTool] = useState<Tool | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            console.log("Inside useEffect of useToolDetail");
            if (!toolSlug) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const foundTool = await getToolBySlug(toolSlug);
                console.log("Found Tool", foundTool);
                setTool(foundTool);
            } catch (error) {
                console.error('Failed to fetch tool:', error);
                setTool(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTool();
    }, [toolSlug]);

   
    const handleToolRatingUpdate = (
        toolId: string,
        newAverageRating: number,
        newNumberOfRatings: number
    ) => {
        if (tool && tool._id === toolId) {
            setTool(prevTool => prevTool ? {
                ...prevTool,
                averageRating: newAverageRating,
                numberOfRatings: newNumberOfRatings,
            } : null);
        }
    };

    // ✅ Add refetch capability for external updates
    const refetchTool = async () => {
        if (!toolSlug) return;
        
        try {
            const foundTool = await getToolBySlug(toolSlug);
            setTool(foundTool);
        } catch (error) {
            console.error('Failed to refetch tool:', error);
        }
    };

    return {
        tool,
        isLoading,
        handleToolRatingUpdate,
        refetchTool,
    };
}

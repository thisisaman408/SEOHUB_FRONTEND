// src/pages/tools/hooks/useToolAnalytics.ts
import { getToolAnalytics } from '@/lib/api';
import { type ToolAnalytics } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useToolAnalytics(toolId: string, period: '7d' | '30d' | '90d' = '30d') {
    const [analytics, setAnalytics] = useState<ToolAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            setIsLoading(true);
            const analyticsData = await getToolAnalytics(toolId, period);
            setAnalytics(analyticsData);
            setError(null);
        } catch (err) {
            setError('Failed to load analytics');
            console.log(err)
            toast.error('Failed to load analytics');
        } finally {
            setIsLoading(false);
        }
    }, [toolId, period]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const refreshAnalytics = () => {
        fetchAnalytics();
    };

    return {
        analytics,
        isLoading,
        error,
        refreshAnalytics,
    };
}

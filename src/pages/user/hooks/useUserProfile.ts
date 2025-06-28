// src/pages/user/hooks/useUserProfile.ts
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { type User } from '@/lib/types';
import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useUserProfile() {
    const { login } = useAuth();
    const [profile, setProfile] = useState<User | null>(null); // ✅ Added proper typing
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ companyName: '' });
    const [logoFile, setLogoFile] = useState<File | null>(null); // ✅ Added proper typing
    const [logoPreview, setLogoPreview] = useState<string | null>(null); // ✅ Added proper typing
    const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ Added proper typing

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfile(data);
                setFormData({ companyName: data.companyName });
                setLogoPreview(data.companyLogoUrl || null); 
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error('Could not load profile.');
                }
            } finally {
                setIsLoading(false);
            }
        }; // ✅ Added missing closing brace

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // ✅ Fixed typing
        setFormData({ ...formData, companyName: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { // ✅ Fixed typing
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        const data = new FormData();
        data.append('companyName', formData.companyName);
        if (logoFile) {
            data.append('companyLogo', logoFile);
        }

        try {
            const updatedUser = await updateUserProfile(data);
            login(updatedUser);
            setProfile(updatedUser);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error('Failed to update profile.');
            }
        } finally {
            setIsLoading(false);
        }
    }; // ✅ Added missing closing brace

    return {
        profile,
        isLoading,
        isEditing,
        formData,
        logoPreview, // ✅ Removed logoFile since it's not used in component
        fileInputRef,
        setIsEditing,
        handleInputChange,
        handleFileChange,
        handleSaveChanges,
    };
}

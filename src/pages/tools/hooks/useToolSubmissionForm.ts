// src/pages/tools/hooks/useToolSubmissionForm.ts - Enhanced with media support
import { submitTool } from '@/lib/api';
import { type SubmitToolFormData } from '@/lib/types';
import { isAxiosError } from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MediaFile {
    id: string;
    file: File;
    preview: string;
    type: 'image' | 'video' | 'document';
    category: string;
    title: string;
    description: string;
}

export function useToolSubmissionForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
const [formData, setFormData] = useState<SubmitToolFormData>({
  name: '',
  tagline: '',
  description: '',
  websiteUrl: '',
  tags: '',
  appStoreUrl: '',
  playStoreUrl: '',
  color: 'default',
  content: [], 
  visual: { 
    color: 'default', 
    content: [] 
  },
});
    
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]); // ✅ New media files state
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { id, value } = e.target;
            
            if (id === 'content') {
              
                try {
                const contentArray = JSON.parse(value);
                setFormData(prev => ({ ...prev, content: contentArray }));
                } catch {
                // Handle parse error
                }
            } else if (id === 'color') {
                setFormData(prev => ({ ...prev, color: value }));
            } else {
                setFormData(prev => ({ ...prev, [id]: value }));
            }
};

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    // ✅ New media upload handler
    const handleMediaUpload = (files: FileList, category: string, title: string, description: string) => {
        Array.from(files).forEach((file) => {
            const id = Math.random().toString(36).substr(2, 9);
            let type: 'image' | 'video' | 'document' = 'document';
            
            if (file.type.startsWith('image/')) {
                type = 'image';
            } else if (file.type.startsWith('video/')) {
                type = 'video';
            }

            const preview = type === 'image' ? URL.createObjectURL(file) : '';

            const mediaFile: MediaFile = {
                id,
                file,
                preview,
                type,
                category,
                title,
                description,
            };

            setMediaFiles(prev => [...prev, mediaFile]);
        });
        
        toast.success(`${files.length} file(s) uploaded successfully!`);
    };

    // ✅ New media remove handler
    const handleMediaRemove = (id: string) => {
        setMediaFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove && fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter(f => f.id !== id);
        });
        toast.success('Media file removed');
    };

    const handleVisualChange = <T extends keyof SubmitToolFormData['visual']>(
        field: T,
        value: SubmitToolFormData['visual'][T]
    ) => {
        setFormData({
            ...formData,
            visual: { ...formData.visual, [field]: value },
        });
    };

    const handleInsightChange = (index: number, text: string) => {
        const newContent = [...formData.visual.content];
        newContent[index].text = text;
        handleVisualChange('content', newContent);
    };

    const addInsight = () => {
        handleVisualChange('content', [
            ...formData.visual.content,
            { icon: 'zap', text: '' },
        ]);
    };

    const removeInsight = (index: number) => {
        const newContent = formData.visual.content.filter((_, i) => i !== index);
        handleVisualChange('content', newContent);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 4) {
            console.log('Form submission prevented - not on final step');
            return;
        }
        if (!formData.name || !formData.tagline || !formData.websiteUrl) {
            toast.error('Please fill out all required fields.');
            return;
        }

        setIsLoading(true);
        const data = new FormData();
        
        // Add form data
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'visual') {
                data.append(key, JSON.stringify(value));
            } else {
                data.append(key, value as string);
            }
        });

        if (logoFile) {
            data.append('toolLogo', logoFile);
        }

        mediaFiles.forEach((mediaFile, index) => {
            data.append(`mediaFiles`, mediaFile.file);
            data.append(`mediaData_${index}`, JSON.stringify({
                category: mediaFile.category,
                title: mediaFile.title,
                description: mediaFile.description,
                type: mediaFile.type,
            }));
        });

        try {
            await submitTool(data);
            toast.success('Tool submitted for review!');
            navigate('/my-tools');
        } catch (error) {
            const message =
                isAxiosError(error) && error.response
                    ? error.response.data.message
                    : 'Submission failed. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (step === 1 && (!formData.name || !formData.tagline || !formData.description)) {
            toast.error('Please fill out the tool name, tagline, and description.');
            return;
        }

        if (step === 2 && !formData.websiteUrl) {
            toast.error('Please provide a website URL.');
            return;
        }
        setStep((prev) => prev + 1);
    };

    const prevStep = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setStep((prev) => prev - 1);
    };

    return {
        step,
        formData,
        logoPreview,
        mediaFiles, 
        isLoading,
        fileInputRef,
        handleChange,
        handleFileChange,
        handleMediaUpload, 
        handleMediaRemove, 
        handleVisualChange,
        handleInsightChange,
        addInsight,
        removeInsight,
        handleSubmit,
        nextStep,
        prevStep,
    };
}

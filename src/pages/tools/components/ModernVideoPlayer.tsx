// src/pages/tools/components/ModernVideoPlayer.tsx

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ModernVideoPlayerProps {
	src: string;
	poster?: string;
	title?: string;
	autoplay?: boolean;
}

export function ModernVideoPlayer({
	src,
	poster,
	title,
	autoplay = true,
}: ModernVideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showControls, setShowControls] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateTime = () => setCurrentTime(video.currentTime);
		const updateDuration = () => setDuration(video.duration);

		video.addEventListener('timeupdate', updateTime);
		video.addEventListener('loadedmetadata', updateDuration);
		video.addEventListener('play', () => setIsPlaying(true));
		video.addEventListener('pause', () => setIsPlaying(false));

		if (autoplay) {
			video.muted = true;
			video.play().catch(console.error);
		}

		return () => {
			video.removeEventListener('timeupdate', updateTime);
			video.removeEventListener('loadedmetadata', updateDuration);
		};
	}, [autoplay]);

	const togglePlay = () => {
		const video = videoRef.current;
		if (!video) return;

		if (isPlaying) {
			video.pause();
		} else {
			video.play();
		}
	};

	const toggleMute = () => {
		const video = videoRef.current;
		if (!video) return;

		video.muted = !video.muted;
		setIsMuted(video.muted);
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const video = videoRef.current;
		if (!video) return;

		const newTime = (parseFloat(e.target.value) / 100) * duration;
		video.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const toggleFullscreen = () => {
		const container = containerRef.current;
		if (!container) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

	return (
		<div
			ref={containerRef}
			className="relative group bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50"
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}>
			{/* Video Element */}
			<video
				ref={videoRef}
				src={src}
				poster={poster}
				className="w-full h-full object-cover"
				onClick={togglePlay}
			/>

			{/* Play Overlay */}
			{!isPlaying && (
				<motion.div
					className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<Button
						onClick={togglePlay}
						size="lg"
						className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 transition-all duration-300 transform hover:scale-110">
						<Play className="h-8 w-8 text-white ml-1" />
					</Button>
				</motion.div>
			)}

			{/* Controls Overlay */}
			<motion.div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-all duration-300 ${
					showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
				}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: showControls ? 1 : 0,
					y: showControls ? 0 : 20,
				}}>
				{/* Progress Bar */}
				<div className="mb-4">
					<input
						type="range"
						min="0"
						max="100"
						value={progressPercentage}
						onChange={handleSeek}
						className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
						style={{
							background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #4b5563 ${progressPercentage}%, #4b5563 100%)`,
						}}
					/>
				</div>

				{/* Control Buttons */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						{/* Play/Pause */}
						<Button
							onClick={togglePlay}
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20 p-2 rounded-lg">
							{isPlaying ? (
								<Pause className="h-5 w-5" />
							) : (
								<Play className="h-5 w-5" />
							)}
						</Button>

						{/* Mute/Unmute */}
						<Button
							onClick={toggleMute}
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20 p-2 rounded-lg">
							{isMuted ? (
								<VolumeX className="h-5 w-5" />
							) : (
								<Volume2 className="h-5 w-5" />
							)}
						</Button>

						{/* Time Display */}
						<span className="text-white text-sm font-medium">
							{formatTime(currentTime)} / {formatTime(duration)}
						</span>
					</div>

					<div className="flex items-center space-x-4">
						{/* Title */}
						{title && (
							<span className="text-white text-sm font-medium truncate max-w-xs">
								{title}
							</span>
						)}

						{/* Fullscreen */}
						<Button
							onClick={toggleFullscreen}
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20 p-2 rounded-lg">
							<Maximize className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

// src/pages/tools/components/ModernVideoPlayer.tsx
import { Button } from '@/components/ui/button';
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
			className="relative group bg-black rounded-lg overflow-hidden w-full max-w-4xl mx-auto"
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}>
			<div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
				<video
					ref={videoRef}
					src={src}
					poster={poster}
					className="absolute inset-0 w-full h-full object-contain"
					loop
					playsInline
					onClick={togglePlay}
				/>
				{!isPlaying && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/20">
						<Button
							size="icon"
							className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 hover:bg-white text-black"
							onClick={togglePlay}>
							<Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
						</Button>
					</div>
				)}
				<div
					className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300 ${
						showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
					}`}>
					<div className="mb-2 md:mb-4">
						<input
							type="range"
							min="0"
							max="100"
							value={progressPercentage}
							onChange={handleSeek}
							className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
							style={{
								background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, rgba(255,255,255,0.3) ${progressPercentage}%, rgba(255,255,255,0.3) 100%)`,
							}}
						/>
					</div>
					<div className="flex items-center justify-between text-sm md:text-base">
						<div className="flex items-center gap-1 md:gap-2">
							<Button
								size="icon"
								variant="ghost"
								className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
								onClick={togglePlay}>
								{isPlaying ? (
									<Pause className="h-3 w-3 md:h-4 md:w-4" />
								) : (
									<Play className="h-3 w-3 md:h-4 md:w-4" />
								)}
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
								onClick={toggleMute}>
								{isMuted ? (
									<VolumeX className="h-3 w-3 md:h-4 md:w-4" />
								) : (
									<Volume2 className="h-3 w-3 md:h-4 md:w-4" />
								)}
							</Button>

							<span className="text-white text-xs md:text-sm">
								{formatTime(currentTime)} / {formatTime(duration)}
							</span>
						</div>

						<div className="flex items-center gap-1 md:gap-2">
							{title && (
								<span className="text-white text-xs md:text-sm truncate max-w-xs hidden md:block">
									{title}
								</span>
							)}
							<Button
								size="icon"
								variant="ghost"
								className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
								onClick={toggleFullscreen}>
								<Maximize className="h-3 w-3 md:h-4 md:w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

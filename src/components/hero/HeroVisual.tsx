import { motion } from 'framer-motion';

export function HeroVisual() {
	return (
		<div className="relative h-full w-full overflow-hidden">
			<motion.div
				className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-3xl filter"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: 1,
					opacity: 1,
					transition: { duration: 1.5, ease: 'easeInOut' },
				}}
			/>
			<motion.div
				className="absolute top-1/4 left-1/4 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-secondary/20 opacity-50 blur-3xl filter"
				style={{ animationDelay: '2s' }}
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: 1,
					opacity: 1,
					transition: { duration: 1.5, ease: 'easeInOut', delay: 0.5 },
				}}
			/>
			<motion.div
				className="absolute bottom-1/4 right-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-primary/10 opacity-50 blur-3xl filter"
				style={{ animationDelay: '4s' }}
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: 1,
					opacity: 1,
					transition: { duration: 1.5, ease: 'easeInOut', delay: 1 },
				}}
			/>

			<motion.p
				className="absolute top-1/2 left-1/2 z-10 w-64 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background/50 p-4 text-center font-medium text-foreground backdrop-blur-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 1, delay: 1.2 } }}>
				A video or 3d model shall be rendered here.
			</motion.p>
		</div>
	);
}

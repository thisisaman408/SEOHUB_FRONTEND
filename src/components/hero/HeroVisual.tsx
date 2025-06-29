import { motion } from 'framer-motion';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

export function HeroVisual() {
	return (
		<div className="relative h-full w-full overflow-hidden">
			<motion.div
				className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: [0.8, 1.2, 1],
					opacity: [0, 0.4, 0.2],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
				}}
			/>

			<motion.div
				className="absolute top-1/4 left-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-500/15 blur-3xl"
				initial={{ scale: 0.6, opacity: 0 }}
				animate={{
					scale: [0.6, 1.1, 0.9],
					opacity: [0, 0.3, 0.1],
					rotate: [0, -180, -360],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
					delay: 3,
				}}
			/>

			<motion.div
				className="absolute bottom-1/4 right-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl"
				initial={{ scale: 0.7, opacity: 0 }}
				animate={{
					scale: [0.7, 1.3, 1.1],
					opacity: [0, 0.25, 0.1],
					rotate: [0, 90, 180],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
					delay: 6,
				}}
			/>

			{/* Floating SEO Icons - Dark Theme */}
			<motion.div
				className="absolute top-1/3 left-1/5 z-10"
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: [0, 0.8, 0.5],
					y: [20, -10, 0],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					repeatType: 'reverse',
					delay: 1,
				}}>
				<div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-700/50">
					<BarChart3 className="h-8 w-8 text-blue-400" />
				</div>
			</motion.div>

			<motion.div
				className="absolute top-2/3 left-2/3 z-10"
				initial={{ opacity: 0, y: -20 }}
				animate={{
					opacity: [0, 0.8, 0.4],
					y: [-20, 10, -5],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					repeatType: 'reverse',
					delay: 3,
				}}>
				<div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-700/50">
					<TrendingUp className="h-8 w-8 text-green-400" />
				</div>
			</motion.div>

			<motion.div
				className="absolute top-1/4 right-1/4 z-10"
				initial={{ opacity: 0, x: 20 }}
				animate={{
					opacity: [0, 0.7, 0.3],
					x: [20, -5, 10],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					repeatType: 'reverse',
					delay: 5,
				}}>
				<div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-700/50">
					<Target className="h-8 w-8 text-purple-400" />
				</div>
			</motion.div>

			{/* Decorative Elements - Dark Theme */}
			<motion.div
				className="absolute bottom-1/5 left-1/6 z-5"
				animate={{
					rotate: [0, 360],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: 'linear',
				}}>
				<div className="w-12 h-12 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-sm"></div>
			</motion.div>

			<motion.div
				className="absolute top-1/6 right-1/5 z-5"
				animate={{
					rotate: [360, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'linear',
				}}>
				<div className="w-8 h-8 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-sm"></div>
			</motion.div>
		</div>
	);
}

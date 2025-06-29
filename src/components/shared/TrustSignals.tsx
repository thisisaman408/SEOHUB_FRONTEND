import { motion } from 'framer-motion';

const logos = [
	{
		name: 'Ahrefs',
		path: 'M12 2L2 22h20L12 2zm0 4.5L18.5 20h-13L12 6.5z',
		color: 'text-sky-400',
		bgColor: 'bg-sky-500/10',
	},
	{
		name: 'SurferSEO',
		path: 'M3 12c3-5 9-5 12 0s9 5 12 0',
		color: 'text-violet-400',
		bgColor: 'bg-violet-500/10',
	},
	{
		name: 'GrowthMate',
		path: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-2-14h4v2h-4v3l4 4-2 2-4-4v-7z',
		color: 'text-emerald-400',
		bgColor: 'bg-emerald-500/10',
	},
	{
		name: 'Backlinko',
		path: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72',
		color: 'text-blue-400',
		bgColor: 'bg-blue-500/10',
	},
	{
		name: 'Semrush',
		path: 'M2.5 14.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5z',
		color: 'text-orange-400',
		bgColor: 'bg-orange-500/10',
	},
	{
		name: 'Clearscope',
		path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		color: 'text-rose-400',
		bgColor: 'bg-rose-500/10',
	},
];

export function TrustSignals() {
	const FADE_IN_VARIANTS = {
		hidden: { opacity: 0, y: 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring' as const, stiffness: 50, damping: 20 },
		},
	};

	const CONTAINER_VARIANTS = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const LOGO_VARIANTS = {
		hidden: { opacity: 0, scale: 0.8, y: 20 },
		show: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: 'spring' as const,
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<section className="py-16 bg-gray-900/50 backdrop-blur-sm">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center space-y-12"
					variants={FADE_IN_VARIANTS}
					initial="hidden"
					animate="show">
					{/* Header */}
					<div className="space-y-4">
						<motion.h2
							className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
							variants={FADE_IN_VARIANTS}>
							Trusted by Industry Leaders
						</motion.h2>
						<motion.p
							className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
							variants={FADE_IN_VARIANTS}
							transition={{ delay: 0.2 }}>
							Join thousands of SEO professionals at leading companies who rely
							on our tools to dominate search rankings
						</motion.p>

						{/* Trust Stats */}
						<motion.div
							className="flex flex-wrap items-center justify-center gap-6 mt-8"
							variants={FADE_IN_VARIANTS}
							transition={{ delay: 0.3 }}>
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
								<span className="text-gray-300 text-sm font-medium">
									50,000+ Active Users
								</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
								<span className="text-gray-300 text-sm font-medium">
									Fortune 500 Companies
								</span>
							</div>
							<div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
								<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
								<span className="text-gray-300 text-sm font-medium">
									99.9% Uptime
								</span>
							</div>
						</motion.div>
					</div>

					{/* Company Logos */}
					<motion.div
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 max-w-6xl mx-auto"
						variants={CONTAINER_VARIANTS}
						initial="hidden"
						animate="show">
						{logos.map((logo) => (
							<motion.div
								key={logo.name}
								variants={LOGO_VARIANTS}
								whileHover={{
									scale: 1.1,
									y: -4,
									transition: { duration: 0.2 },
								}}
								className="group">
								<div
									className={`
									relative p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
									hover:bg-gray-700/70 hover:border-gray-600/70 transition-all duration-300 
									hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer
									${logo.bgColor}
								`}>
									{/* Background decoration */}
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-700/20 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

									{/* Logo */}
									<div className="relative flex items-center justify-center">
										<svg
											className={`h-10 w-10 sm:h-12 sm:w-12 ${logo.color} transition-all duration-300 group-hover:scale-110`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth={2}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d={logo.path}
											/>
										</svg>
									</div>

									{/* Company Name */}
									<div className="mt-3 text-center">
										<p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
											{logo.name}
										</p>
									</div>

									{/* Hover effect border */}
									<div
										className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${
											logo.color.split('-')[1]
										}-500/30 transition-all duration-300`}
									/>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Bottom CTA */}
					<motion.div
						className="pt-8"
						variants={FADE_IN_VARIANTS}
						transition={{ delay: 0.8 }}>
						<p className="text-gray-400 text-lg">
							Ready to join them?{' '}
							<span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
								Start your free trial today
							</span>
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

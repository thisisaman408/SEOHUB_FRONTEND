import { motion } from 'framer-motion';
const logos = [
	{
		name: 'Ahrefs',
		path: 'M12 2L2 22h20L12 2zm0 4.5L18.5 20h-13L12 6.5z',
		color: 'text-sky-500',
	},
	{
		name: 'SurferSEO',
		path: 'M3 12c3-5 9-5 12 0s9 5 12 0',
		color: 'text-violet-500',
	},
	{
		name: 'GrowthMate',
		path: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-2-14h4v2h-4v3l4 4-2 2-4-4v-7z',
		color: 'text-emerald-500',
	},
	{
		name: 'Backlinko',
		path: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72',
		color: 'text-blue-500',
	},
	{
		name: 'Semrush',
		path: 'M2.5 14.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-4.5h-1v4.5a.5.5 0 0 1-1 0v-5z',
		color: 'text-orange-500',
	},
	{
		name: 'Clearscope',
		path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		color: 'text-rose-500',
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

	return (
		<section className="bg-background pb-10">
			<div className="container mx-auto px-4 text-center">
				<motion.h3
					className="text-sm font-semibold uppercase text-muted-foreground tracking-wider"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					variants={FADE_IN_VARIANTS}>
					Trusted by professionals at leading companies
				</motion.h3>

				<motion.div
					className="mt-10 grid grid-cols-2 items-center justify-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					variants={{
						hidden: {},
						show: { transition: { staggerChildren: 0.1 } },
					}}>
					{logos.map((logo) => (
						<motion.div
							key={logo.name}
							variants={FADE_IN_VARIANTS}
							className="flex justify-center items-center gap-x-3 grayscale opacity-70 transition-all duration-300 hover:opacity-100 hover:grayscale-0">
							{/* Icon with its unique color */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={`h-8 w-8 sm:h-10 sm:w-10 ${logo.color}`}>
								<path d={logo.path} />
							</svg>

							{/* Larger, bolder company name */}
							<span className="text-xl font-bold text-foreground sm:text-2xl">
								{logo.name}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

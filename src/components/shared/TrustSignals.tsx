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
		<section className="py-12 bg-muted/50">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-8"
					variants={FADE_IN_VARIANTS}
					initial="hidden"
					animate="show">
					<p className="text-lg text-muted-foreground">
						Trusted by professionals at leading companies
					</p>
				</motion.div>
				<div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
					{logos.map((logo) => (
						<motion.div
							key={logo.name}
							className="flex items-center space-x-3 opacity-60 hover:opacity-100 transition-opacity"
							variants={FADE_IN_VARIANTS}
							initial="hidden"
							animate="show">
							<svg
								className={`h-8 w-8 ${logo.color}`}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d={logo.path} />
							</svg>
							<span className="text-lg font-semibold text-foreground">
								{logo.name}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

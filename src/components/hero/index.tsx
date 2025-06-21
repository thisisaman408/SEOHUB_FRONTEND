import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'framer-motion';
import { HeroVisual } from './HeroVisual';
import { IntelligentSearchBar } from './IntelligentSearchBar';

interface HeroProps {
	searchTerm: string;
	onSearchTermChange: (term: string) => void;
	onSearchSubmit: (e: React.FormEvent) => void;
}

export function Hero({
	searchTerm,
	onSearchTermChange,
	onSearchSubmit,
}: HeroProps) {
	const FADE_UP_ANIMATION_VARIANTS: Variants = {
		hidden: { opacity: 0, y: 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 50, damping: 20 },
		},
	};

	return (
		<section className="relative w-full h-[90vh] overflow-hidden">
			<div className="container mx-auto grid h-full grid-cols-1 items-center md:grid-cols-2">
				<motion.div
					initial="hidden"
					animate="show"
					viewport={{ once: true }}
					variants={{
						hidden: {},
						show: { transition: { staggerChildren: 0.2 } },
					}}
					className="z-10 flex flex-col items-center text-center md:items-start md:text-left">
					<motion.h1
						variants={FADE_UP_ANIMATION_VARIANTS}
						className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
						The Future of SEO is Intelligent.
					</motion.h1>
					<motion.p
						variants={FADE_UP_ANIMATION_VARIANTS}
						className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
						A curated ecosystem of elite, AI-powered tools built to elevate your
						SEO strategy.
					</motion.p>
					<motion.div
						variants={FADE_UP_ANIMATION_VARIANTS}
						className="mt-8 w-full max-w-sm md:max-w-xl">
						<IntelligentSearchBar
							searchTerm={searchTerm}
							onSearchTermChange={onSearchTermChange}
							onSearchSubmit={onSearchSubmit}
						/>
					</motion.div>
					<motion.div
						variants={FADE_UP_ANIMATION_VARIANTS}
						className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
						<Button size="lg">Explore All Tools</Button>
						<Button size="lg" variant="outline">
							List Your Tool
						</Button>
					</motion.div>
				</motion.div>
				<div className="absolute top-0 left-0 hidden h-full w-full md:relative md:block">
					<HeroVisual />
				</div>
			</div>
		</section>
	);
}

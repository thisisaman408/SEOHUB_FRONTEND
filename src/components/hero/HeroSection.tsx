import { SearchBar } from '@/components/hero/SearchBar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSearch } from '@/store/slice/toolsSlice';
import { openModal } from '@/store/slice/uiSlice';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeroVisual } from './HeroVisual';

export function Hero() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useAppSelector((state) => state.auth);

	const FADE_UP_ANIMATION_VARIANTS: Variants = {
		hidden: { opacity: 0, y: 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 50, damping: 20 },
		},
	};

	const handleExploreAllTools = () => {
		dispatch(clearSearch());
		const toolsSection = document.querySelector('#tools-section');
		if (toolsSection) {
			toolsSection.scrollIntoView({ behavior: 'smooth' });
		} else {
			window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
		}
	};

	const handleListYourTool = () => {
		if (!user) {
			dispatch(openModal({ modal: 'login' }));
			return;
		}
		navigate('/submit-tool');
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<motion.div
						className="text-center lg:text-left"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show">
						<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
							The Future of SEO is{' '}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Intelligent
							</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl">
							A curated ecosystem of elite, AI-powered tools built to elevate
							your SEO strategy.
						</p>
						<SearchBar />
						<div className="flex flex-col sm:flex-row gap-4 mt-8">
							<Button
								size="lg"
								onClick={handleExploreAllTools}
								className="text-lg px-8">
								Explore All Tools
							</Button>
							<Button
								size="lg"
								variant="outline"
								onClick={handleListYourTool}
								className="text-lg px-8">
								List Your Tool
							</Button>
						</div>
					</motion.div>
					<motion.div
						className="h-[400px] lg:h-[500px]"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show">
						<HeroVisual />
					</motion.div>
				</div>
			</div>
		</section>
	);
}

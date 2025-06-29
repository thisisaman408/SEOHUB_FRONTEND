import { SearchBar } from '@/components/hero/SearchBar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSearch } from '@/store/slice/toolsSlice';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
			toast.warning('Login for listing your tool');
			navigate('/login');
			return;
		}
		navigate('/submit-tool');
	};

	return (
		<section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

			{/* Hero Visual Background */}
			<div className="absolute inset-0 opacity-40">
				<HeroVisual />
			</div>

			<div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
				<div className="flex flex-col items-center justify-center min-h-[85vh] space-y-8 lg:space-y-12">
					{/* Trust Badge */}
					<motion.div
						className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50 shadow-lg"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show">
						<div className="flex items-center space-x-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="h-3 w-3 fill-yellow-400 text-yellow-400"
								/>
							))}
						</div>
						<span className="text-sm font-medium text-gray-300">
							Trusted by 50,000+ SEO professionals
						</span>
					</motion.div>

					{/* Main Headline */}
					<motion.div
						className="text-center space-y-4 max-w-4xl"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show"
						transition={{ delay: 0.2 }}>
						<h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight">
							<span className="text-white">The Future of SEO is</span>{' '}
							<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
								Intelligent
							</span>
						</h1>
						<p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
							A curated ecosystem of elite, AI-powered tools built to elevate
							your SEO strategy.
							<span className="block mt-3 text-base sm:text-lg font-medium text-blue-400">
								Boost rankings. Drive traffic. Dominate search.
							</span>
						</p>
					</motion.div>

					{/* MASSIVE Search Bar - The Hero Element */}
					<motion.div
						className="w-full max-w-6xl px-4"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show"
						transition={{ delay: 0.4 }}>
						<SearchBar />
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4 sm:gap-6"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show"
						transition={{ delay: 0.6 }}>
						<Button
							onClick={handleExploreAllTools}
							size="lg"
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
							<Zap className="mr-2 h-5 w-5" />
							Explore All Tools
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						<Button
							onClick={handleListYourTool}
							variant="outline"
							size="lg"
							className="border-2 border-gray-600 hover:border-blue-400 bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 hover:text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 backdrop-blur-sm">
							<TrendingUp className="mr-2 h-5 w-5" />
							List Your Tool
						</Button>
					</motion.div>

					{/* Social Proof Stats */}
					<motion.div
						className="grid grid-cols-3 gap-6 sm:gap-8 pt-8 max-w-2xl w-full"
						variants={FADE_UP_ANIMATION_VARIANTS}
						initial="hidden"
						animate="show"
						transition={{ delay: 0.8 }}>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
								300+
							</div>
							<div className="text-sm sm:text-base text-gray-400 font-medium">
								SEO Tools
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
								50K+
							</div>
							<div className="text-sm sm:text-base text-gray-400 font-medium">
								Users
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
								99.9%
							</div>
							<div className="text-sm sm:text-base text-gray-400 font-medium">
								Uptime
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Bottom Wave */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					viewBox="0 0 1440 320"
					className="w-full h-16 sm:h-20 fill-gray-900">
					<path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
				</svg>
			</div>
		</section>
	);
}

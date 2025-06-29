import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setNewsletterEmail,
	subscribeToNewsletter,
} from '@/store/slice/uiSlice';
import {
	Github,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Send,
	Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
	const dispatch = useAppDispatch();
	const { newsletterEmail, isSubscribing } = useAppSelector(
		(state) => state.ui
	);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (newsletterEmail.trim() === '' || !newsletterEmail.includes('@')) {
			return;
		}
		dispatch(subscribeToNewsletter(newsletterEmail));
	};

	return (
		<footer className="bg-gray-900 text-white">
			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
					{/* Company Info */}
					<div className="lg:col-span-2 space-y-6">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">ST</span>
							</div>
							<h3 className="text-2xl font-bold">SEO Tools Hub</h3>
						</div>
						<p className="text-gray-300 text-lg leading-relaxed max-w-md">
							The ultimate marketplace for SEO professionals. Discover, compare,
							and access the best SEO tools to boost your rankings and grow your
							business.
						</p>

						{/* Contact Info */}
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<Mail className="h-4 w-4 text-blue-400" />
								<span className="text-gray-300">hello@seotoolshub.com</span>
							</div>
							<div className="flex items-center space-x-3">
								<Phone className="h-4 w-4 text-blue-400" />
								<span className="text-gray-300">+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-3">
								<MapPin className="h-4 w-4 text-blue-400" />
								<span className="text-gray-300">San Francisco, CA</span>
							</div>
						</div>

						{/* Social Links */}
						<div className="flex space-x-4">
							<Button
								variant="outline"
								size="icon"
								className="border-gray-600 hover:bg-gray-800 hover:border-gray-500">
								<Twitter className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="border-gray-600 hover:bg-gray-800 hover:border-gray-500">
								<Linkedin className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="border-gray-600 hover:bg-gray-800 hover:border-gray-500">
								<Github className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Products */}
					<div className="space-y-6">
						<h4 className="text-lg font-semibold text-white">Products</h4>
						<ul className="space-y-3">
							<li>
								<Link
									to="/tools/keyword-research"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Keyword Research
								</Link>
							</li>
							<li>
								<Link
									to="/tools/backlink-analysis"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Backlink Analysis
								</Link>
							</li>
							<li>
								<Link
									to="/tools/site-audit"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Site Audit
								</Link>
							</li>
							<li>
								<Link
									to="/tools/rank-tracking"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Rank Tracking
								</Link>
							</li>
							<li>
								<Link
									to="/tools/content-optimization"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Content Optimization
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div className="space-y-6">
						<h4 className="text-lg font-semibold text-white">Resources</h4>
						<ul className="space-y-3">
							<li>
								<Link
									to="/blog"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									SEO Blog
								</Link>
							</li>
							<li>
								<Link
									to="/guides"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									SEO Guides
								</Link>
							</li>
							<li>
								<Link
									to="/case-studies"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Case Studies
								</Link>
							</li>
							<li>
								<Link
									to="/webinars"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									Webinars
								</Link>
							</li>
							<li>
								<Link
									to="/api-docs"
									className="text-gray-300 hover:text-blue-400 transition-colors">
									API Documentation
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="space-y-6">
						<h4 className="text-lg font-semibold text-white">Stay Updated</h4>
						<p className="text-gray-300">
							Get weekly SEO tips, tool reviews, and industry insights delivered
							to your inbox.
						</p>
						<form onSubmit={handleSubscribe} className="space-y-3">
							<div className="relative">
								<Input
									type="email"
									placeholder="Enter your email"
									value={newsletterEmail}
									onChange={(e) => dispatch(setNewsletterEmail(e.target.value))}
									className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-12"
								/>
								<Button
									type="submit"
									size="sm"
									disabled={isSubscribing}
									className="absolute right-1 top-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-3">
									<Send className="h-3 w-3" />
								</Button>
							</div>
							<p className="text-xs text-gray-400">
								Join 50,000+ SEO professionals already subscribed
							</p>
						</form>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-800">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
							<p className="text-gray-400 text-sm">
								© 2025 SEO Tools Hub. All rights reserved.
							</p>
							<div className="flex items-center space-x-1 text-xs text-gray-500">
								<span>Made with ❤️ for SEO professionals worldwide</span>
							</div>
						</div>
						<div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
							<Link
								to="/privacy"
								className="text-gray-400 hover:text-blue-400 transition-colors">
								Privacy Policy
							</Link>
							<Link
								to="/terms"
								className="text-gray-400 hover:text-blue-400 transition-colors">
								Terms of Service
							</Link>
							<Link
								to="/cookies"
								className="text-gray-400 hover:text-blue-400 transition-colors">
								Cookie Policy
							</Link>
							<Link
								to="/status"
								className="text-gray-400 hover:text-blue-400 transition-colors">
								System Status
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

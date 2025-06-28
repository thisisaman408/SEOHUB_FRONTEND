import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setNewsletterEmail,
	subscribeToNewsletter,
} from '@/store/slice/uiSlice';
import { Github, Linkedin, Twitter } from 'lucide-react';
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
		<footer className="bg-background border-t">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Logo and Description */}
					<div className="space-y-4">
						<h3 className="text-xl font-bold text-foreground">SEO Tools Hub</h3>
						<p className="text-muted-foreground">
							Discover and explore the best AI-powered SEO tools to elevate your
							digital strategy.
						</p>
						<div className="flex space-x-4">
							<Button variant="ghost" size="icon">
								<Twitter className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<Github className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<Linkedin className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground">
							Quick Links
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground">
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/tools"
									className="text-muted-foreground hover:text-foreground">
									Browse Tools
								</Link>
							</li>
							<li>
								<Link
									to="/submit-tool"
									className="text-muted-foreground hover:text-foreground">
									Submit Tool
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-muted-foreground hover:text-foreground">
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* Categories */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground">
							Categories
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/category/ai-tools"
									className="text-muted-foreground hover:text-foreground">
									AI Tools
								</Link>
							</li>
							<li>
								<Link
									to="/category/seo-tools"
									className="text-muted-foreground hover:text-foreground">
									SEO Tools
								</Link>
							</li>
							<li>
								<Link
									to="/category/content-tools"
									className="text-muted-foreground hover:text-foreground">
									Content Tools
								</Link>
							</li>
							<li>
								<Link
									to="/category/analytics"
									className="text-muted-foreground hover:text-foreground">
									Analytics
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground">
							Stay Updated
						</h4>
						<p className="text-muted-foreground">
							Get the latest tools and updates delivered to your inbox.
						</p>
						<form onSubmit={handleSubscribe} className="space-y-2">
							<Input
								type="email"
								placeholder="Enter your email"
								value={newsletterEmail}
								onChange={(e) => dispatch(setNewsletterEmail(e.target.value))}
								className="w-full"
							/>
							<Button type="submit" className="w-full" disabled={isSubscribing}>
								{isSubscribing ? 'Subscribing...' : 'Subscribe'}
							</Button>
						</form>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
					<p className="text-muted-foreground">
						© 2024 SEO Tools Hub. All rights reserved.
					</p>
					<div className="flex space-x-4 mt-4 md:mt-0">
						<Link
							to="/privacy"
							className="text-muted-foreground hover:text-foreground">
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="text-muted-foreground hover:text-foreground">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

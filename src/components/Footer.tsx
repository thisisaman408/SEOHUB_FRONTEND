import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function Footer() {
	const [email, setEmail] = useState('');

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim() === '' || !email.includes('@')) {
			toast.error('Please enter a valid email address.');
			return;
		}
		console.log('Subscribing with email:', email);
		toast.success(`Thank you for subscribing, ${email}!`);
		setEmail('');
	};

	return (
		<footer className="bg-secondary/50 border-t border-border/40">
			<div className="container mx-auto px-4 md:px-6 py-16">
				<div className="grid gap-12 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<Link to="/" className="flex items-center gap-2 mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-6 w-6 text-primary">
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
							<span className="text-xl font-bold text-foreground">Collab</span>
						</Link>
						<p className="text-muted-foreground max-w-md">
							The intelligent discovery platform for the next generation of SEO
							professionals and the tools they love.
						</p>
						<div className="mt-6">
							<h3 className="font-semibold text-foreground mb-2">
								Subscribe to our newsletter
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Get the latest on AI in SEO, new tools, and our expert analysis.
							</p>
							<form
								onSubmit={handleSubscribe}
								className="flex w-full max-w-sm items-center space-x-2">
								<Input
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									aria-label="Email for newsletter"
								/>
								<Button type="submit">Subscribe</Button>
							</form>
						</div>
					</div>

					<div className="lg:col-span-1" />

					<div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
						{/* <div>
							<h3 className="font-semibold text-foreground mb-4">Platform</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Explore Tools
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Compare Tools
									</Link>
								</li>
								<li>
									<Link
										to={}
										className="text-muted-foreground hover:text-primary transition-colors">
										List Your Tool
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Nexus Score
									</Link>
								</li>
							</ul>
						</div> */}
						<div>
							<h3 className="font-semibold text-foreground mb-4">
								Nexus Tools
							</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Content Strategist
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Link Architect
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Rank Forecaster
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-foreground mb-4">Company</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Blog
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Careers
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-primary transition-colors">
										Contact
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Collab, Inc. All rights reserved.
					</p>
					<div className="flex items-center gap-4 mt-4 sm:mt-0">
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Twitter"
							className="hover:text-primary transition-colors">
							<Twitter className="h-5 w-5" />
						</a>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
							className="hover:text-primary transition-colors">
							<Github className="h-5 w-5" />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
							className="hover:text-primary transition-colors">
							<Linkedin className="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

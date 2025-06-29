import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
	ArrowRight,
	Check,
	Crown,
	Shield,
	Sparkles,
	Star,
	Zap,
} from 'lucide-react';
import { useState } from 'react';

interface PricingTier {
	name: string;
	price: number;
	yearlyPrice: number;
	description: string;
	features: string[];
	limitations?: string[];
	popular?: boolean;
	icon: React.ReactNode;
	buttonText: string;
	buttonVariant: 'default' | 'outline' | 'secondary';
}

export function PricingPage() {
	const [isYearly, setIsYearly] = useState(false);

	const pricingTiers: PricingTier[] = [
		{
			name: 'Starter',
			price: 29,
			yearlyPrice: 290,
			description:
				'Perfect for individual SEO professionals and small websites',
			icon: <Star className="h-6 w-6" />,
			features: [
				'Access to 50+ SEO tools',
				'500 monthly credits',
				'Basic keyword tracking (100 keywords)',
				'Site audit for 1 website',
				'Standard support',
				'Data export (CSV)',
				'Basic competitor analysis',
			],
			limitations: ['Limited to 1 user', 'Basic reporting only'],
			buttonText: 'Start Free Trial',
			buttonVariant: 'outline',
		},
		{
			name: 'Professional',
			price: 79,
			yearlyPrice: 790,
			description: 'Ideal for growing agencies and marketing teams',
			icon: <Zap className="h-6 w-6" />,
			features: [
				'Access to 150+ SEO tools',
				'2,000 monthly credits',
				'Advanced keyword tracking (1,000 keywords)',
				'Site audit for 5 websites',
				'Priority support',
				'Advanced data export (PDF, Excel)',
				'Comprehensive competitor analysis',
				'White-label reports',
				'API access',
				'Team collaboration (up to 5 users)',
			],
			popular: true,
			buttonText: 'Start Professional',
			buttonVariant: 'default',
		},
		{
			name: 'Enterprise',
			price: 199,
			yearlyPrice: 1990,
			description: 'For large agencies and enterprises with advanced needs',
			icon: <Crown className="h-6 w-6" />,
			features: [
				'Access to all 300+ SEO tools',
				'Unlimited monthly credits',
				'Enterprise keyword tracking (10,000+ keywords)',
				'Site audit for unlimited websites',
				'24/7 dedicated support',
				'Custom integrations',
				'Advanced competitor intelligence',
				'Custom white-label solutions',
				'Full API access with webhooks',
				'Unlimited team members',
				'Custom training & onboarding',
				'SLA guarantee (99.9% uptime)',
			],
			buttonText: 'Contact Sales',
			buttonVariant: 'secondary',
		},
	];

	return (
		<div className="min-h-screen bg-gray-950">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]"></div>

				<div className="relative container mx-auto px-4 py-20 lg:py-32">
					<motion.div
						className="text-center max-w-4xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						{/* Trust Badge */}
						<div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50 mb-6">
							<Shield className="h-4 w-4 text-green-400" />
							<span className="text-sm font-medium text-gray-300">
								14-day money-back guarantee
							</span>
						</div>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
							<span className="text-white">Choose Your</span>{' '}
							<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
								SEO Success Plan
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
							Access the world's largest marketplace of SEO tools. Start your
							journey to higher rankings today.
						</p>

						{/* Billing Toggle */}
						<motion.div
							className="flex items-center justify-center space-x-4 mb-8"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							<span
								className={`font-medium ${
									!isYearly ? 'text-white' : 'text-gray-400'
								}`}>
								Monthly
							</span>
							<button
								onClick={() => setIsYearly(!isYearly)}
								className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
									isYearly
										? 'bg-gradient-to-r from-blue-500 to-purple-600'
										: 'bg-gray-700'
								}`}>
								<span
									className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
										isYearly ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
							<span
								className={`font-medium ${
									isYearly ? 'text-white' : 'text-gray-400'
								}`}>
								Yearly
								<Badge
									variant="secondary"
									className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
									Save 20%
								</Badge>
							</span>
						</motion.div>

						{/* Trust Indicators */}
						<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span>50,000+ Happy Users</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
								<span>300+ SEO Tools</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
								<span>99.9% Uptime</span>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Pricing Cards */}
			<div className="container mx-auto px-4 py-16 lg:py-24">
				<div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{pricingTiers.map((tier, index) => (
						<motion.div
							key={tier.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}>
							<Card
								className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl h-full ${
									tier.popular
										? 'ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10 scale-105 bg-gray-900/90 border-gray-700/50'
										: 'hover:shadow-lg hover:scale-102 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm'
								}`}>
								{/* Popular Badge */}
								{tier.popular && (
									<div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 text-sm font-semibold">
										<Sparkles className="inline h-4 w-4 mr-2" />
										Most Popular Choice
									</div>
								)}

								<CardHeader
									className={`text-center ${tier.popular ? 'pt-16' : 'pt-8'}`}>
									{/* Icon */}
									<div
										className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
											tier.popular
												? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
												: 'bg-gray-800 text-gray-400'
										}`}>
										{tier.icon}
									</div>

									<CardTitle className="text-2xl font-bold text-white">
										{tier.name}
									</CardTitle>
									<CardDescription className="text-base mt-2 text-gray-400">
										{tier.description}
									</CardDescription>

									{/* Pricing */}
									<div className="mt-6">
										<div className="flex items-baseline justify-center">
											<span className="text-5xl font-bold text-white">
												$
												{isYearly
													? Math.floor(tier.yearlyPrice / 12)
													: tier.price}
											</span>
											<span className="text-gray-400 ml-2">/month</span>
										</div>
										{isYearly && (
											<p className="text-sm text-green-400 mt-2 font-medium">
												Billed annually (${tier.yearlyPrice}/year)
											</p>
										)}
									</div>
								</CardHeader>

								<CardContent className="px-6 pb-6">
									{/* Features */}
									<ul className="space-y-3">
										{tier.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-start">
												<Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
												<span className="text-gray-300">{feature}</span>
											</li>
										))}
										{tier.limitations &&
											tier.limitations.map((limitation, limitIndex) => (
												<li
													key={limitIndex}
													className="flex items-start opacity-60">
													<span className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-gray-500">
														•
													</span>
													<span className="text-gray-500 text-sm">
														{limitation}
													</span>
												</li>
											))}
									</ul>
								</CardContent>

								<CardFooter className="px-6 pb-8">
									<Button
										className={`w-full py-3 font-semibold text-lg transition-all duration-300 ${
											tier.popular
												? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
												: tier.buttonVariant === 'outline'
												? 'border-2 border-gray-600 hover:border-blue-500 bg-transparent hover:bg-blue-500/10 text-gray-300 hover:text-white'
												: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
										}`}
										variant={tier.buttonVariant}
										size="lg">
										{tier.buttonText}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Features Comparison */}
				<motion.div
					className="mt-24 max-w-5xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}>
					<h2 className="text-3xl font-bold text-center mb-12 text-white">
						Compare All Features
					</h2>
					<div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-800/50">
									<tr>
										<th className="px-6 py-4 text-left font-semibold text-white">
											Features
										</th>
										<th className="px-6 py-4 text-center font-semibold text-white">
											Starter
										</th>
										<th className="px-6 py-4 text-center font-semibold text-white">
											Professional
										</th>
										<th className="px-6 py-4 text-center font-semibold text-white">
											Enterprise
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-800/50">
									<tr className="hover:bg-gray-800/30 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-300">
											SEO Tools Access
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											50+ tools
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											150+ tools
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											300+ tools
										</td>
									</tr>
									<tr className="hover:bg-gray-800/30 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-300">
											Monthly Credits
										</td>
										<td className="px-6 py-4 text-center text-gray-400">500</td>
										<td className="px-6 py-4 text-center text-gray-400">
											2,000
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											Unlimited
										</td>
									</tr>
									<tr className="hover:bg-gray-800/30 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-300">
											Team Members
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											1 user
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											Up to 5 users
										</td>
										<td className="px-6 py-4 text-center text-gray-400">
											Unlimited
										</td>
									</tr>
									<tr className="hover:bg-gray-800/30 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-300">
											API Access
										</td>
										<td className="px-6 py-4 text-center text-red-400">❌</td>
										<td className="px-6 py-4 text-center text-green-400">✅</td>
										<td className="px-6 py-4 text-center text-green-400">
											✅ Advanced
										</td>
									</tr>
									<tr className="hover:bg-gray-800/30 transition-colors">
										<td className="px-6 py-4 font-medium text-gray-300">
											White-label Reports
										</td>
										<td className="px-6 py-4 text-center text-red-400">❌</td>
										<td className="px-6 py-4 text-center text-green-400">✅</td>
										<td className="px-6 py-4 text-center text-green-400">
											✅ Custom
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</motion.div>

				{/* FAQ Section */}
				<motion.div
					className="mt-24 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1.0 }}>
					<h2 className="text-3xl font-bold text-center mb-12 text-white">
						Frequently Asked Questions
					</h2>
					<div className="space-y-6">
						{[
							{
								question: 'Can I change plans anytime?',
								answer:
									'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
							},
							{
								question: 'Do you offer a free trial?',
								answer:
									'Yes, we offer a 14-day free trial for all plans. No credit card required.',
							},
							{
								question: 'What payment methods do you accept?',
								answer:
									'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
							},
						].map((faq, index) => (
							<div
								key={index}
								className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800/50 hover:bg-gray-900/70 transition-all duration-300">
								<h3 className="font-semibold text-lg mb-2 text-white">
									{faq.question}
								</h3>
								<p className="text-gray-400 leading-relaxed">{faq.answer}</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}

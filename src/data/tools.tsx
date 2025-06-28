// This file contains the data for the featured tools section.
// The data structure is now aligned with the requirements of the AIVisualMockup component.
import React from 'react';

export interface Tool {
	tag: string;
	title: string;
	headline: string;
	description: string;
	cta: string;
	visual: {
		type: 'ui-mockup';
		color: 'blue' | 'green' | 'purple' | 'orange';
		content: { icon: 'zap' | 'bar-chart'; text: string }[];
	};
}

export const featuredTools: Tool[] = [
	{
		tag: 'AI Content Planning',
		title: 'Nexus Content Strategist',
		headline: 'Plan smarter content, faster.',
		description:
			'Stop guessing what to write. With just one input (keyword or topic), Nexus Content Strategist generates a full AI-optimized content plan—complete with topic clusters, SERP intent analysis, and detailed content briefs.',
		cta: 'Explore Tool',
		visual: {
			type: 'ui-mockup',
			color: 'blue',
			content: [
				{ icon: 'zap', text: 'Keyword Clustering' },
				{ icon: 'bar-chart', text: 'SERP Intent Analysis' },
				{ icon: 'zap', text: 'Outline Generated' },
			],
		},
	},
	{
		tag: 'Internal Link Building',
		title: 'Link Architect AI',
		headline: 'Automate your internal linking.',
		description:
			'Find and fix orphan pages, build topical authority, and improve user navigation with AI-powered internal link suggestions. Integrates directly with your CMS.',
		cta: 'See It In Action',
		visual: {
			type: 'ui-mockup',
			color: 'green',
			content: [
				{ icon: 'zap', text: 'Orphan Page Detection' },
				{ icon: 'bar-chart', text: 'Topical Authority Map' },
				{ icon: 'zap', text: 'Internal Link Suggestions' },
			],
		},
	},
	{
		tag: 'SERP & Competitor Analysis',
		title: 'SERP Scryer',
		headline: "Uncover your competitors' secrets.",
		description:
			'Go beyond basic rank tracking. SERP Scryer analyzes top-ranking pages to reveal content structures, keyword densities, and hidden opportunities you can leverage.',
		cta: 'Analyze a Keyword',
		visual: {
			type: 'ui-mockup',
			color: 'purple',
			content: [
				{ icon: 'bar-chart', text: 'Competitor Content Structure' },
				{ icon: 'zap', text: 'Keyword Density Analysis' },
				{ icon: 'bar-chart', text: 'Hidden Opportunity Report' },
			],
		},
	},
	{
		tag: 'Technical SEO Audits',
		title: 'Site Health AI',
		headline: 'Find and fix SEO issues in minutes.',
		description:
			'Conduct comprehensive technical audits that identify critical issues and provide clear, actionable instructions on how to fix them. From Core Web Vitals to schema validation.',
		cta: 'Start Your Free Audit',
		visual: {
			type: 'ui-mockup',
			color: 'orange',
			content: [
				{ icon: 'zap', text: 'Core Web Vitals Check' },
				{ icon: 'bar-chart', text: 'Schema Validation' },
				{ icon: 'zap', text: 'Crawl Error Identification' },
			],
		},
	},
];

export interface GridTool {
	id: number;
	name: string;
	tagline: string;
	description: string;
	logo: React.ReactNode;
	tags: string[];
	rating: number;
	cta: string;
	visual: {
		type: 'ui-mockup';
		color:
			| 'blue'
			| 'green'
			| 'purple'
			| 'orange'
			| 'red'
			| 'yellow'
			| 'indigo'
			| 'pink';
		content: { icon: 'zap' | 'bar-chart'; text: string }[];
	};
}

// Import the PlaceholderLogo from a separate component file
import { PlaceholderLogo } from '@/components/shared/PlaceholderLogo';

export const allTools: GridTool[] = [
	{
		id: 1,
		name: 'Nexus Strategist',
		tagline: 'AI-powered content planning.',
		logo: <PlaceholderLogo name="N" />,
		tags: ['GPT-4', 'Content'],
		rating: 4.9,
		cta: 'Explore Strategist',
		description:
			'Generates full content plans from a single keyword, including topic clusters and SERP intent analysis.',
		visual: {
			type: 'ui-mockup',
			color: 'blue',
			content: [
				{ icon: 'zap', text: 'Keyword Clustering' },
				{ icon: 'bar-chart', text: 'SERP Intent Analysis' },
			],
		},
	},
	{
		id: 2,
		name: 'Link Architect',
		tagline: 'Automated internal linking.',
		logo: <PlaceholderLogo name="L" />,
		tags: ['NLP', 'On-Page'],
		rating: 4.8,
		cta: 'Build Links',
		description:
			'Crawls your site to find orphan pages and suggests high-impact internal linking opportunities using NLP.',
		visual: {
			type: 'ui-mockup',
			color: 'green',
			content: [
				{ icon: 'zap', text: 'Orphan Page Detection' },
				{ icon: 'bar-chart', text: 'Topical Authority Map' },
			],
		},
	},
	{
		id: 3,
		name: 'SERP Scryer',
		tagline: 'Deep competitor analysis.',
		logo: <PlaceholderLogo name="S" />,
		tags: ['SERP API', 'Analysis'],
		rating: 4.7,
		cta: 'Analyze SERPs',
		description:
			'Deconstructs top-ranking content to reveal competitor strategies, keyword densities, and content structures.',
		visual: {
			type: 'ui-mockup',
			color: 'purple',
			content: [
				{ icon: 'bar-chart', text: 'Content Structure' },
				{ icon: 'zap', text: 'Keyword Density' },
			],
		},
	},
	{
		id: 4,
		name: 'Site Health AI',
		tagline: 'Find and fix technical issues.',
		logo: <PlaceholderLogo name="H" />,
		tags: ['Audit', 'Technical'],
		rating: 4.9,
		cta: 'Run Audit',
		description:
			'Performs deep technical SEO audits, checking everything from Core Web Vitals to schema markup and providing actionable fixes.',
		visual: {
			type: 'ui-mockup',
			color: 'orange',
			content: [
				{ icon: 'zap', text: 'Core Web Vitals' },
				{ icon: 'bar-chart', text: 'Schema Validation' },
			],
		},
	},
	{
		id: 5,
		name: 'Outreach Oracle',
		tagline: 'AI-driven link building.',
		logo: <PlaceholderLogo name="O" />,
		tags: ['Outreach', 'Email'],
		rating: 4.6,
		cta: 'Start Outreach',
		description:
			'Identifies link-building prospects and drafts personalized outreach emails, dramatically speeding up your campaign workflow.',
		visual: {
			type: 'ui-mockup',
			color: 'red',
			content: [
				{ icon: 'zap', text: 'Prospect Discovery' },
				{ icon: 'bar-chart', text: 'Email Personalization' },
			],
		},
	},
	{
		id: 6,
		name: 'Keyword Prophet',
		tagline: 'Predictive keyword analysis.',
		logo: <PlaceholderLogo name="K" />,
		tags: ['Forecasting', 'Keywords'],
		rating: 4.5,
		cta: 'Forecast Trends',
		description:
			'Uses trend data to forecast keyword potential, helping you prioritize targets with the highest future growth.',
		visual: {
			type: 'ui-mockup',
			color: 'yellow',
			content: [
				{ icon: 'bar-chart', text: 'Seasonality Analysis' },
				{ icon: 'zap', text: 'Opportunity Score' },
			],
		},
	},
	{
		id: 7,
		name: 'Content Grader',
		tagline: 'Score content against SERPs.',
		logo: <PlaceholderLogo name="G" />,
		tags: ['Content', 'NLP'],
		rating: 4.7,
		cta: 'Grade My Content',
		description:
			'Analyzes your draft against the top 10 search results and provides a score with suggestions for improvement.',
		visual: {
			type: 'ui-mockup',
			color: 'indigo',
			content: [
				{ icon: 'bar-chart', text: 'Readability Score' },
				{ icon: 'zap', text: 'Keyword Inclusion' },
			],
		},
	},
	{
		id: 8,
		name: 'Local Dominator',
		tagline: 'Optimize for local search.',
		logo: <PlaceholderLogo name="D" />,
		tags: ['Local SEO', 'GMB'],
		rating: 4.8,
		cta: 'Dominate Locally',
		description:
			'Streamlines Google Business Profile management, review responses, and local citation building.',
		visual: {
			type: 'ui-mockup',
			color: 'pink',
			content: [
				{ icon: 'zap', text: 'Review Management' },
				{ icon: 'bar-chart', text: 'Citation Tracking' },
			],
		},
	},
	{
		id: 9,
		name: 'Schema Genius',
		tagline: 'One-click schema markup.',
		logo: <PlaceholderLogo name="S" />,
		tags: ['Technical', 'Schema'],
		rating: 4.9,
		cta: 'Generate Schema',
		description:
			'Automatically generates and validates all types of schema markup for your website to improve rich snippet potential.',
		visual: {
			type: 'ui-mockup',
			color: 'green',
			content: [
				{ icon: 'zap', text: 'JSON-LD Generation' },
				{ icon: 'bar-chart', text: 'Rich Snippet Preview' },
			],
		},
	},
	{
		id: 10,
		name: 'PPC Optimizer',
		tagline: 'AI for your ad spend.',
		logo: <PlaceholderLogo name="P" />,
		tags: ['PPC', 'Ads'],
		rating: 4.6,
		cta: 'Optimize Ads',
		description:
			'Analyzes your Google Ads campaigns to suggest bid adjustments, negative keywords, and ad copy improvements.',
		visual: {
			type: 'ui-mockup',
			color: 'blue',
			content: [
				{ icon: 'bar-chart', text: 'Bid Adjustment' },
				{ icon: 'zap', text: 'Negative Keywords' },
			],
		},
	},
	{
		id: 11,
		name: 'Image SEO AI',
		tagline: 'Optimize images instantly.',
		logo: <PlaceholderLogo name="I" />,
		tags: ['Images', 'On-Page'],
		rating: 4.5,
		cta: 'Optimize Images',
		description:
			'Automatically generates descriptive alt text, compresses images without quality loss, and converts to next-gen formats.',
		visual: {
			type: 'ui-mockup',
			color: 'purple',
			content: [
				{ icon: 'zap', text: 'Alt Text Generation' },
				{ icon: 'bar-chart', text: 'Image Compression' },
			],
		},
	},
	{
		id: 12,
		name: 'SERP Simulator',
		tagline: 'Preview before you publish.',
		logo: <PlaceholderLogo name="S" />,
		tags: ['Content', 'SERP API'],
		rating: 4.7,
		cta: 'Simulate Now',
		description:
			'See how your title tag and meta description will likely appear on Google before you push your changes live.',
		visual: {
			type: 'ui-mockup',
			color: 'orange',
			content: [
				{ icon: 'bar-chart', text: 'Title Tag Preview' },
				{ icon: 'zap', text: 'Meta Description Preview' },
			],
		},
	},
];

import { ToolCard } from '@/components/tools/ToolCard';
import { type Tool } from '@/lib/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedToolsStackProps {
	tools: Tool[];
	onCardClick: (tool: Tool) => void;
	onToolRatingUpdate: (
		toolId: string,
		newAverageRating: number,
		newNumberOfRatings: number
	) => void;
}

export function FeaturedToolsStack({
	tools,
	onCardClick,
	onToolRatingUpdate,
}: FeaturedToolsStackProps) {
	const component = useRef<HTMLDivElement>(null);
	const numTools = tools.length;
	useLayoutEffect(() => {
		if (!component.current || numTools === 0) return;

		const panels: HTMLDivElement[] = gsap.utils.toArray('.panel');
		if (panels.length === 0) return;

		const ctx = gsap.context(() => {
			gsap.set(panels.slice(1), { xPercent: 100 });
			gsap.set(panels[0], { xPercent: 0 });

			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: component.current,
					start: 'top top',
					end: 'bottom bottom',
					scrub: true,
				},
			});
			panels.forEach((panel, i) => {
				if (i === panels.length - 1) return;
				const nextPanel = panels[i + 1];
				timeline.to(panel, {
					xPercent: 50,
					opacity: 0,
					ease: 'power1.in',
				});
				timeline.to(
					nextPanel,
					{
						xPercent: 0,
						ease: 'power2.out',
					},
					'<'
				);
			});
		}, component);

		return () => ctx.revert();
	}, [tools, numTools]);

	if (numTools === 0) {
		return null;
	}
	return (
		<section className="bg-background pt-20">
			<div className="text-center max-w-3xl mx-auto mb-16 px-4">
				<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Top AI SEO Tools This Week
				</h2>
				<p className="mt-4 text-lg text-muted-foreground">
					A curated look at the most innovative tools our experts are watching
					right now.
				</p>
			</div>
			<div
				ref={component}
				className="relative"
				style={{ height: `${numTools * 100}vh` }}>
				<div className="sticky top-0 h-screen w-full overflow-hidden">
					<div className="relative h-full w-full">
						{tools.map((tool, index) => (
							<div
								key={tool._id}
								className="panel absolute top-0 left-0 h-full w-full flex items-center justify-center px-4 sm:px-8"
								style={{ zIndex: index + 1 }}>
								<ToolCard
									tool={tool}
									onCardClick={() => onCardClick(tool)}
									onToolRatingUpdate={onToolRatingUpdate}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

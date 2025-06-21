// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit } from 'lucide-react';

interface IntelligentSearchBarProps {
	searchTerm: string;
	onSearchTermChange: (term: string) => void;
	onSearchSubmit: (e: React.FormEvent) => void;
}

export function IntelligentSearchBar({
	searchTerm,
	onSearchTermChange,
	onSearchSubmit,
}: IntelligentSearchBarProps) {
	return (
		<form
			onSubmit={onSearchSubmit}
			className="relative flex w-full max-w-xl items-center">
			<BrainCircuit className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
			<Input
				type="search"
				placeholder="Find a tool for programmatic internal linking..."
				className="h-14 w-full rounded-full bg-background/80 pl-12 pr-40 text-base shadow-inner-md backdrop-blur-sm focus-visible:ring-primary/30"
				value={searchTerm}
				onChange={(e) => onSearchTermChange(e.target.value)}
			/>
		</form>
	);
}

{
	/* Redesigned Button with Gradient Border and Glow Effect */
}
{
	/* <div className="absolute right-2.5 h-10 group">
				<Button
					type="submit"
					className="h-full rounded-full px-6 bg-primary text-primary-foreground 
                               transition-all duration-300 ease-in-out
                               hover:shadow-[0_0_20px_3px] hover:shadow-primary/40
                               focus:shadow-[0_0_20px_3px] focus:shadow-primary/40">
					<Search className="mr-2 h-4 w-4" />
					Search
				</Button>
			</div> */
}

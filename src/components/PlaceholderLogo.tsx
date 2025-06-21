// This component is a simple placeholder for tool logos.
export const PlaceholderLogo = ({ name }: { name: string }) => (
	<div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
		<span className="text-2xl font-bold text-muted-foreground">
			{name.charAt(0)}
		</span>
	</div>
);

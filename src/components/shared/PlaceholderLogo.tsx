export const PlaceholderLogo = ({ name }: { name: string }) => (
	<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold text-muted-foreground">
		{name.charAt(0).toUpperCase()}
	</div>
);

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export function ListToolPage() {
	return (
		<div className="py-12 bg-background">
			<div className="container mx-auto px-4">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold tracking-tight">
							List Your AI Tool
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Fill out the form below to submit your tool for review by our
							team.
						</p>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Tool Information</CardTitle>
							<CardDescription>
								Provide the essential details about your tool.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="tool-name">Tool Name</Label>
								<Input
									id="tool-name"
									placeholder="e.g., Nexus Content Strategist"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="tool-tagline">Tagline</Label>
								<Input
									id="tool-tagline"
									placeholder="A short, catchy one-liner."
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="tool-description">Full Description</Label>
								<Textarea
									id="tool-description"
									placeholder="Describe what your tool does, who it's for, and its key features."
								/>
							</div>

							<div className="space-y-2">
								<Label>Tool Type</Label>
								<RadioGroup
									defaultValue="website"
									className="flex items-center gap-6">
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="website" id="r1" />
										<Label htmlFor="r1">Website / Web App</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="mobile" id="r2" />
										<Label htmlFor="r2">Mobile App</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="space-y-2">
								<Label htmlFor="tool-url">Website URL</Label>
								<Input id="tool-url" placeholder="https://example.com" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="tool-logo">Logo URL</Label>
								<Input
									id="tool-logo"
									placeholder="https://example.com/logo.png"
								/>
							</div>

							<Button size="lg" className="w-full">
								Submit for Review
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

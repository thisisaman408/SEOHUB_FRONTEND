import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { useAuth } from '@/context/AuthContext';
import { getMyTools } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { EditableToolCardModal } from '@/components/EditableToolCardModal';

const statusColorMap: { [key: string]: string } = {
	pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
	approved: 'bg-green-100 text-green-800 border-green-300',
	rejected: 'bg-red-100 text-red-800 border-red-300',
};

export function MyToolsPage() {
	const [tools, setTools] = useState<Tool[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();

	const fetchMyTools = async () => {
		try {
			const data = await getMyTools();
			setTools(data);
		} catch (error) {
			if (user) {
				toast.error('Failed to fetch your tools. Please try again.');
			}
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (user) {
			fetchMyTools();
		} else {
			setTools([]);
			setIsLoading(false);
		}
	}, [user]);

	const handleToolUpdate = () => {
		fetchMyTools();
	};

	return (
		<>
			<div className="container mx-auto py-12 px-4">
				<Card className="w-full max-w-4xl mx-auto">
					<CardHeader className="flex flex-row justify-between items-center">
						<div>
							<CardTitle className="text-3xl">My Tool Submissions</CardTitle>
							<CardDescription>
								Here is the status of all the tools you have submitted for
								review.
							</CardDescription>
						</div>
						<Button onClick={() => navigate('/submit-tool')}>
							Submit New Tool
						</Button>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="text-center p-8 text-muted-foreground">
								Loading your tools...
							</div>
						) : (
							<div className="border rounded-md">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[40%]">Tool Name</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Submitted On</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tools.length > 0 ? (
											tools.map((tool) => (
												<TableRow
													key={tool._id}
													onClick={() => setSelectedTool(tool)}
													className="cursor-pointer hover:bg-muted/50">
													<TableCell className="font-medium">
														{tool.name}
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={`capitalize ${
																statusColorMap[tool.status]
															}`}>
															{tool.status}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														{new Date(tool.createdAt).toLocaleDateString()}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={3}
													className="text-center h-24 text-muted-foreground">
													You haven't submitted any tools yet.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			{selectedTool && (
				<EditableToolCardModal
					tool={selectedTool}
					onClose={() => setSelectedTool(null)}
					onUpdate={handleToolUpdate}
				/>
			)}
		</>
	);
}

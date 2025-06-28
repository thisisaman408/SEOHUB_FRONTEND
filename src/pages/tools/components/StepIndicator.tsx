// src/pages/tools/components/StepIndicator.tsx - Updated for 4 steps
interface StepIndicatorProps {
	currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
	const steps = [
		{ number: 1, title: 'Core Details' },
		{ number: 2, title: 'Links & Tags' },
		{ number: 3, title: 'Media Gallery' },
		{ number: 4, title: 'Card Visuals' },
	];

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
			<h3 className="font-semibold mb-4">Progress</h3>
			<div className="space-y-3">
				{steps.map((step) => (
					<div
						key={step.number}
						className={`flex items-center gap-3 p-2 rounded ${
							step.number === currentStep
								? 'bg-primary/10 text-primary'
								: step.number < currentStep
								? 'bg-green-50 text-green-700'
								: 'text-muted-foreground'
						}`}>
						<div
							className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
								step.number === currentStep
									? 'bg-primary text-white'
									: step.number < currentStep
									? 'bg-green-500 text-white'
									: 'bg-gray-200 text-gray-600'
							}`}>
							{step.number < currentStep ? '✓' : step.number}
						</div>
						<span className="text-sm font-medium">{step.title}</span>
					</div>
				))}
			</div>
			<div className="mt-4 pt-4 border-t">
				<p className="text-sm text-muted-foreground">
					Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
				</p>
			</div>
		</div>
	);
}

// components/ui/radio-group.tsx
import { cn } from '@/lib/utils'; // Make sure this exists
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

const RadioGroup = RadioGroupPrimitive.Root;

const RadioGroupItem = ({
	className,
	...props
}: RadioGroupPrimitive.RadioGroupItemProps) => {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				'h-4 w-4 rounded-full border border-primary text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<div className="h-2 w-2 rounded-full bg-primary" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
};

export { RadioGroup, RadioGroupItem };

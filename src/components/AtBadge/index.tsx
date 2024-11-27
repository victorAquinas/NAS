type BadgeVariantType =
	| 'primary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'light'
	| 'dark';
interface AtBadgeProps {
	label: string;
	variant: BadgeVariantType;
	className?: string;
}
export const AtBadge = ({ label, variant, className }: AtBadgeProps) => {
	const getBadgeVariant = (variant: BadgeVariantType) => {
		switch (variant) {
			case 'primary':
				return 'bg-primary text-white';
			case 'dark':
				return 'bg-secondary text-white';
			case 'success':
				return 'bg-success text-white';
			case 'danger':
				return 'bg-red-500 text-white';
			case 'warning':
				return 'bg-yellow-500 text-white';
			case 'info':
				return 'bg-cyan-500 text-white';
			case 'light':
				return 'bg-white text-secondary';
		}
	};
	return (
		<span
			className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset ring-gray-500/10 ${className} ${getBadgeVariant(
				variant
			)}`}
		>
			{label}
		</span>
	);
};

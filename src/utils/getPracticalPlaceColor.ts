import { BadgeVariantType } from '../components/AtBadge';

export const getPracticalPlaceColor = (placeType: string): BadgeVariantType => {
	switch (placeType.toLowerCase()) {
		case 'in-site':
			return 'warning';
		case 'off-site':
			return 'dark';
		default:
			return 'dark';
	}
};

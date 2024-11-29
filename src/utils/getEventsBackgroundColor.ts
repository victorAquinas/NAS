export const getEventsBackgroundColor = (group: number) => {
	switch (group) {
		case 1:
			return '#DFF3EF';
		case 2:
			return '#90CAF9';
		case 3:
			return '#E9D8A6';
		case 4:
			return '#94D2BD';
		case 5:
			return '#FF99C8';
		case 6:
			return '#E0AAFF';
		case 7:
			return '#FFFF3F';
		case 8:
			return '#F19C79';
		case 9:
			return '#D4E09B';
		case 10:
			return '#FDE2E4';
		case 11:
			return '#98F5E1';
		case 12:
			return '#B9FBC0';
		case 13:
			return '#CFBAF0';
		case 14:
			return '#FF70A6';

		default:
			return '#8AC926';
	}
};

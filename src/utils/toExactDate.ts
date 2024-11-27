export const toExactDate = (dateString: string): Date => {
	// Parse the date string
	const [year, month, day] = dateString.split('-').map(Number);

	// Create a new Date object with month as zero-based
	return new Date(year, month - 1, day);
};

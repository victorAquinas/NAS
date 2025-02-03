export const truncateText = (text: string, maxLength: number = 84): string => {
	if (text.length > maxLength) {
		return text.slice(0, maxLength) + '...';
	}
	return text;
};

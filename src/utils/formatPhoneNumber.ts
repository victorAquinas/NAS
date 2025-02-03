export const formatPhoneNumber = (phone: string): string => {
	const cleaned = phone.replace(/\D/g, '');

	if (cleaned.length !== 10) {
		return phone;
	}

	const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
		3,
		6
	)}-${cleaned.slice(6)}`;
	return formatted;
};

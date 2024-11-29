export const transformToUrlParams = (input: string) => {
	const params = new URLSearchParams();
	const keyValuePairs = input.split('&');

	keyValuePairs.forEach((pair) => {
		const [key, value] = pair.split('=');
		params.append(key, value);
	});

	return params.toString();
};

import { useState, useCallback } from 'react';

type SetState<S> = (state: Partial<S> | ((prevState: S) => Partial<S>)) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useSetState<S extends Record<string, any>>(
	initialState: S
): [S, SetState<S>] {
	const [state, setState] = useState<S>(initialState);

	const setMergedState: SetState<S> = useCallback((patch) => {
		setState((prevState) => ({
			...prevState,
			...(typeof patch === 'function' ? patch(prevState) : patch),
		}));
	}, []);

	return [state, setMergedState];
}

export default useSetState;

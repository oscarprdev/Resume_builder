import { useEffect, useOptimistic } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';
import { UseOptimisticFormStateInput, UseOptimisticFormStateOutput } from './useOptimisticFormState.types';

export function useOptimisticFormState<S extends FieldValues>({
	defaultValues,
	setDefaultValues,
}: UseOptimisticFormStateInput<S>): UseOptimisticFormStateOutput<S> {
	const [optimisticFormValues, updateFormValues] = useOptimistic<S, S>(defaultValues, (_: S, optimistic: S) => ({
		...optimistic,
	}));

	useEffect(() => {
		setDefaultValues(optimisticFormValues as DefaultValues<S>);
	}, [defaultValues]);

	return { updateFormValues };
}
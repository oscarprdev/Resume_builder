'use client';

import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AsideFormLanguagesList from './AsideFormLanguagesList';
import { ResumeLanguagesDefaultValues } from '@/store/useResumeLanguagesStore';
import { Either } from '@/lib/either';
import { useRouterAfterSubmit } from '@/hooks/useRouterAfterSubmit';
import { useSearchParams, useRouter } from 'next/navigation';
import { asideFormLanguagesSchema } from './schema-validations';
import SectionActions from '../shared/components/SectionActions';
import { useDynamicForm } from '@/hooks/useDynamicForm';

interface AsideFormLanguagesProps {
	handleSubmit: (values: z.infer<typeof asideFormLanguagesSchema>) => Promise<Either<string, string>>;
	defaultValues?: ResumeLanguagesDefaultValues;
}

export type LanguagesFormState = ResumeLanguagesDefaultValues;

const AsideFormLanguages = ({ defaultValues, handleSubmit }: AsideFormLanguagesProps) => {
	const router = useRouter();
	const params = useSearchParams();
	const routerAfterSubmit = useRouterAfterSubmit(router, params);

	const form = useDynamicForm<LanguagesFormState>({ schema: asideFormLanguagesSchema, defaultValues });

	const onSubmit = async (values: z.infer<typeof asideFormLanguagesSchema>) => {
		const response = await handleSubmit(values);

		routerAfterSubmit(response);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 animate-fade-up'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-sm text-gray-500'>Languages title</FormLabel>
							<FormControl>
								<Input
									required
									placeholder='Title'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<AsideFormLanguagesList form={form} />
				<SectionActions loading={form.formState.isSubmitting} />
			</form>
		</Form>
	);
};

export default AsideFormLanguages;
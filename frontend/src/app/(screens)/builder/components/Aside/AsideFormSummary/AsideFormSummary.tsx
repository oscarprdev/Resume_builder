'use client';

import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeSummaryDefaultValues } from '@/store/useResumeSummaryStore';
import { useRouterAfterSubmit } from '@/hooks/useRouterAfterSubmit';
import { Either } from '@/lib/either';
import { useSearchParams, useRouter } from 'next/navigation';
import SectionActions from '../shared/components/SectionActions';
import { useDynamicForm } from '@/hooks/useDynamicForm';

interface AsideFormSummaryProps {
	defaultValues?: ResumeSummaryDefaultValues;
	handleSubmit: (values: z.infer<typeof asideFormSummarySchema>) => Promise<Either<string, string>>;
}

export const asideFormSummarySchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	summary: z.string().max(300, {
		message: 'Summary must be less than 300 characters.',
	}),
});

const AsideFormSummary = ({ defaultValues, handleSubmit }: AsideFormSummaryProps) => {
	const router = useRouter();
	const params = useSearchParams();
	const routerAfterSubmit = useRouterAfterSubmit(router, params);

	const form = useDynamicForm<ResumeSummaryDefaultValues>({ schema: asideFormSummarySchema, defaultValues });

	const onSubmit = async (values: z.infer<typeof asideFormSummarySchema>) => {
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
							<FormLabel className='text-sm text-gray-500'>Summary title</FormLabel>
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
				<FormField
					control={form.control}
					name='summary'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-sm text-gray-500'>Summary description</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Description'
									className='min-h-[150px]'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SectionActions loading={form.formState.isSubmitting} />
			</form>
		</Form>
	);
};

export default AsideFormSummary;
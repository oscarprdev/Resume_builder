import ViewerSkillIcon from '../Icons/SkillsIcons';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { defaultLanguage, defaultSkill } from '@/data/default-resume';
import { DefaultResumeSkills } from '@/data/default-resume.types';
import { Either, isError } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RESUME_THEME, useResumeThemeStore } from '@/store/useResumeThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconTextPlus, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

export type ResumeSkillsFormValues = z.infer<typeof resumeSkillsFormSchema>;
type ResumeSkillsFormProps = {
	handleSubmit(values: ResumeSkillsFormValues): Promise<void>;
	afterResumeSkillsFormSubmit(): void;
	submitResponse: Either<string, string> | undefined;
	defaultValues: DefaultResumeSkills;
};

const resumeSkillsFormSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	skillList: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
		})
	),
	isHidden: z.boolean(),
	error: z.union([z.string(), z.null()]),
});

const ResumeSkillsForm = ({
	handleSubmit,
	afterResumeSkillsFormSubmit,
	submitResponse,
	defaultValues,
}: ResumeSkillsFormProps) => {
	const [isFocused, setIsFocused] = useState(false);

	const { theme } = useResumeThemeStore();

	const form = useForm<ResumeSkillsFormValues>({
		resolver: zodResolver(resumeSkillsFormSchema),
		defaultValues: { ...defaultValues, error: null },
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'skillList' as never,
	});

	const debounced = useDebouncedCallback(() => {
		handleSubmit(form.getValues());
	}, 500);

	useEffect(() => {
		if (submitResponse) {
			if (isError(submitResponse)) {
				return form.setValue('error', submitResponse.error);
			} else {
				afterResumeSkillsFormSubmit();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitResponse]);

	return (
		<Form {...form}>
			<form
				onChange={debounced}
				onMouseEnter={() => setIsFocused(true)}
				onMouseLeave={() => setIsFocused(false)}
				className="relative flex flex-col w-full hover:bg-zinc-100/50 duration-200 pl-5">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									variant={'resume'}
									className={cn(theme === RESUME_THEME.DEFAULT && 'text-2xl font-bold')}
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center justify-start flex-wrap gap-2 w-full">
					{isFocused && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										size={'sm'}
										className="absolute top-2 right-2 bg-zinc-100/50 hover:bg-zinc-200/50 p-2 border shadow-sm w-fit"
										onClick={() => append(defaultSkill)}>
										<IconTextPlus size={16} className="text-zinc-400" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right">
									<p className="text-xs">Add skill</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
					{fields.map((field, index) => (
						<article key={field.id} className="relative flex flex-col gap-0">
							{isFocused && (
								<IconX
									onClick={() => remove(index)}
									size={14}
									className="text-zinc-400 hover:text-zinc-900 absolute -left-4 top-[0.8rem] cursor-pointer duration-200"
								/>
							)}

							<FormField
								control={form.control}
								name={`skillList.${index}.name`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="flex items-center justify-between gap-2 px-2 -py-1 rounded-md bg-zinc-200/50">
												<ViewerSkillIcon value={field.value} />
												<Input
													{...field}
													{...form.register(`skillList.${index}.name`)}
													className={cn(
														field.value.length > 6 && '-mr-2',
														theme === RESUME_THEME.DEFAULT &&
															'text-zinc-700 text-xs leading-tight h-fit py-2 w-fit'
													)}
													kind={'dynamic'}
													variant={'resume'}
													required
												/>
											</div>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</article>
					))}
				</div>
				<div className="relative flex flex-col items-center w-full gap-2 mt-6">
					{form.watch('error') && (
						<FormMessage className="absolute -top-5 w-[200%] text-center">
							{form.getValues('error')}
						</FormMessage>
					)}
				</div>
			</form>
		</Form>
	);
};

export default ResumeSkillsForm;
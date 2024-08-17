import HeaderLinksIcons from '../Icons/HeaderLinksIcons';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { DEFAULT_IMAGE, useHeaderFormImage } from '@/app/hooks/useHeaderFormImage';
import { DefaultResumeHeader } from '@/data/default-resume.types';
import { Either, isError } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RESUME_THEME, useResumeThemeStore } from '@/store/useResumeThemeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	IconFileX,
	IconLinkPlus,
	IconLoader2,
	IconMail,
	IconMapPin,
	IconPhone,
	IconUpload,
	IconX,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

export type ResumeHeaderFormValues = z.infer<typeof resumeHeaderFormSchema>;
type ResumeHeaderFormProps = {
	handleSubmit(values: ResumeHeaderFormValues): Promise<void>;
	afterResumeHeaderFormSubmit(): void;
	submitResponse: Either<string, string> | undefined;
	defaultValues: DefaultResumeHeader;
	resumeId: string;
};

const resumeHeaderFormSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	job: z.string(),
	location: z.string(),
	email: z.string(),
	phone: z.string(),
	links: z.array(z.string()),
	image: z.string().optional(),
	isHidden: z.boolean(),
	error: z.union([z.string(), z.null()]),
});

const ResumeHeaderForm = ({
	handleSubmit,
	afterResumeHeaderFormSubmit,
	submitResponse,
	defaultValues,
	resumeId,
}: ResumeHeaderFormProps) => {
	const [isFocused, setIsFocused] = useState(false);

	const { theme } = useResumeThemeStore();

	const form = useForm<ResumeHeaderFormValues>({
		resolver: zodResolver(resumeHeaderFormSchema),
		defaultValues: { ...defaultValues, error: null },
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'links' as never,
	});

	const debounced = useDebouncedCallback(() => {
		handleSubmit(form.getValues());
	}, 500);

	const updateImageForm = (imageUrl: string) => {
		form.setValue('image', imageUrl);
	};

	const { imageLoading, fileInput, handleInputFileChange, handleBrowseImageClick, handleRemoveImageClick } =
		useHeaderFormImage(resumeId, updateImageForm);

	useEffect(() => {
		if (submitResponse) {
			if (isError(submitResponse)) {
				return form.setValue('error', submitResponse.error);
			} else {
				afterResumeHeaderFormSubmit();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitResponse]);

	const imageValue = useWatch({
		control: form.control,
		name: 'image',
	});

	useEffect(() => {
		if (imageValue) {
			debounced();
		}
	}, [imageValue, debounced, fields]);

	return (
		<Form {...form}>
			<form
				onChange={debounced}
				onMouseEnter={() => setIsFocused(true)}
				onMouseLeave={() => setIsFocused(false)}
				className="relative flex flex-col w-full hover:bg-zinc-100/50 duration-200 pl-5 pb-2">
				<div className="flex flex-col gap-2 w-[100px] absolute top-5 right-5">
					<picture className="relative rounded-md w-full max-h-[110px]">
						{imageLoading && (
							<div className={cn('absolute size-[110px] opacity-60 bg-black grid place-items-center')}>
								<span className="animate-spin">
									<IconLoader2 size={20} className="text-white" />
								</span>
							</div>
						)}
						{imageValue === DEFAULT_IMAGE && isFocused ? (
							<Image src={DEFAULT_IMAGE} alt="Resume image" width={600} height={600} />
						) : (
							imageValue !== DEFAULT_IMAGE &&
							imageValue && <Image src={imageValue} alt="Resume image" width={600} height={600} />
						)}
					</picture>

					<input
						ref={fileInput}
						type="file"
						accept="image/png, image/jpeg, image/webp"
						hidden
						onChange={handleInputFileChange}
					/>
					{isFocused && (
						<div className="flex items-center gap-2 w-full justify-center">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											className="bg-zinc-100/50 hover:bg-zinc-200/50 p-2 border shadow-sm"
											size={'sm'}
											onClick={() => handleBrowseImageClick()}>
											<IconUpload size={16} className="text-zinc-400" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p className="text-xs">Browse image</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											size={'sm'}
											className="bg-zinc-100/50 hover:bg-zinc-200/50 p-2 border shadow-sm"
											onClick={() => handleRemoveImageClick()}>
											<IconFileX size={16} className="text-zinc-400" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p className="text-xs">Remove image</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					)}
				</div>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									variant={'resume'}
									className={cn(theme === RESUME_THEME.DEFAULT && 'text-3xl font-bold')}
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="job"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									maxLength={120}
									kind="header"
									className={cn(
										!isFocused && 'resize-none',
										theme === RESUME_THEME.DEFAULT &&
											'text-lg text-zinc-700 mt-1 h-fit max-w-[550px]'
									)}
									variant={'resume'}
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center gap-2 justify-start">
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-center gap-1 w-fit">
										<IconMapPin size={14} className="text-zinc-700" />
										<Input
											kind="dynamic"
											className={cn(
												theme === RESUME_THEME.DEFAULT &&
													'text-md text-zinc-700 w-fit text-sm -mr-7'
											)}
											variant={'resume'}
											required
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-center gap-1 w-fit">
										<IconPhone size={14} className="text-zinc-700" />
										<Input
											kind="dynamic"
											className={cn(
												theme === RESUME_THEME.DEFAULT && 'text-md text-zinc-700 w-fit text-sm'
											)}
											variant={'resume'}
											required
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-center gap-1 w-fit">
										<IconMail size={14} className="text-zinc-700" />
										<Input
											kind="dynamic"
											className={cn(
												theme === RESUME_THEME.DEFAULT && 'text-md text-zinc-700 w-fit text-sm'
											)}
											variant={'resume'}
											required
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="relative flex flex-col gap-0 w-fit">
					{fields.map((field, index) => (
						<article key={field.id} className="relative w-fit flex items-center -mt-2 last-of-type:-mt-3">
							{isFocused && (
								<IconX
									onClick={() => remove(index)}
									size={14}
									className="text-zinc-400 hover:text-zinc-900 absolute -left-4 cursor-pointer duration-200"
								/>
							)}
							<FormField
								control={form.control}
								name={`links.${index}`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="flex items-center gap-1 w-fit ">
												<HeaderLinksIcons value={field.value} />
												<Input
													{...field}
													{...form.register(`links.${index}`)}
													className={cn(
														theme === RESUME_THEME.DEFAULT &&
															'text-md text-zinc-700 w-[350px] text-sm '
													)}
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
					{isFocused && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										size={'sm'}
										className="absolute -bottom-7 bg-zinc-100/50 hover:bg-zinc-200/50 p-2 border shadow-sm w-fit"
										onClick={() => append('http://www.your-url.com')}>
										<IconLinkPlus size={16} className="text-zinc-400" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="left">
									<p className="text-xs">Add link</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
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

export default ResumeHeaderForm;

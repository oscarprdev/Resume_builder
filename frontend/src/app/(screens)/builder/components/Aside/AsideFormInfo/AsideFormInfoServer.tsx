'use server';

import { Either, isLeft } from '@/lib/either';
import AsideFormInfo, { asideFormInfoSchema } from './AsideFormInfo';
import { z } from 'zod';
import { postCallback, getCallback } from '@/services';
import ErrorMessage from '../../ErrorMessage';
import { describeResumeAction } from '@/app/actions/resume/describe-resume.action';
import { ResumeInfoDefaultValues } from '@/store/useResumeInfoStore';
import { updateResumeInfoAction } from './actions/update-resume-info';

interface AsideFormInfoServerProps {
	userId: string;
	resumeId?: string | null;
}

const DEFAULT_INFO_VALUES: ResumeInfoDefaultValues = {
	title: '',
};

const AsideFormInfoServer = async ({ userId, resumeId }: AsideFormInfoServerProps) => {
	const handleServerSubmit = async (values: z.infer<typeof asideFormInfoSchema>): Promise<Either<string, string>> => {
		'use server';
		return await updateResumeInfoAction({
			userId,
			resumeId: resumeId || crypto.randomUUID().toString(),
			payload: { title: values.title },
			postCallback,
		});
	};

	if (!resumeId) {
		return (
			<AsideFormInfo
				handleSubmit={handleServerSubmit}
				defaultValues={DEFAULT_INFO_VALUES}
			/>
		);
	}

	const response = await describeResumeAction({ userId, resumeId, getCallback });
	if (isLeft(response)) {
		return <ErrorMessage />;
	}

	return (
		<AsideFormInfo
			defaultValues={{ title: response.right.title }}
			handleSubmit={handleServerSubmit}
		/>
	);
};

export default AsideFormInfoServer;
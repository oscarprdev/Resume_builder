'use server';

import { postCallback, getCallback } from '@/lib/service.utils';
import AsideFormExperience from './AsideFormExperience';
import { z } from 'zod';
import { Either, isLeft } from '@/lib/either';
import ErrorMessage from '../../ErrorMessage';
import { describeResumeAction } from '@/app/actions';
import { describeResumeExperienceAction, updateResumeExperienceAction } from '@/app/builder/components/Aside/AsideFormExperience/actions';
import { asideFormExperienceSchema } from './schema-validations';

interface AsideFormExperienceServerProps {
	userId: string;
	resumeId?: string | null;
}

const AsideFormExperienceServer = async ({ userId, resumeId }: AsideFormExperienceServerProps) => {
	const handleServerSubmit = async (values: z.infer<typeof asideFormExperienceSchema>): Promise<Either<string, string>> => {
		'use server';
		return await updateResumeExperienceAction({
			userId,
			resumeId: resumeId || crypto.randomUUID().toString(),
			payload: { title: values.title, jobList: values.jobList },
			postCallback,
		});
	};

	if (!resumeId) {
		return <AsideFormExperience handleSubmit={handleServerSubmit} />;
	}

	const describeResumeActionResponse = await describeResumeAction({ userId, resumeId, getCallback });
	if (isLeft(describeResumeActionResponse)) {
		return <ErrorMessage />;
	}

	if (!describeResumeActionResponse.right.experience) {
		return <AsideFormExperience handleSubmit={handleServerSubmit} />;
	}

	const response = await describeResumeExperienceAction({ userId, resumeId, getCallback });
	if (isLeft(response)) {
		return <ErrorMessage />;
	}

	return (
		<AsideFormExperience
			defaultValues={response.right}
			handleSubmit={handleServerSubmit}
		/>
	);
};

export default AsideFormExperienceServer;
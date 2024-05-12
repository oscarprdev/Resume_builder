import { generateUUID } from '../../../../core/application/utils/generateUuid';
import { Header, Resume } from '../../../../core/domain/types';
import { CommonResumePorts } from '../../common/common.ports';
import { DefaultCommonResumeUsecase } from '../../common/common.use_case';
import { UpdateResumePorts } from './update_resume.ports';

interface UpdateResumeUsecaseExecuteInput {
	userId: string;
	resumeId: string;
	data: Resume;
}

export interface UpdateResumeUsecase {
	execute(input: UpdateResumeUsecaseExecuteInput): Promise<void>;
}

export class DefaultUpdateResumeUsecase extends DefaultCommonResumeUsecase implements UpdateResumeUsecase {
	constructor(private readonly ports: UpdateResumePorts, protected readonly commonPorts: CommonResumePorts) {
		super(commonPorts);
	}

	async execute({ userId, resumeId, data }: UpdateResumeUsecaseExecuteInput) {
		const currentUser = await this.validateUser({ userId });
		const currentResume = await this.validateResume({ resumeId, userId: currentUser.id });

		if (!currentResume) {
			const newResumeId = generateUUID();
			await this.createResume({ resumeId: newResumeId, ownerId: currentUser.id });

			return await this.ports.updateResume({ resumeId: newResumeId, data });
		}

		return await this.ports.updateResume({ resumeId, data });
	}
}
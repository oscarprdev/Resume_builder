import { Header } from '../../../core/domain/types';

export type ErrorActions = 'createResume' | 'getHeader' | 'createHeader' | 'insertHeader' | 'updateHeader';

export interface CreateHeaderInfrastructureInput {
	headerResumeId: string;
	data: HeaderPayload;
}

export interface CreateResumeInfrastructureInput {
	resumeId: string;
	ownerId: string;
}

export interface HeaderPayload extends Omit<Header, 'links'> {
	links: string;
}

export interface InsertHeaderInfrastructureInput {
	headerResumeId: string;
	resumeId: string;
}

export interface GetHeaderInfrastructureInput {
	headerResumeId: string;
}

export interface UpdateHeaderInfrastructureInput {
	headerResumeId: string;
	data: HeaderPayload;
}

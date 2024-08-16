import { API_URL } from '@/constants';
import { Either, successResponse } from '@/lib/types';
import { handleErrorResponse } from '@/lib/utils';
import { Summary } from '@/types';

interface IResumeSummaryService {
	describe(resumeId: string): Promise<Either<string, Summary>>;
	update(values: Summary, resumeId: string): Promise<Either<string, string>>;
}

export class ResumeSummaryService implements IResumeSummaryService {
	constructor(private readonly userInfo: { userId: string }) {}

	async describe(resumeId: string) {
		try {
			const response = await fetch(`${API_URL}/resume/${this.userInfo.userId}/${resumeId}/summary`);
			const jsonResponse: Summary = await response.json();

			return successResponse(jsonResponse);
		} catch (error) {
			return handleErrorResponse(error, 'Error getting resume summary');
		}
	}

	async update(values: Summary, resumeId: string) {
		try {
			const response = await fetch(`${API_URL}/resume/${this.userInfo.userId}/${resumeId}/summary`, {
				method: 'POST',
				body: JSON.stringify(values),
			});
			const jsonResponse = await response.json();

			return successResponse('Summary successfully updatted');
		} catch (error) {
			return handleErrorResponse(error, 'Error on updatting summary resume');
		}
	}
}

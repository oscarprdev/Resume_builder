'use server';

import { BUCKET_ACCES_KEY, BUCKET_BASE_URL, BUCKET_KEY_ID, BUCKET_URL } from '@/constants';
import { Either, isLeft, left, right } from '@/lib/either';
import { Bucket } from '@oprdev/cloudflare-r2-storage';
import { removeImageAction } from './remove-image';

export interface UploadImageInput {
	formData: FormData;
	userId: string;
	resumeId: string;
}

export const uploadImageAction = async ({ formData, userId, resumeId }: UploadImageInput): Promise<Either<string, string>> => {
	try {
		const imageFile = formData.get('image') as File;
		const buffer = (await imageFile.arrayBuffer()) as Buffer;

		const id = `${userId}/${crypto.randomUUID().toString()}`;

		const bucket = new Bucket({
			endpoint: BUCKET_URL,
			accessKeyId: BUCKET_KEY_ID,
			secretAccessKey: BUCKET_ACCES_KEY,
			bucketName: 'resume',
		});

		const response = await removeImageAction({ resumeId });
		if (isLeft(response)) {
			throw new Error(response.left);
		}

		const uploadedImage = await bucket.uploadFile({
			file: buffer,
			id,
			contentType: imageFile.type,
			project: resumeId,
		});

		return right(`${BUCKET_BASE_URL}/${uploadedImage}`);
	} catch (error) {
		return left(error instanceof Error ? error.message : 'Error uploading image');
	}
};
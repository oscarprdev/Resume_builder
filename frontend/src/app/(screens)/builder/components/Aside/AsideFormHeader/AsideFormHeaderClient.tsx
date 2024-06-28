'use client';

import { useResumeHeaderStore } from '@/store/useResumeHeaderStore';
import AsideFormHeader from './AsideFormHeader';
import { left, right } from '@/lib/either';
import { useCallback } from 'react';
import { FormHeaderValues } from './schema-validations';

const AsideFormHeaderClient = () => {
	const headerStore = useResumeHeaderStore();

	const handleClientSubmit = async (values: FormHeaderValues) => {
		headerStore.updateHeader({ ...values });

		return right('');
	};

	const removeImage = useCallback(async () => {
		headerStore.updateHeader({ ...headerStore.resumeHeader, image: undefined });
		return right('');
	}, [headerStore]);

	const updateImage = useCallback(
		async (formData: FormData) => {
			const file = formData.get('image') as File;
			if (!file) {
				return left('File not valid');
			}
			const imageUrl = URL.createObjectURL(file);

			headerStore.updateHeader({ ...headerStore.resumeHeader, image: imageUrl });
			return right(imageUrl);
		},
		[headerStore]
	);

	return (
		<AsideFormHeader
			handleSubmit={handleClientSubmit}
			updateImage={updateImage}
			removeImage={removeImage}
		/>
	);
};

export default AsideFormHeaderClient;

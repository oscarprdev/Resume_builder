'use server';

import { revalidatePath as revalidate } from 'next/cache';

export const revalidatePath = (path?: string) => {
	revalidate(path || '/builder');
};

'use server';

import { IconPlus, IconMinus } from '@tabler/icons-react';
import Link from 'next/link';
import { SECTION_CONTROL, SectionControl } from '../_utils/sections';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';
import { Resume } from '@/types';

interface AsideSectionItemProps {
	label: string;
	control: SectionControl;
	sectionSelected: SectionControl | null;
	resumeId: string | null;
	user?: User;
	theme: Resume.theme;
}

const AsideSectionItem = async ({ label, control, sectionSelected, resumeId, user, theme }: AsideSectionItemProps) => {
	const isSectionSelected = (control: SectionControl, sectionSelected: SectionControl | null) => {
		if (control === SECTION_CONTROL.HEADER && !!sectionSelected) true;

		return sectionSelected === control;
	};

	const pathToRedirect = (resumeId: string | null, sectionSelected: SectionControl | null) => {
		const basePath = '/builder';
		const controlSelected = sectionSelected === control;

		if (!resumeId) {
			return controlSelected ? basePath : `${basePath}?selected=${control}`;
		}

		const resumePath = `${basePath}?resume=${resumeId}&theme=${theme}`;
		return controlSelected ? resumePath : `${resumePath}&selected=${control}`;
	};

	const isItemDisabled =
		(user && user.id && !resumeId && control !== SECTION_CONTROL.INFO) || (control === SECTION_CONTROL.THEMES && !user);

	return (
		<li
			data-testid={`aside-item-${control}`}
			className={cn(
				'cursor-pointer group w-full p-0 border border-transparent border-b-gray-200',
				isItemDisabled && 'bg-gray_light cursor-not-allowed'
			)}>
			<Link
				href={pathToRedirect(resumeId, sectionSelected)}
				className={cn('flex items-center p-5 justify-between', isItemDisabled && 'text-gray-300 cursor-not-allowed')}>
				<p
					className={cn(
						'text-sm group-hover:text-purple_200',
						isItemDisabled && 'group-hover:text-gray-300',
						isSectionSelected(control, sectionSelected) && 'text-purple_200'
					)}>
					{label}
				</p>
				{isSectionSelected(control, sectionSelected) ? (
					<IconMinus
						stroke={1}
						className={cn(
							'text-gray-700',
							isItemDisabled && 'text-gray-300 group-hover:text-gray-300',
							isSectionSelected(control, sectionSelected) && 'text-purple_200'
						)}
					/>
				) : (
					<IconPlus
						stroke={1}
						className={cn('text-gray-700 group-hover:text-purple_200', isItemDisabled && 'text-gray-300 group-hover:text-gray-300')}
					/>
				)}
			</Link>
		</li>
	);
};

export default AsideSectionItem;
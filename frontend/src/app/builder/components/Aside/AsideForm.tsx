'use server';

import { cn } from '@/lib/utils';
import { SECTION_CONTROL, SectionControl } from '../_utils/sections';
import AsideFormExperienceController from './AsideFormExperience/AsideFormExperienceController';
import AsideFormHeaderController from './AsideFormHeader/AsideFormHeaderController';
import AsideFormInfoController from './AsideFormInfo/AsideFormInfoController';
import AsideFormSummaryController from './AsideFormSummary/AsideFormSummaryController';
import AsideFormEducationController from './AsideFormEducation/AsideFormEducationController';
import AsideFormLanguagesController from './AsideFormLanguages/AsideFormLanguagesController';
import AsideFormSkillsController from './AsideFormSkills/AsideFormSkillsController';
import { User } from 'next-auth';

interface AsideFormProps {
	sectionSelected: SectionControl | null;
	resumeId: string | null;
	user?: User;
}

const AsideForm = async ({ sectionSelected, resumeId, user }: AsideFormProps) => {
	const renderSelectedForm = (sectionSelected: SectionControl | null) => {
		switch (sectionSelected) {
			case SECTION_CONTROL.INFO:
				return (
					<AsideFormInfoController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.HEADER:
				return (
					<AsideFormHeaderController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.SUMMARY:
				return (
					<AsideFormSummaryController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.EXPERIENCE:
				return (
					<AsideFormExperienceController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.EDUCATION:
				return (
					<AsideFormEducationController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.LANGUAGES:
				return (
					<AsideFormLanguagesController
						resumeId={resumeId}
						user={user}
					/>
				);
			case SECTION_CONTROL.SKILLS:
				return (
					<AsideFormSkillsController
						resumeId={resumeId}
						user={user}
					/>
				);
			default:
				break;
		}
	};

	return (
		<section
			className={cn(
				'z-5 bg-white w-1/4 min-w-[400px] p-5 overflow-scroll border border-transparent border-r-gray-200 shadow-md hidden',
				sectionSelected ? 'animate-fade-right block' : 'animate-fade-left '
			)}>
			{renderSelectedForm(sectionSelected)}
		</section>
	);
};

export default AsideForm;

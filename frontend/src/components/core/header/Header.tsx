'use server';

import Link from 'next/link';
import DownloadResumeButton from '../buttons/DownloadResumeButton';
import { useUserLogged } from '@/hooks/useUserLogged';
import AuthSection from './AuthSection';
import { IconCircleTriangle } from '@tabler/icons-react';

const Header = async () => {
	const user = await useUserLogged();

	return (
		<header className='bg-white py-4 px-10 border-b border-b-gray-200 shadow-b-lg flex items-center justify-between'>
			<Link
				href={'/'}
				className='flex items-center gap-2'>
				<IconCircleTriangle size={20} />
				Resummie
			</Link>
			<div className='flex items-center gap-2'>
				<DownloadResumeButton user={user} />
				<AuthSection user={user} />
			</div>
		</header>
	);
};

export default Header;

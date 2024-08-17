'use client';

import AuthModal from '../Modals/AuthModal';
import DownloadPDFButton, { DownloadPDFButtonRef } from './DownloadPDFButton';
import LogoutButton from './LogoutButton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { IconLocation } from '@tabler/icons-react';
import { useRef } from 'react';

type DropdownLoggedProps = {
	username: string | null;
};

const DropdownLogged = ({ username }: DropdownLoggedProps) => {
	const downloadPDFButtonRef = useRef<DownloadPDFButtonRef>(null);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<span className="text-zinc-500 text-sm font-bold flex items-center gap-1 hover:text-zinc-800 duration-200 py-2 px-4 hover:bg-zinc-200/50 rounded-lg cursor-pointer">
					<IconLocation className="" size={18} />
					Actions
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-32 text-zinc-700">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => downloadPDFButtonRef.current?.handleDownloadPdf()}>
					<DownloadPDFButton ref={downloadPDFButtonRef} />
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{username ? <LogoutButton /> : <AuthModal />}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DropdownLogged;

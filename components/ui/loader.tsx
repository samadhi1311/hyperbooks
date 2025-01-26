import { Loader2Icon } from 'lucide-react';

export default function Loader() {
	return (
		<div className='flex h-full w-full items-center justify-center'>
			<Loader2Icon className='size-5 animate-spin' />
		</div>
	);
}

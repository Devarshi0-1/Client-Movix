import useLogout from '@/hooks/Auth/useLogout';
import { cn } from '@/lib/utils';
import { LogOutIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import MovixIcon from './../assets/movix-logo.svg';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';

const Navbar = ({ className, children }: ComponentProps<'nav'>) => {
	const { logout } = useLogout();

	return (
		<nav
			className={cn(
				'bg-secondary/30 fixed backdrop-blur-sm top-0 w-full flex justify-between items-center px-36 py-2',
				className
			)}>
			<Link to='/'>
				<img
					src={MovixIcon}
					alt='Movix Icon'
				/>
			</Link>

			<div className='navHoverAnimation flex items-center justify-center gap-10'>
				{children}

				<div className='flex items-center gap-2'>
					<ModeToggle />
					<Button
						variant='ghost'
						size='icon'
						className='border rounded-full aspect-square'
						onClick={logout}>
						<LogOutIcon className='w-5 h-5' />
					</Button>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;

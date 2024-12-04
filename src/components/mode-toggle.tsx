import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export function ModeToggle() {
	const { setTheme } = useTheme();

	const handleToggleTheme = () => {
		if (document.documentElement.classList.contains('dark')) {
			setTheme('light');
		} else {
			setTheme('dark');
		}
	};

	return (
		<Button
			onClick={handleToggleTheme}
			variant='outline'
			size='icon'
			className='aspect-square rounded-full bg-primary-foreground/10'>
			<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}
import clsx from 'clsx'
import { Link } from '@tanstack/react-router'

import { MainNav } from '../MainNav'

export const ApplicationBar = () => {
	return (
		<header
			className={clsx(
				'flex flex-row flex-wrap w-screen box-border shrink-0 fixed top-0 left-auto right-0 z-20'
			)}>
			<div className='min-h-fit w-screen relative flex justify-between items-center h-20 border-b border-b-black px-6'>
				<Link to='/'>
					<h2>TS Fullstack Monorepo Template</h2>
				</Link>
				<MainNav />
			</div>
		</header>
	)
}

import { Link } from '@tanstack/react-router'

export const MainNav = () => {
	return (
		<nav className='p-2 flex flex-row justify-end gap-4'>
			<Link to='/' className='[&.active]:font-bold hover:underline'>
				Home
			</Link>
		</nav>
	)
}

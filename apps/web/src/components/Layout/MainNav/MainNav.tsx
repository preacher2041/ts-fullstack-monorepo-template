import { Link } from '@tanstack/react-router'

export const MainNav = () => {
	return (
		<>
			<div className='p-2 flex flex-row justify-end gap-2'>
				<Link to='/' className='[&.active]:font-bold'>
					Home
				</Link>{' '}
				<Link to='/about' className='[&.active]:font-bold'>
					About
				</Link>
			</div>
		</>
	)
}

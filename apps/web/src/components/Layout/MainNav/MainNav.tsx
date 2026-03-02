import { Link } from '@tanstack/react-router'
import { Button } from '@mythmaker/ui'

export const MainNav = () => {
	return (
		<>
			<div className='p-2 flex flex-row justify-end gap-2'>
				<Link to='/' className='[&.active]:font-bold'>
					<Button variant='primary'>Home</Button>
				</Link>{' '}
				<Link to='/about' className='[&.active]:font-bold'>
					<Button variant='primary'>About</Button>
				</Link>
			</div>
		</>
	)
}

import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { sessionQuery, useLogoutMutation } from '@/features/Auth/api'
import { Button } from '@template/ui'

export const MainNav = () => {
	const { data: session } = useQuery(sessionQuery)
	const { mutate: logout } = useLogoutMutation()

	return (
		<nav className='p-2 flex flex-row justify-end gap-4'>
			{session?.authenticated ? (
				<Button onClick={() => logout()} variant='ghost'>
					Logout
				</Button>
			) : (
				<>
					<Link
						to='/registration'
						className='[&.active]:font-bold hover:underline'>
						Register
					</Link>
					<Link
						to='/login'
						className='[&.active]:font-bold hover:underline'>
						Login
					</Link>
				</>
			)}
		</nav>
	)
}

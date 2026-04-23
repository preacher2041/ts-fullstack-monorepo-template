import { useQuery } from '@tanstack/react-query'

import { meQuery } from '@/features/Auth/api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
	component: RouteComponent,
})

function RouteComponent() {
	const { data: userData } = useQuery(meQuery)
	return (
		<>
			<h1 className='text-2xl font-bold'>
				Welcome {userData?.user.username}
			</h1>
			<p className='mt-2'>Your app is running. Start building here.</p>
		</>
	)
}

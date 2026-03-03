import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<h1 className='text-2xl font-bold'>Welcome</h1>
			<p className='mt-2'>Your app is running. Start building here.</p>
		</>
	)
}

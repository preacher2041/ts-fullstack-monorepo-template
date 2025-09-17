import { Counter } from '@mythmaker/ui'
import { createFileRoute } from '@tanstack/react-router'

import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

const RouteComponent = () => {
	return (
		<>
			<div className='bg-mint-500'>
				<a href='https://vite.dev' target='_blank' rel='noreferrer'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank' rel='noreferrer'>
					<img
						src={reactLogo}
						className='logo react'
						alt='React logo'
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<Counter />
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

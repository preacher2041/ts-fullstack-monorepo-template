import { ReactNode } from 'react'

import { ApplicationBar } from '../ApplicationBar'

type MainLayoutProps = {
	children: ReactNode
}

export const MainLayout = (props: MainLayoutProps) => {
	const { children } = props

	return (
		<>
			<ApplicationBar />
			<div className='pt-20'>
				<div className='p-6'>{children}</div>
			</div>
		</>
	)
}

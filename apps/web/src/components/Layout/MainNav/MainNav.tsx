import { Link } from '@tanstack/react-router'

import { ButtonContainer as Button } from '@/components'

export const MainNav = () => {
    return (
        <>
            <div className="p-2 flex flex-row justify-end gap-2">
            <Link to="/" className="[&.active]:font-bold">
                <Button>
                    Home
                </Button>
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
                <Button>
                    About
                </Button>
            </Link>
            </div>
        
        </>
    )
}
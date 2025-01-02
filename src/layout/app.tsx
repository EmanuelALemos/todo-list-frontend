import { Outlet } from 'react-router-dom'

export function AppLayout() {
    return (
        <div className='text-white'>
            <header className="fixed top-0 left-0 bg-slate-950 h-20 w-full text-xl font-semibold flex items-center justify-between border-b-2 border-slate-600">
                <span className="flex-grow text-left pl-4">Bem Vindo !</span>
            </header>
            <div className="pt-20">
                <Outlet />
            </div>
        </div>
    )
}

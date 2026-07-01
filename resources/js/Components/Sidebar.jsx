import NavLink from "./NavLink";

export default function Sidebar(){
    
    return(
        <aside className="w-64 shadow-md bg-white min-h-screen">

            <div className="px-3 py-1 font-bold text-lg shadow-sm flex gap-x-3 items-center bg-[#C3252B]">
                <p>Logo</p>
                <h1>App</h1>
            </div>

            <nav className="p-4 space-y-2">
                <NavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    href={route('order.index')}
                    active={route().current('order.*')}
                >
                    Orders
                </NavLink>
                    {/* <NavLink
                    href={route('settings')}
                    active={route().current('settings')}
                >
                    Settings
                </NavLink> */}
            </nav>
        </aside>
    );

}
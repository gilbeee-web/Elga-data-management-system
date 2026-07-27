import NavLink from "./NavLink";

export default function Sidebar(){
    
    return(
        <aside className="w-64 shadow-md bg-white min-h-screen z-99 relative">

            <div className="px-3 py-3 font-bold text-lg shadow-sm flex gap-x-3 items-center bg-[#C3252B] bg-[#DF9BAA]">
                <p>Logo</p>
                <h1>App</h1>
            </div>

            <nav className="py-5 space-y-2">
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

                <NavLink
                    href={route('product.index')}
                    active={route().current('product.*')}
                >
                    Products
                </NavLink>

                <NavLink
                >
                    Reports
                </NavLink>

                <NavLink
                >
                    Settings
                </NavLink>
                
            </nav>

            <div className="w-full absolute bottom-10 bg-red-500 hover:bg-red-400 flex justify-center items-center text-white p-3 cursor-pointer">

                <div className="flex items-center gap-x-3 text-lg font-semibold">
                    <img src="/images/icons/logout-icon.svg" alt="Logout icon" className="object-containt w-7 h-7"/>
                    Logout
                </div>
                
            </div>

        </aside>
    );

}
import NavLink from "./NavLink";

export default function Sidebar(){
    
    return(
        <aside className="w-64 shadow-md bg-white min-h-screen z-99">

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
                    href={route('order.index')}
                    active={route().current('order.*')}
                >
                    Reports
                </NavLink>

                <NavLink
                    href={route('order.index')}
                    active={route().current('order.*')}
                >
                    Settings
                </NavLink>
                
            </nav>
        </aside>
    );

}
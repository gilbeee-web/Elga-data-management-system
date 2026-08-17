import Swal from "sweetalert2";
import NavLink from "./NavLink";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { FileText, LayoutDashboard, LogOut, ShoppingBag, ShoppingBasket, ShoppingCart, UsersRound } from "lucide-react";

export default function Sidebar({user}){

    console.log("User: ", user);

    const handleLogout = async () => {

        const result = await Swal.fire({
            title: "Logout",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if(!result.isConfirmed){
            return;
        }


        if(result.isConfirmed){
            router.post(route('user.logout'));
        }

    }
    
    return(
        <aside className="w-64 shadow-md bg-white min-h-screen z-99 relative">

            <div className="px-3 py-3 font-bold text-lg shadow-sm flex gap-x-3 items-center bg-[#C3252B] bg-[#DF9BAA]">
                <img src="/images/logo/elga-logo.jpg" alt="Elga logo" className="object-contain w-7 h-7 rounded-full border border-gray-400 shadow-md" />
                <h1 className="text-lg text-white font-bold font-['Times_New_Roman',serif]">Elga <span className="text-xs">OMS</span></h1>
            </div>

            <nav className="py-5 space-y-2">
                <NavLink
                    href={route('dashboard.index')}
                    active={route().current('dashboard.*')}
                >
                    <LayoutDashboard size={20}/>
                    Dashboard
                </NavLink>
                <NavLink
                    href={route('order.index')}
                    active={route().current('order.*')}
                >
                    
                    <ShoppingCart size={20}/>
                    Orders
                </NavLink>

                <NavLink
                    href={route('product.index')}
                    active={route().current('product.*')}
                >
                    <ShoppingBasket size={20}/>
                    Products
                </NavLink>

                <NavLink
                    href={route('report.index')}
                    active={route().current('report.*')}
                >
                    <FileText size={20}/>
                    Reports
                </NavLink>

                {
                    user.role === 'super_admin' && (
                        <NavLink
                            href={route('user.index')}
                            active={route().current('user.*')}
                        >
                            <UsersRound size={20}/>
                            Users
                        </NavLink>
                    )
                }
                
                
            </nav>

            <div 
                className="w-full absolute bottom-10 bg-red-500 hover:bg-red-400 flex justify-center items-center text-white p-3 cursor-pointer"
                onClick={handleLogout}
            >

                <div className="flex items-center gap-x-3 text-lg font-semibold">
                    <LogOut size={30}/>
                    Logout
                </div>
                
            </div>

        </aside>
    );

}
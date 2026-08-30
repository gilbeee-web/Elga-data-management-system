import Swal from "sweetalert2";
import NavLink from "./NavLink";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ChevronDown, EllipsisVertical, FileText, LayoutDashboard, LogOut, ShoppingBag, ShoppingBasket, ShoppingCart, Store, UserRoundCog, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserForm from "../Pages/Users/Components/UserForm";
import ManageShop from "../Pages/Shops/ManageShop";

export default function Sidebar({user}){

    console.log("User: ", user);
    

    const { currentShop, displayShops } = usePage().props;

    console.log("Shops: ", displayShops);
    console.log("Current Shop: ", currentShop);

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


    const [openShopSettings, setOpenShopSettings] = useState(false);

    const [openManageShop, setOpenManageShop] = useState(false);

    const [openUserSettings, setOpenUserSettings] = useState(false);
    const menuRef = useRef(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenUserSettings(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const [openUserForm, setOpenUserForm] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [mode, setMode] = useState("create");


    const handleEditUser = (user) => {
        if(user){
            setMode("edit");
            setSelectedUser(user);
            setOpenUserForm(true);
        }
    }

    const [shops, setShops] = useState(null);
    const [isFetchingShopData, setIsFetchingShopData] = useState(false);
    const fetchShops = async () => {

        setIsFetchingShopData(true);

        try {
            
            const response = await fetch(route('shop.getShops'));

            if(!response){
                alert("No response");
                return;
            }

            const result = await response.json();

            if(result){
                setIsFetchingShopData(false);
                setShops(result);
            }

            setOpenShopSettings(false); 
            setOpenManageShop(true);

        } catch (error) {
            console.log("Error: ", error);
        }

    }

    const [isAddShop, setIsAddShop] = useState(false);

    const handleAddShop = () => {
        fetchShops();
        setIsAddShop(true);
    }

    const handleSwitchShop = (shop) => {

        try {
            router.post(route('shop.switch', shop.id), {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: `Successfully switch to ${shop.name}`,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                }
            });
        } catch (error) {
            console.log("Error Switching shop: ", error);
        }

    }

    
    return (
        <aside className="w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col">

            <div className="px-5 py-5 flex items-center gap-x-3 border-b border-gray-300">
                <img 
                    src="/images/logo/logo.png" 
                    alt="Elga logo" 
                    className="object-contain w-8 h-8" 
                />
                <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
                    Index <span className="text-xs font-medium text-gray-400 align-middle">OMS</span>
                </h1>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1">

                {
                    displayShops.length > 0 ? (
                        <div className="mb-4 border-b border-gray-400 pb-3 flex flex-col">

                            <h1 className="text-sm text-gray-500 font-semibold">Stores</h1>

                            <div className="mt-2 cursor-pointer">
                                <div 
                                    className="flex justify-between items-center hover:bg-gray-50 rounded-md px-1 py-1"
                                    onClick={() => setOpenShopSettings(!openShopSettings)}
                                >
                                    <div className="flex gap-x-2 items-center">
                                        {
                                            currentShop?.cover_photo ? (
                                                <img 
                                                    src={`/storage/${currentShop?.cover_photo}`}  
                                                    className="object-cover w-10 h-10 rounded-full border border-gray-300" 
                                                />
                                            ) : (
                                                <Store size={20}/>
                                            )
                                        }
                                        
                                        <span className="text-sm capitalize font-semibold">
                                            {currentShop?.name ? currentShop?.name : "No active store"}
                                        </span>
                                    </div>

                                    <div className={`transition-transform duration-300 ${openShopSettings ? "rotate-180" : "rotate-0"}`}>   
                                        <ChevronDown size={20}/>
                                    </div>
                                </div>

                                <div 
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        openShopSettings ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="my-2 flex flex-col gap-y-1">

                                            {
                                                displayShops.length > 0 ? (
                                                    
                                                    displayShops
                                                    .filter((shop) => shop.id !== currentShop?.id)
                                                    .map((shop) => (
                                                        <button
                                                            onClick={() => handleSwitchShop(shop)}
                                                            className="w-full flex items-center gap-x-3 px-4 py-2 text-sm font-medium capitalize text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer rounded-md"
                                                        >
                                                            {
                                                                shop.cover_photo ? (
                                                                    <img 
                                                                        src={`/storage/${shop.cover_photo}`}  
                                                                        className="object-cover w-8 h-8 rounded-full border border-gray-300" 
                                                                    />
                                                                ) : (
                                                                    <Store size={20}/>
                                                                )
                                                            }
                                                            
                                                            {shop.name}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="text-center">
                                                        <h1 className="font-semibold text-sm">
                                                            No store added yet.
                                                        </h1>
                                                    </div>
                                                )
                                                    
                                            }

                                            
                                    
                                            {
                                                user.role === 'super_admin' && (
                                                    <button
                                                        onClick={fetchShops}
                                                        className="w-full flex items-center gap-x-3 px-4 py-2 border-t border-gray-300 pt-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                                                    >
                                                        <Store size={20}/>
                                                        Manage Stores
                                                    </button>
                                                )
                                            }

                                        </div>

                                        
                                        
                                    </div>                            
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border-b border-gray-400 pb-3">
                            <button 
                                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-md cursor-pointer"
                                onClick={handleAddShop}
                            >
                                + Add Store
                            </button>
                        </div>
                        
                    )
                }
                
                

                <NavLink
                    href={route('dashboard.index')}
                    active={route().current('dashboard.*')}
                >
                    <LayoutDashboard size={18} strokeWidth={2}/>
                    Dashboard
                </NavLink>

                <NavLink
                    href={route('order.index')}
                    active={route().current('order.*')}
                >
                    <ShoppingCart size={18} strokeWidth={2}/>
                    Orders
                </NavLink>

                <NavLink
                    href={route('product.index')}
                    active={route().current('product.*')}
                >
                    <ShoppingBasket size={18} strokeWidth={2}/>
                    Products
                </NavLink>

                <NavLink
                    href={route('report.index')}
                    active={route().current('report.*')}
                >
                    <FileText size={18} strokeWidth={2}/>
                    Reports
                </NavLink>

                {
                    user.role === 'super_admin' && (
                        <NavLink
                            href={route('user.index')}
                            active={route().current('user.*')}
                        >
                            <UsersRound size={18} strokeWidth={2}/>
                            Users
                        </NavLink>
                    )
                }

            </nav>

            <div className="px-3 py-4 border-t border-gray-300 flex justify-between items-center">

                <div className="flex gap-x-2">
                    <div>
                        <img 
                            src={user.profile_pic ? `/storage/${user.profile_pic}` : "/images/logo/default-profile.jpg"}  
                            className="object-contain w-10 rounded-full border border-gray-300" 
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <h1 className="font-bold capitalize">{user.name}</h1>
                        <p className="text-gray-500 text-xs font-semibold">
                            {user.role === 'super_admin' ? "Super Admin" : "Admin"}
                        </p>
                    </div>

                </div>

                <div className="relative" ref={menuRef}>
                    <button 
                        type="button"
                        onClick={() => setOpenUserSettings(!openUserSettings)}
                        className="cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <EllipsisVertical size={20} />
                    </button>

                    {openUserSettings && (
                        <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 flex flex-col z-20">
                            <button
                                onClick={() => {setOpenUserSettings(false); handleEditUser(user);}}
                                className="w-full flex items-center gap-x-3 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <UserRoundCog size={18} strokeWidth={2}/>
                                User Settings
                            </button>

                            <button
                                onClick={() => { setOpenUserSettings(false); handleLogout(); }}
                                className="w-full flex items-center gap-x-3 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                <LogOut size={18} strokeWidth={2}/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>


            { openUserForm && (
                <UserForm 
                    user={selectedUser}
                    onClose={() => {
                        setOpenUserForm(false);
                        setSelectedUser(null);
                    }}
                    mode={mode}
                />
            )}


            {
                openManageShop && (
                    <ManageShop  
                        onClose={() => setOpenManageShop(false)}
                        shops={shops}
                        onShopsChange={fetchShops}
                        isFetchingShopData={isFetchingShopData}
                        isAddShop={isAddShop}
                    />
                )
            }

        </aside>
    );

}
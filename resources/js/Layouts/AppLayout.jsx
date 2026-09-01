import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import {route}  from "ziggy-js";
import Sidebar from "@/Components/Sidebar";
import FlashMessage from "../Components/FlashMessage";

export default function AppLayout({children, user, shops}){

    return (

        <div className="h-screen overflow-hidden">
            
            <div className="flex h-full">
                
                
                <Sidebar user={user} displayShops={shops}/>

                
                <div className="flex-1 min-w-0 flex flex-col bg-gray-100">
                    
                    <main className="py-3 px-6 min-h-0 overflow-y-auto flex-1">
                        {children}
                    </main>

                </div>

            </div>

            <div>
                <FlashMessage />
            </div>
        </div>
    );

    
}
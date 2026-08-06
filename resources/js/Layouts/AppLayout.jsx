import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import {route}  from "ziggy-js";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import FlashMessage from "../Components/FlashMessage";

export default function AppLayout({children, title}){

    return (

        <div className="min-h-screen overflow-hidden">
            
            <div className="flex h-screen">
                
                
                <Sidebar />

                
                <div className="flex-1 flex flex-col bg-[#DFDFDF]">

                    <Navbar title={title} />
                    
                    <main className="py-3 px-6 overflow-y-auto flex-1">
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
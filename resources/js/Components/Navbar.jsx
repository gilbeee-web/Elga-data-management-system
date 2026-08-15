import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar({title, user}){

    
    return (
        <header className="w-full flex justify-between items-center bg-[#DF9BAA] shadow sticky top-0 z-10 hidden lg:flex">

            <h1 className="ml-5 text-white text-lg font-bold">
                {title}
            </h1>

            <div className="">
                <div
                    className="flex items-center gap-x-10 bg-white shadow-md rounded-l-full px-10"
                   
                >
                    <div className="flex flex-col items-center py-1">
                        <p className="font-bold text-lg capitalize">{user.name}</p>
                        <p className="text-gray-500 text-xs font-semibold">
                            {user.role === 'super_admin' ? "Super Admin" : "Admin"}
                        </p>
                    </div>

                    <img 
                        src={user.profile_pic ? `/storage/${user.profile_pic}` : "/images/logo/default-profile.jpg"}  
                        className="object-contain w-10 rounded-full border border-gray-300" 
                    />
                </div>
            </div>

        </header>
    );
}
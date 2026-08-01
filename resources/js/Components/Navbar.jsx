import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar({title}){

    const [isOpenProfile, setOpenProfile] = useState(false);

    function toggleProfile(){
        setOpenProfile(!isOpenProfile);
    }




    return (
        <header className="w-full flex justify-between items-center bg-[#DF9BAA] shadow sticky top-0 z-10 hidden lg:flex">

            <h1 className="ml-5 text-white text-lg font-bold">
                {title}
            </h1>

            <div className="relative">


                <button 
                    className="flex items-center gap-x-10 bg-white shadow-md rounded-l-full px-10 cursor-pointer"
                    onClick={toggleProfile}
                >
                    <div className="flex flex-col items-center py-1">
                        <p className="font-bold text-lg">Gilbert</p>
                        <p className="text-gray-500 text-xs font-semibold">Admin</p>
                    </div>

                    <img src="/images/logo/default-profile.jpg"  className="object-contain w-10 rounded-full border" />
                </button>

                {
                    isOpenProfile &&
                    <div
                        className="absolute right-0 w-[200px] bg-white rounded-lg shadow-lg rounded-bl-4xl"
                    >

                        <Link className="px-4 py-2 hover:bg-gray-100 w-full flex gap-x-3 items-center">
                            Logout
                        </Link>
                    </div>
                }
            </div>

        </header>
    );
}
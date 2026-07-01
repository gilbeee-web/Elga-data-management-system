import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar({title}){

    const [isOpenProfile, setOpenProfile] = useState(false);

    function toggleProfile(){
        setOpenProfile(!isOpenProfile);
    }




    return (
        <header className="w-full flex justify-between items-center bg-white shadow sticky top-0 z-10 hidden lg:flex">

            <h1 className="ml-5 text-white text-lg font-bold">
                {title}
            </h1>

            <div className="relative mr-5">

                <button 
                    className="flex items-center gap-x-4 cursor-pointer"
                    onClick={toggleProfile}
                >
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg">Gilbs</p>
                        <p className="text-gray-500 text-sm">Admin</p>
                    </div>


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
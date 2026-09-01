import { useEffect, useState } from "react"
import Layout from "../../Layouts/AppLayout"
import UserForm from "./Components/UserForm";
import TextInput from "../../Components/TextInput";
import { Mail, Search, SquarePen, Trash2, UserPlus } from "lucide-react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
export default function Index({users, current_user}){

    const [openUserForm, setOpenUserForm] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [mode, setMode] = useState("create");
    
    console.log("users: ", users);


    const editUser = (user) => {
        if(user){
            setMode("edit");
            setSelectedUser(user);
            setOpenUserForm(true);
        }
    }

    const [filter, setFilter] = useState({
        search: "",
        role: "",
    });

    const [isFetchingData, setIsFetchingData] = useState(false);

    const fetchUsers = () => {
        setIsFetchingData(true);

        router.get(
            route("user.index"),
            {
                search: filter.search,
                role: filter.role,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsFetchingData(false);
                },
            }
        );
    };

    const filterRole = (value) => {
        const role = value;

        setFilter((prev) => ({
            ...prev,
            role,
        }));

        setIsFetchingData(true);

        router.get(
            route("user.index"),
            {
                search: filter.search,
                role,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsFetchingData(false);
                },
            }
        );
    }

    return <>

        
        <Layout title={"Manage Users"} user={current_user}>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    User List
                </h1>

                <button 
                    type="button"
                    className="flex gap-x-2 items-center rounded-md text-md font-semibold bg-blue-500 px-3 py-2 text-white cursor-pointer hover:bg-blue-400"
                    onClick={() => {
                        setOpenUserForm(true);
                        setMode("create");
                    }}
                >  
                    <UserPlus size={15}/>
                    Add user
                </button>
            </div>

            <div className="mt-5 w-[95%]">

                <div className="w-full flex gap-3 mb-6">
                    <div className="flex-1 flex items-center gap-2 bg-white border border-[#E2E0D8] rounded-lg px-3 h-10">
                        <Search size={20} color="gray"/>

                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={filter.search}
                            onChange={(e) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    search: e.target.value,
                                }));
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchUsers();
                                }
                            }}
                            className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880] bg-transparent"
                        />
                    </div>

                    <select
                        className="border border-[#E2E0D8] bg-white text-[#2C2C2A] text-sm px-3 h-10 rounded-lg cursor-pointer"
                        value={filter.role}
                        onChange={(e) => filterRole(e.target.value)}
                    >
                        <option value="">All roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>


                <div className="mt-5" >
                    <table className="mt-5 w-full text-sm text-left border-collapse bg-white shadow-md rounded-lg">
                        <thead className="text-gray-600 text-xs border-b border-gray-300">
                            <tr className="">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">
                                    Role
                                </th>
                                <th className="p-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isFetchingData ? (
                                    <tr>
                                        <td colSpan={4} className="py-12">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                                                <span className="text-sm text-gray-500 font-medium">Loading users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.length > 0 && (
                                        users.map((user) => (

                                            <tr className="border-b border-gray-300" key={user.id}>
                                                <td className="p-3 ">
                                                    <div className="flex gap-x-3 items-center">
                                                        <img 
                                                            src={user.profile_pic ? `/storage/${user.profile_pic}` : "/images/logo/default-profile.jpg"} 
                                                            alt="" 
                                                            className="object-contain w-10 h-10 rounded-full"
                                                        />

                                                        <span className="font-semibold text-lg">{user.name}</span>
                                                    </div>
                                                    
                                                </td> 

                                                <td className="p-3">
                                                    <div className="flex gap-x-2 items-center">
                                                        <Mail size={15} color="gray"/>
                                                        <span className="text-sm text-gray-500">{user.email}</span>
                                                    </div>
                                                </td>

                                                <td className="p-3"> 
                                                    <span 
                                                        className={`py-2 px-3 text-xs rounded-full font-semibold capitalize ${
                                                            user.role === 'super_admin' ? 'bg-[#E6F0FB]' : 'bg-green-400'
                                                        }`}
                                                    >
                                                        {
                                                            user.role === "super_admin" ? "Super Admin" : "Admin" 
                                                        }
                                                    </span> 
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex gap-x-3 items-center">
                                                        <button 
                                                            className="cursor-pointer"
                                                            onClick={() => editUser(user)}
                                                        >
                                                            <SquarePen size={20}/>
                                                        </button>

                                                        <button className="cursor-pointer">
                                                        <Trash2 size={20}/>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        )
                                    ))
                                )
                                
                            }
                        </tbody>
                    </table>
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
            

        
        </Layout> 
    
    
    </>


}
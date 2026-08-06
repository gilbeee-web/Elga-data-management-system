import { useState } from "react"
import Layout from "../../Layouts/AppLayout"
import UserForm from "./Components/UserForm";
import TextInput from "../../Components/TextInput";
export default function Index({users}){

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

    return <>

        
        <Layout title={"Manage Users"}>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    List of users
                </h1>

                <button 
                    type="button"
                    className="rounded-md text-md bg-blue-500 px-3 py-2 text-white cursor-pointer hover:bg-blue-400"
                    onClick={() => {
                        setOpenUserForm(true);
                        setMode("create");
                    }}
                >
                    + Add user
                </button>
            </div>

            <div className="mt-5 w-[95%]">

                <div className="w-full flex gap-3 mb-6">
                    <div className="flex-1 flex items-center gap-2 bg-white border border-[#E2E0D8] rounded-lg px-3 h-10">
                        <img src="/images/icons/search.svg" alt="Search icon" className="object-contain w-5 h-5 opacity-50" />

                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880] bg-transparent"
                        />
                    </div>

                    <select
                        className="border border-[#E2E0D8] bg-white text-[#2C2C2A] text-sm px-3 h-10 rounded-lg cursor-pointer"
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
                                                    <img src="/images/icons/message-icon.svg" alt="" className="object-contain w-5 h-5"/>
                                                    <span className="text-sm text-gray-500">{user.email}</span>
                                                </div>
                                            </td>

                                            <td className="p-3"> 
                                                <span className="bg-[#E6F0FB] py-2 px-3 text-xs rounded-full font-semibold capitalize">
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
                                                        <img src="/images/icons/edit-icon.svg" alt="" className="object-contain w-5 h-5" />
                                                    </button>

                                                    <button className="cursor-pointer">
                                                        <img src="/images/icons/delete-icon.svg" alt="" className="object-contain w-8 h-8" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>

                                    )
                                ))
                            }
                        </tbody>
                    </table>
                </div>


            </div>




            {/* <div className="mt-5 rounded-md bg-white p-5 h-125">
                {
                    users.length > 0 && (
                        users.map((user) => (
                            <div className="mt-5 shadow-sm border border-gray-400 rounded-lg min-w-sm max-w-lg p-3 bg-white" key={user.id}>
                                <div className="flex justify-between items-center">

                                    <div className="flex gap-x-3 items-center">

                                        <img 
                                            src={user.profile_pic ? `/storage/${user.profile_pic}` : "/images/logo/default-profile.jpg"} 
                                            alt=""
                                            className="object-contain rounded-full w-15 h-15" 
                                        />

                                        <div className="flex flex-col">
                                            <h1 className="text-lg font-bold">{user.username}</h1>
                                            <h2 className="text-sm text-gray-400 font-semibold">
                                                {
                                                    user.role === "super_admin" ? "Super Admin" : "Admin" 
                                                }
                                            </h2>
                                        </div>
                                
                                    </div>

                                    <div className="flex gap-x-5 items-center">
                                        <button 
                                            className="rounded-md text-md bg-green-500 px-3 py-2 text-white cursor-pointer hover:bg-green-400"
                                            onClick={() => editUser(user)}
                                        >
                                            Edit
                                        </button>

                                        <button 
                                            className="rounded-md text-md bg-red-500 px-3 py-2 text-white cursor-pointer hover:bg-red-400"
                                            onClick={() => setOpenUserForm(true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    

                                </div>
                            </div>
                        ))
                    )
                }
            </div> */}

            


            

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
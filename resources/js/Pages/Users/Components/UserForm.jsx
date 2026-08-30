import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react"
import TextInput from "../../../Components/TextInput";
import { route } from "ziggy-js";
import UserCredentialForm from "./UserCredentialsForm";
import { Camera } from "lucide-react";

export default function UserForm({user, onClose, mode}){


    // console.log("User to edit: ", user);

    const isEdit = mode === 'edit';

    const {data, setData, post, transform, errors} = useForm({
        name: "",
        role: "",
        profile_pic: null,

        ...(!isEdit && {
            email: '',
            password: '',
        }),

    });

    const [profilePic, setProfilePic] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setData("profile_pic", file);

        setProfilePic(URL.createObjectURL(file));
    };

    const saveUser = (user_id) => {
        if (mode === 'edit' && user_id) {
            transform((data) => ({ ...data, _method: 'put' }));

            post(route('user.update', user_id), {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.log("Errors: ", errors);
                }
            });
        } else {
            post(route('user.store'), {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.log("Errors: ", errors);
                }
            });
        }
    }


    useEffect(() => {

        if(mode === "edit" && user){
            setData({
                name: user.name,
                role: user.role,
                profile_pic: null
            });

            if(!profilePic && user.profile_pic){
                setProfilePic(`/storage/${user.profile_pic}`);
            }
        }

    }, [user]);


    const [isEditCredentials, setIsEditCredentials] = useState(false);




    return <>

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
            
            <div className="w-full bg-white sm:max-w-md md:max-w-2xl lg:max-w-xl rounded-md shadow p-5 pt-3 overflow-y-auto min-h-[50vh] max-h-[90vh]">

                {/* Header */}

                <div className="w-full flex justify-between items-center border-b border-gray-300 pb-2">
                    
                    <h1 className="text-xl font-bold capitalize">
                        {
                            user && mode === 'edit' ? "Update User" : "Add User"
                        }
                    </h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>
                {
                    isEdit && !isEditCredentials && (
                        <div className="w-full flex justify-end">
                            <button 
                                className="text-start cursor-pointer mt-5"
                                onClick={() => setIsEditCredentials(true)}
                            >
                                <span className="text-blue-500 hover:text-blue-400 hover:underline">User Credentials</span>
                            </button>
                        </div>
                    )
                }
                

                {
                    isEditCredentials ? (
                        <UserCredentialForm 
                            user={user} 
                            back={() => setIsEditCredentials(false)}
                            updateCredentialSuccess={onClose}
                        />
                    ): (
                        <form onSubmit={(e) => { e.preventDefault(); saveUser(user?.id); }} className="mt-5">
                    
                            <div className="flex gap-x-10 items-center">

                                {/* Profile Picture */}
                                <div className="mb-4 flex justify-center lg:justify-start lg:col-span-2">

                                    <label htmlFor="profile_pic" className="relative inline-block">
                                        <img 
                                            src={profilePic ? profilePic : "/images/logo/default-profile.jpg"}
                                            alt="Profile pic" 
                                            className="h-40 w-40 shadow-sm bg-gray-400 rounded-full object-cover cursor-pointer"
                                        />

                                        <div className="absolute bottom-5 right-5 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-1 shadow">
                                            <Camera size={15}/>
                                        </div>
                                    </label>

                                    <input
                                        id="profile_pic"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    {errors.profile_pic && (
                                        <span className="text-red-500 text-sm mt-1">
                                            {errors.profile_pic}
                                        </span>
                                    )}

                                </div>

                                {/* User Info */}
                                <div className="flex flex-col gap-y-5">

                                    <TextInput 
                                        label={"Name:"}
                                        placeholder="Enter name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required={true}
                                        error={errors.name}
                                    />

                                    <div className="flex flex-col">
                                        <label htmlFor="role">Role: <span className="text-red-500">*</span></label>
                                        <select 
                                            name="role"
                                            value={data.role} 
                                            onChange={(e) => setData("role", e.target.value)}
                                            className="border border-gray-400 bg-white px-5 py-2 rounded-md"
                                        >
                                            <option value="super_admin">Super admin</option>
                                            <option value="admin">Admin</option>
                                            
                                        </select>

                                        {errors.role && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    {
                                        !isEdit && (
                                            <div className="flex flex-col gap-y-5">
                                                <TextInput 
                                                    label={"Email:"}
                                                    placeholder="eg. company@gmail.com"
                                                    value={data.email}
                                                    onChange={(e) => setData("email", e.target.value)}
                                                    error={errors.email}
                                                    required={true}
                                                />

                                                <TextInput 
                                                    label={"Password:"}
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={data.password}
                                                    onChange={(e) => setData("password", e.target.value)}
                                                    error={errors.password}
                                                    required={true}
                                                />
                                            </div>
                                            
                                        )
                                    }
                                    
                                        
                                    
                                    
                                </div>
                            </div>

                            <div className="mt-10 w-full flex justify-end">
                                <button
                                    type="submit" 
                                    className="rounded-md text-md bg-green-500 px-3 py-2 text-white cursor-pointer hover:bg-green-400"
                                >
                                    Submit
                                </button>
                            </div>
                            
                        </form>
                    )
                }
                
            </div>
        </div>

        

    
    </>

}
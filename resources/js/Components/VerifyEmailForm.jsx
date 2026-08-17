import { useForm } from "@inertiajs/react";
import TextInput from "./TextInput";
import { route } from "ziggy-js";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail } from "lucide-react";

export default function VerifyEmailForm({onClose, verifySuccess}){

    const [currentEmail, setCurrentEmail] = useState(""); 

    const [isVerify, setIsVerify] = useState(false);
 
    const submit = async (e) => {
        e.preventDefault();

        if(currentEmail === ""){
            Swal.fire({
                title: 'Empty email',
                text: 'Please enter email to verify',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsVerify(true);
        
        try{

            const response = await axios.post(route('user.verifyEmail'), {
                email: currentEmail
            });

            if(response.data){
                verifySuccess(response.data);
            }

        }catch(error){

            const message = error.response?.data?.error 
            || "Something went wrong. Please try again.";

            Swal.fire({
                title: 'Verification failed',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            
        }finally{
            setIsVerify(false);
        }

    }

    return (

        <form onSubmit={submit} className="w-full h-full">

            <div className="flex flex-col">
                <label htmlFor="email" className="font-semibold">Current email:</label>
                <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-3 py-2">
                    <Mail strokeWidth={1} size={20} color="gray"/>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        label={"Current email:"}
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880]"
                    />
                </div>
            </div>

            <div className="mt-5 w-full flex gap-x-3 items-center justify-end">

                <button 
                    type="button"
                    className="px-3 py-2 border border-gray-400 bg-white hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button 
                    type="submit" 
                    className={`px-5 py-2 text-white rounded-md border border-gray-400 ${isVerify ? "bg-pink-300" : "bg-[#DF9BAA] hover:bg-pink-300 cursor-pointer"}`}
                >
                    {isVerify ? "Verifying..." : "Verify"}
                </button>
            </div>
            

        </form>

    )


}
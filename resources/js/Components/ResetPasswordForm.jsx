import { useForm } from "@inertiajs/react";
import TextInput from "./TextInput";
import { route } from "ziggy-js";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ResetPasswordForm({user_id, onUpdateSuccess}){


    const {data, setData, put, processing, errors} = useForm({
        new_password: "",
        new_password_confirmation: ""
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const submit = (e) => {

        console.log("Submit update password: ", user_id);

        e.preventDefault();

        if(data.new_password === ""){
            Swal.fire({
                title: "Empty form", 
                text: "Please fill up the form to proceed.",
                icon: "error"
            });

            return;
        }

        setIsUpdating(true);

        if(user_id){
            put(route('user.updatePassword', user_id),{
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Password updated!",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });

                    onUpdateSuccess();

                },
                onError: (e) => {
                   console.log("Errors: ", e);
                },
                onFinish: () => {
                    setIsUpdating(false);
                }
            });
        }
    }

    return (

        <form  
            className="flex flex-col gap-y-5"
            onSubmit={submit}
        >

            <TextInput 
                label={"New Password:"}
                type="password"
                placeholder="Enter new password"
                value={data.new_password}
                onChange={(e) => setData("new_password", e.target.value)}
                error={null}
                required={true}
                className="min-w-60"
            />


            <TextInput 
                label={"Confirm new password:"}
                type="password"
                placeholder="Enter confirm password"
                value={data.new_password_confirmation}
                onChange={(e) => setData("new_password_confirmation", e.target.value)}
                error={errors.new_password}
                required={true}
                className="min-w-60"
            />

            <button 
                className="px-3 py-2 bg-[#DF9BAA] hover:bg-pink-300 text-white rounded-md cursor-pointer font-bold"
                type="submit"
            >
                Change password
            </button>


        </form>

    );
}
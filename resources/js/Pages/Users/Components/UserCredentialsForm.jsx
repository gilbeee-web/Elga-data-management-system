import { useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function UserCredentialForm({user, back, updateCredentialSuccess}){


    const {data, setData, put, process, errors} = useForm({
        email: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });


    const [isSaving, setIsSaving] = useState(false);

    const saveUserCredentials = (e) => {

        e.preventDefault();

        setIsSaving(true);

        put(route('user.updateCredentials', user.id    ),{
            onSuccess: () => {
                updateCredentialSuccess();
                console.log("Success");
            },
            onError: (errors) => {
                console.log("Errors: ", errors);
            },
            onFinish: () => setIsSaving(false)
        });
    }


    useEffect(() => {

        if(user){
            setData("email", user.email);
        }

    }, [user]);



    return <>

        <div className="flex items-center my-5">
            <button className="cursor-pointer" onClick={back}>
                <ChevronLeft size={25}/>
            </button>

            <h1 className="font-bold text-lg">User credentials</h1>    

        </div>
    
        <form onSubmit={saveUserCredentials} className="flex flex-col gap-y-5">

            
            <TextInput 
                label={"Email:"}
                type="text"
                placeholder="Enter email"
                className="w-[80%]"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                error={errors.email}
            />

            <TextInput 
                label={"Current password:"}
                type="password"
                className="w-[80%]"
                placeholder="Enter current password"
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                error={errors.current_password}
            />
           

            <div className="flex gap-x-8 items-start">
                <TextInput 
                    label={"New password:"}
                    type="password"
                    placeholder="Enter new password"
                    value={data.new_password}
                    onChange={(e) => setData("new_password", e.target.value)}
                    error={errors.new_password}
                />

                <TextInput 
                    label={"Confirm new password:"}
                    type="password"
                    placeholder="Enter again new password"
                    value={data.new_password_confirmation}
                    onChange={(e) => setData("new_password_confirmation", e.target.value)}
                    error={errors.new_password_confirmation}
                />
            </div>

            <div className="mt-5 w-full flex justify-end">
                <button
                    type="submit" 
                    className={`rounded-md text-md px-3 py-2 text-white cursor-pointer ${
                        isSaving ? "bg-green-400" : "bg-green-500 hover:bg-green-400"
                    }`}
                >
                    {
                        isSaving ? "Submitting..." : "Submit"
                    }
                </button>
            </div>
            

            

        </form>
    
    
    </>

    
}
import { useForm } from "@inertiajs/react";
import TextInput from "../../../Components/TextInput";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

export default function UserCredentialForm({user, back, updateCredentialSuccess}){


    const {data, setData, post, process, errors} = useForm({
        new_email: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });


    const saveUserCredentials = () => {
        post(route('user.updateCredentials'),{
            onSuccess: () => {
                updateCredentialSuccess();
                console.log("Success");
            },
            onError: (errors) => {
                console.log("Errors: ", errors);
            }
        });
    }


    useEffect(() => {

        if(user){
            setData("new_email", user.email);
        }

    }, [user]);



    return <>

        <div className="flex items-center my-5">
            <button className="cursor-pointer" onClick={back}>
                <ChevronLeft size={25}/>
            </button>

            <h1 className="font-bold text-lg">User credentials</h1>    

        </div>
    
        <form className="flex flex-col gap-y-5">

            
            <TextInput 
                label={"New email:"}
                type="text"
                placeholder="Enter new email"
                className="w-[80%]"
                value={data.new_email}
                onChange={(e) => setData("new_email", e.target.value)}
            />

            <TextInput 
                label={"Current password:"}
                type="password"
                className="w-[80%]"
                placeholder="Enter current password"
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
            />
           

            <div className="flex gap-x-8 items-center">
                <TextInput 
                    label={"New password:"}
                    type="password"
                    placeholder="Enter new password"
                    value={data.new_password}
                    onChange={(e) => setData("new_password", e.target.value)}
                />

                <TextInput 
                    label={"Confirm new password:"}
                    type="password"
                    placeholder="Enter again new password"
                    value={data.new_password_confirmation}
                    onChange={(e) => setData("current_password", e.target.value)}
                />
            </div>

            <div className="mt-5 w-full flex justify-end">
                <button
                    type="submit" 
                    className="rounded-md text-md bg-green-500 px-3 py-2 text-white cursor-pointer hover:bg-green-400"
                >
                    Submit
                </button>
            </div>
            

            

        </form>
    
    
    </>

    
}
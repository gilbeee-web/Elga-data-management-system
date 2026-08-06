import { useForm } from "@inertiajs/react";
import TextInput from "../Components/TextInput";
import { route } from "ziggy-js";
import Swal from "sweetalert2";
import FlashMessage from "../Components/FlashMessage";


export default function Index(){

    const {data, setData, post, processing, errors} = useForm({
        email: "",
        password: "",
    });


    const handleLogin = (e) => {
        e.preventDefault();

        post(route('user.login'), {
            onSuccess: () => {
                console.log("Sucess logged in");
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: errors.email,
                });
            },
        });

    }




    return <>
    
        
        <div className="w-full min-h-screen flex justify-center items-center">
            
            <div className="bg-white border  rounded-lg shadow-md p-5">

                <h1 className="text-xl font-bold pb-3 border-b border-gray-300">Login</h1>

                <form onSubmit={handleLogin} className="mt-5 flex flex-col gap-y-5">

                    <TextInput 
                        label="Email:"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={(e) => setData("email",e.target.value)}
                        
                    />


                    <TextInput 
                        label="Password:"
                        type="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => setData("password",e.target.value)}
                       
                    />

                    <div className="w-full text-center flex flex-col gap-y-3">
                        <button 
                            type="submit"
                            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-400 text-white rounded-md p-2 font-semibold"
                        >
                            Login
                        </button>

                        <div className="text-xs"> 
                            <span>Forgot your password?</span> 
                            <button className="pl-1 text-blue-500 cursor-pointer">Click here</button>
                        </div>

                    </div>
                
                </form>
            </div>
            

        </div>

        <div>
            <FlashMessage />
        </div>
    
    </>

}
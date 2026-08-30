import { useForm } from "@inertiajs/react";
import TextInput from "../Components/TextInput";
import { route } from "ziggy-js";
import Swal from "sweetalert2";
import FlashMessage from "../Components/FlashMessage";
import { useState } from "react";
import VerifyEmailForm from "../Components/VerifyEmailForm";
import ResetPasswordForm from "../Components/ResetPasswordForm";
import { ChevronLeft, KeyRound, Mail } from "lucide-react";


export default function Index(){

    const {data, setData, post, processing, errors} = useForm({
        email: "",
        password: "",
    });

    const [loginLoading, setLoginLoading] = useState(false);
    const handleLogin = (e) => {
        console.log("handle login");
        e.preventDefault();

        setLoginLoading(true);

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
            onFinish: () => {
                setLoginLoading(false);
            }
        });
    }

    const [forgotPassword, setForgotPassword] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleVerifyEmail = (userId) => {
        setSelectedUserId(userId);
    }




    return <>
    
        <div className="relative w-full min-h-screen">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-50"
                style={{ backgroundImage: "url('/images/sample-bg.jpg')" }}
            />

            <div className="relative w-full min-h-screen flex justify-center items-center rounded-lg">
                
                <div className="min-h-95 bg-white border border-gray-400 max-w-xl rounded-lg shadow-md font-['Times_New_Roman',serif] overflow-hidden">

                    <div className="w-full h-full grid grid-cols-2 min-h-95">

                        <div className="w-full h-full bg-[#DF9BAA] rounded-l-lg border-gray-400 p-5">

                            <div className="w-full h-full flex flex-col justify-center items-center text-center text-white font-bold">
                                <h1 className="text-6xl">Index</h1>
                                <p className="text-xl">Order Management System</p>
                            </div>

                        </div>

                        <div className="w-full h-full bg-white p-5 rounded-r-lg">

                            {
                                !forgotPassword ? (
                                    <h1 className="font-bold text-4xl">Sign in</h1>
                                ) : (
                                    <div className="flex items-center">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setForgotPassword(false);
                                                setSelectedUserId(null);
                                            }} 
                                            className="cursor-pointer"
                                        >
                                            <ChevronLeft size={30} />
                                        </button>
                                        <h1 className="font-bold text-2xl">Forgot Password</h1>
                                    </div>
                                )
                            }

                            
                            

                            <hr className="mt-2 w-full text-gray-400"/>
                            {
                                !forgotPassword ? (
                                    <form onSubmit={handleLogin} className="flex flex-col gap-y-5 py-5">

                                        <div className="flex flex-col">
                                            <label htmlFor="email" className="font-semibold">Email:</label>
                                            <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-3 py-2">
                                                <Mail strokeWidth={1} size={20} color="gray"/>

                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    value={data.email}
                                                    onChange={(e) => setData("email",e.target.value)}
                                                    className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="password" className="font-semibold">Password:</label>
                                            <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-lg px-3 py-2">
                                                
                                                <KeyRound strokeWidth={1} size={20} color="gray"/>

                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    value={data.password}
                                                    onChange={(e) => setData("password",e.target.value)}
                                                    className="w-full border-none outline-none text-sm text-[#2C2C2A] placeholder:text-[#8A8880]"
                                                />
                                            </div>
                                        </div>
                        
                                        <div className="flex gap-x-5 justify-between items-center">

                                            <div className="flex items-center">
                                                <input type="checkbox" name="remember" id="remember" className="mr-2" />
                                                <label htmlFor="remember" className="text-sm font-semibold">Remember me</label>
                                            </div>

                                            <div>
                                                <button 
                                                    className="text-sm text-red-500 hover:underline font-semibold cursor-pointer"
                                                    type="button"
                                                    onClick={() => {
                                                        setForgotPassword(true);
                                                        console.log("Clicked: " + forgotPassword);
                                                    }}
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>

                                        </div>

                                        <div>
                                            <button 
                                                type="submit"
                                                className={`w-full cursor-pointer text-white rounded-md p-2 font-bold ${
                                                    loginLoading ? "bg-pink-300" : "bg-[#DF9BAA] hover:bg-pink-300"}
                                                `}
                                            >
                                                {
                                                    loginLoading ? (
                                                        <div className="w-full flex gap-x-2 items-center justify-center">
                                                            <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-pink-600 rounded-full" />
                                                            <h1>Logging in...</h1>
                                                        </div>
                                                        
                                                    ) : (
                                                        <h1>Login</h1>
                                                    )
                                                }                                            
                                            </button>
                                        </div>


                                    </form>
                                ) : (
                                    <div className="w-full h-full">
                                        {
                                            !selectedUserId ? (

                                                <div className="mt-10">
                                                    <VerifyEmailForm 
                                                        onClose={() => setForgotPassword(false)}
                                                        verifySuccess={handleVerifyEmail}
                                                    />
                                                </div>
                                                
                                                
                                                
                                            ) :
                                            (
                                                <div className="mt-10"> 
                                                    <ResetPasswordForm 
                                                        user_id={selectedUserId} 
                                                        onUpdateSuccess={() => {
                                                            setSelectedUserId(null);
                                                            setForgotPassword(false);
                                                        }} 
                                                    />
                                                </div>
                                               
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>

                    </div>

                    
                </div>
            </div>

            
        </div>
        
    
    </>

    

}
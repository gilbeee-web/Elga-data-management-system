import Layout from "@/Layouts/AppLayout"
import { route } from "ziggy-js"
import { Link } from "@inertiajs/react"

export default function Index (){
    return <>
        <Layout>
            <div className="bg-white pl-10 pr-10">

                <div className="flex justify-between items-center mt-5">

                    <h1 className="pl-7  mb-1 text-2xl font-bold text-blue-800">Manage Orders</h1>

                    <Link
                        href={route('order.create')}
                        className="p-3 bg-green-500 rounded-lg text-white font-semibold inline-block"
                    >
                        Create Order
                    </Link>
                    
                </div>
                



            </div>
        </Layout>
    </>
}
import Layout from "@/Layouts/AppLayout"
import { useForm, Link } from "@inertiajs/react"
import OrderForm from "@/Components/Orders/OrderForm"


export default function Create(){

    
    return <>

        <Layout>
            <div className="pl-10 pr-10">

                <div className="flex justify-between items-center">

                    <div className="flex gap-x-3 items-center mt-5">
                        <Link className="text-3xl font-bold">
                            &lt;
                        </Link>
                        <h1 className="text-2xl font-bold text-blue-800">Create Order</h1>
                    </div>

                    <button>
                        Add Order
                    </button>

                </div>
                


                <OrderForm />


                

            </div>
        </Layout>
        


    </>
}
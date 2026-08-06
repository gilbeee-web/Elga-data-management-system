import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function FlashMessage() {
    const { flash } = usePage().props;

    useEffect(() => {
        
        console.log("Flash: ", flash);
        


        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: flash.success,
                showConfirmButton: false,
                timer: 2000
            });
        }

        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: flash.error,
            });
        }
    }, [flash]);

    return null; 
}
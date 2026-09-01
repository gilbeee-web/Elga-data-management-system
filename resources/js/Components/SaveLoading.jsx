export default function SaveLoading(){

    return (
        <div className="w-full h-full fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
        
            <div className="flex gap-x-3 items-center justify-center bg-white rounded-md shadow p-3">
                <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                <h1 className="font-semibold">Saving...</h1>                                    
            </div>

        </div>
    )


}
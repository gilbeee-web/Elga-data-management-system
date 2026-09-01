import { formatDateTime } from "../../../Utils/formatDateTime";

export default function OrderStatusHistory({statusHistory, onClose}){

    return (

        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] z-99 flex justify-center items-center">
            
            <div className="w-full bg-white sm:max-w-xs md:max-w-sm lg:max-w-md rounded-md shadow p-3 pt-3 overflow-y-auto min-h-[50vh]">

                {/* Header */}
                <div className="w-full flex justify-between items-center border-b border-gray-300">
                    
                    <h1 className="text-lg font-bold capitalize">
                        Order History
                    </h1>

                    <button className="text-3xl cursor-pointer hover:text-gray-300" onClick={onClose}>
                        &times;
                    </button>
                </div>


                <div className="mt-5">
                    <div className="space-y-0">
                        {statusHistory.length > 0 ? (
                            statusHistory
                            .slice()
                            .reverse()
                            .map((history, index) => (
                                <div
                                    key={history.id}
                                    className="relative flex gap-x-4"
                                >
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center">
                                        {/* Dot */}
                                        <div className="relative z-10 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white">
                                        </div>

                                        {/* Line */}
                                        {index !== statusHistory.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-300"></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="pb-8">
                                        <div className="flex items-center gap-x-2">
                                            <h3 className="font-semibold text-gray-900 capitalize">
                                                {history.new_status.replaceAll('_', ' ')}
                                            </h3>
                                        </div>

                                        {
                                            history.old_status && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {history.old_status?.replaceAll('_', ' ')}
                                                    {' → '}
                                                    {history.new_status.replaceAll('_', ' ')}
                                                </p>
                                            ) 
                                        }
                                        

                                        <p className="text-xs text-gray-400 mt-2">
                                            Changed by: {history.changer.name}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {formatDateTime(history.created_at)}
                                        </p>

                                        {history.remarks && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {history.remarks}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <h1 className="font-bold text-lg">No status history found.</h1>
                            </div>
                        )}
                            
                    </div>
                </div>



            </div>
        </div>

    )


}
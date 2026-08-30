import { formatCurrency } from '../Utils/formatCurrency';

export default function SummaryCard({ cardName, value, icon: Icon, isCurrency, color }) {
    return (
        <div className={`rounded-lg shadow-sm p-5 relative bg-white ${color}`}>
            <div className='w-full h-full'>
                <div className="flex gap-x-3 items-center">

                    <div className='rounded-full p-3 bg-white border border-gray-100 shadow-sm'>
                        <Icon className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className="text-xs font-semibold">{cardName}</h1>
                        <span className="text-xl font-bold">
                            {isCurrency 
                                ? formatCurrency(value ?? 0)
                                : value
                            }
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0">
                <Icon className="w-12 h-12 opacity-20 text-gray-700" strokeWidth={1.5} />
            </div>
        </div>
    );
}
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { router } from '@inertiajs/react';

export default function SalesTrendChart({ salesTrend, view }) {
    const handleViewChange = (newView) => {
        router.get(route('dashboard.index'), { view: newView }, {
            preserveState: true,
            preserveScroll: true,
            only: ['salesTrend', 'view'],
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Sales Trend</h3>
                <div className="flex gap-2">
                    {['daily', 'weekly', 'monthly'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleViewChange(opt)}
                            className={`px-3 py-1 text-sm rounded cursor-pointer ${
                                view === opt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
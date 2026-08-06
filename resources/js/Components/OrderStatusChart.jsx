import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_LABELS = {
    draft: 'Draft',
    awaiting_shipping_fee: 'Awaiting Shipping Fee',
    awaiting_payment: 'Unpaid',
    payment_confirmed: 'Partial payment',
    processing: 'Processing',
    shipped: 'Shipped',
    cancelled: 'Cancelled',
};

const COLORS = {
    draft: '#9ca3af',
    awaiting_shipping_fee: '#fbbf24',
    awaiting_payment: '#f59e0b',
    payment_confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#10b981',
    cancelled: '#ef4444',
};

export default function OrderStatusChart({ orderStatusBreakdown }) {
    const chartData = orderStatusBreakdown.map((item) => ({
        name: STATUS_LABELS[item.order_status] ?? item.order_status,
        value: item.total,
        status: item.order_status,
    }));

    return (
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Order Status Breakdown</h3>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="35%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[entry.status] ?? '#ccc'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ 
                            fontSize: '12px', 
                            lineHeight: '26px',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
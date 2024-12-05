import React, { useState, useEffect } from 'react';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [id, setId] = useState("");  // ID input field (read-only)
    const [itemName, setItemName] = useState("");
    const [quantityOrdered, setQuantityOrdered] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [status, setStatus] = useState("Pending");  // Default status is "Pending"
    const [error, setError] = useState("");

    // Fetch orders from the backend
    useEffect(() => {
        fetch('http://localhost:5000/api/orders')
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => setError('Failed to fetch orders.'));
    }, []);

    const addOrder = async () => {
        // Ensure all fields are filled in
        if (!itemName || !quantityOrdered || !customerName || !orderDate || !status) {
            setError('All fields are required.');
            return;
        }

        // Post request to add a new order
        try {
            const response = await fetch('http://localhost:5000/api/orders/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_name: itemName,
                    quantity: Number(quantityOrdered),
                    customer: customerName,
                    order_date: orderDate,
                    status: status,
                }),
            });

            if (response.ok) {
                // Successfully added the order
                const newOrder = await response.json();

                // Update the orders state
                setOrders([
                    ...orders,
                    {
                        id: newOrder.id,  // Make sure the ID is returned from the server
                        item_name: itemName,
                        quantity: Number(quantityOrdered),
                        customer: customerName,
                        order_date: orderDate,
                        status: status,
                    }
                ]);

                // Clear the input fields after the order is added
                setId("");
                setItemName("");
                setQuantityOrdered(0);
                setCustomerName("");
                setOrderDate("");
                setStatus("Pending");
                setError(""); // Clear any error message
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add order.');
            }
        } catch (error) {
            setError('An error occurred while adding the order.');
        }
    };

    return (
        <div className="p-6 bg-blue-900 rounded-lg text-white">
            <h2 className="text-3xl font-bold text-center mb-6">Order Management</h2>

            {/* Show error message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Orders table */}
            <table className="w-full bg-blue-800 rounded-lg mb-6">
                <thead>
                    <tr>
                        <th className="p-3 text-left">Order ID</th>
                        <th className="p-3 text-left">Item Name</th>
                        <th className="p-3 text-left">Quantity Ordered</th>
                        <th className="p-3 text-left">Customer Name</th>
                        <th className="p-3 text-left">Order Date</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-blue-600">
                            <td className="p-3">{order.id}</td>
                            <td className="p-3">{order.item_name}</td>
                            <td className="p-3">{order.quantity}</td>
                            <td className="p-3">{order.customer}</td>
                            <td className="p-3">{order.order_date}</td>
                            <td className="p-3">{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form to add a new order */}
            <div className="mt-6 flex flex-col sm:flex-row items-center">
                <input
                    type="text"
                    placeholder="Order ID (Read-Only)"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                    readOnly
                />
                <input
                    type="text"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                />
                <input
                    type="number"
                    placeholder="Quantity Ordered"
                    value={quantityOrdered}
                    onChange={(e) => setQuantityOrdered(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                />
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                />
                <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
                >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option> {/* Added Cancelled as an option */}
                </select>
                <button
                    onClick={addOrder}
                    className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition duration-200"
                >
                    Add Order
                </button>
            </div>
        </div>
    );
}

export default OrderManagement;

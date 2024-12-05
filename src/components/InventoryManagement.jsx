import React, { useState, useEffect } from 'react';
import apiService from "../services/apiService";

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  // Sample categories, can be updated as needed
  const categories = [
    "Produce",
    "Dairy",
    "Meat",
    "Grains",
    "Beverages",
    "Condiments",
    "Frozen",
    "Bakery"
  ];

  // Fetch inventory data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => setError('Failed to fetch inventory.'));
  }, []);

  const addItem = async () => {
    if (!item || !category || !quantity || !unit || !expiryDate) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/inventory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: item,
          category: category,
          quantity: Number(quantity),
          unit: unit,
          expiry_date: expiryDate,
        }),
      });
      if (response.ok) {
        const newItem = await response.json();
        setInventory([...inventory, { 
          id: newItem.id, 
          item_name: item, 
          category, 
          quantity: Number(quantity), 
          unit, 
          expiry_date: expiryDate 
        }]);
        setItem("");
        setCategory("");
        setQuantity(0);
        setUnit("");
        setExpiryDate("");
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add item.');
      }
    } catch (error) {
      setError('An error occurred while adding the item.');
    }
  };

  return (
    <div className="p-6 bg-blue-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Inventory Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="w-full bg-blue-800 rounded-lg">
        <thead>
          <tr>
            <th className="p-3 text-left">Item</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3 text-left">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((inv) => (
            <tr key={inv.id} className="border-b border-blue-600">
              <td className="p-3">{inv.item_name}</td>
              <td className="p-3">{inv.category}</td>
              <td className="p-3">{inv.quantity}</td>
              <td className="p-3">{inv.unit}</td>
              <td className="p-3">{inv.expiry_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />
        
        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />
        <button
          onClick={addItem}
          className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition duration-200"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default InventoryManagement;

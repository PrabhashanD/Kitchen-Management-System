import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import InventoryManagement from './InventoryManagement';
import OrderManagement from './OrderManagement';
import StaffManagement from './StaffManagement';
import Reporting from './Reporting';
import inventoryImage from '../assets/1.png';
import orderImage from '../assets/2.png';
import staffImage from '../assets/3.png';
import reportingImage from '../assets/4.png';
import logoImage from '../assets/OIP.png';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('inventory'); // Default page
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login', { replace: true }); // Redirect to login
  };

  return (
    <div className="bg-blue-900 min-h-screen text-white flex flex-col items-center font-sans">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center mt-6 mb-10">
        <img src={logoImage} alt="Logo" className="w-20 h-20 mb-4 rounded-full shadow-md" />
        <h1 className="text-4xl font-extrabold text-center">Kitchen Management System</h1>
      </header>

      {/* Logout Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 p-3 rounded-lg hover:bg-red-500 transition-all"
        >
          <FaSignOutAlt size={20} className="mr-2" />
          Logout
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="grid grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col items-center">
          <img src={inventoryImage} alt="Inventory" className="mb-4" />
          <button
            onClick={() => setCurrentPage('inventory')}
            className={`bg-blue-700 p-4 rounded-lg flex items-center justify-center hover:bg-blue-600 ${
              currentPage === 'inventory' ? 'bg-blue-600' : ''
            }`}
          >
            <FaBoxOpen size={24} />
            <span className="ml-2">Inventory</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img src={orderImage} alt="Orders" className="mb-4" />
          <button
            onClick={() => setCurrentPage('order')}
            className={`bg-blue-700 p-4 rounded-lg flex items-center justify-center hover:bg-blue-600 ${
              currentPage === 'order' ? 'bg-blue-600' : ''
            }`}
          >
            <FaShoppingCart size={24} />
            <span className="ml-2">Orders</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img src={staffImage} alt="Staff" className="mb-4" />
          <button
            onClick={() => setCurrentPage('staff')}
            className={`bg-blue-700 p-4 rounded-lg flex items-center justify-center hover:bg-blue-600 ${
              currentPage === 'staff' ? 'bg-blue-600' : ''
            }`}
          >
            <FaUsers size={24} />
            <span className="ml-2">Staff</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img src={reportingImage} alt="Reporting" className="mb-4" />
          <button
            onClick={() => setCurrentPage('reporting')}
            className={`bg-blue-700 p-4 rounded-lg flex items-center justify-center hover:bg-blue-600 ${
              currentPage === 'reporting' ? 'bg-blue-600' : ''
            }`}
          >
            <FaChartLine size={24} />
            <span className="ml-2">Reporting</span>
          </button>
        </div>
      </nav>

      {/* Render Current Page */}
      <div className="w-full max-w-4xl">
        {currentPage === 'inventory' && <InventoryManagement />}
        {currentPage === 'order' && <OrderManagement />}
        {currentPage === 'staff' && <StaffManagement />}
        {currentPage === 'reporting' && <Reporting />}
      </div>
    </div>
  );
}

export default Dashboard;

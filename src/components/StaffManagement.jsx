import React, { useState, useEffect } from 'react';

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [id, setId] = useState("");  // ID for new staff member
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState("");
  
  // List of roles for the dropdown menu
  const roles = [
    'Manager',
    'Chef',
    'Waiter',
    'Cleaner',
    'Cashier',
    'Security'
  ];

  useEffect(() => {
    // Fetch staff from the backend
    fetch('http://localhost:5000/api/staff')
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => setError('Failed to fetch staff.'));
  }, []);

  const addStaffMember = async () => {
    if (!fullName || !role || !contactInfo) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/staff/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          role,
          contact_info: contactInfo,
        }),
      });

      if (response.ok) {
        const newStaff = await response.json();
        setStaff([
          ...staff,
          {
            id: newStaff.id,
            full_name: fullName,
            role,
            contact_info: contactInfo,
          },
        ]);
        setFullName("");
        setRole("");
        setContactInfo("");
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add staff member.');
      }
    } catch (error) {
      setError('An error occurred while adding the staff member.');
    }
  };

  return (
    <div className="p-6 bg-blue-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Staff Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="w-full bg-blue-800 rounded-lg mb-6">
        <thead>
          <tr>
            <th className="p-3 text-left">Staff ID</th>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Position/Role</th>
            <th className="p-3 text-left">Contact Information</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b border-blue-600">
              <td className="p-3">{member.id}</td>
              <td className="p-3">{member.full_name}</td>
              <td className="p-3">{member.role}</td>
              <td className="p-3">{member.contact_info}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-col sm:flex-row items-center">
        {/* Staff ID (Read-Only) */}
        <input
          type="text"
          value={id}
          readOnly
          placeholder="Staff ID"
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none cursor-not-allowed"
        />

        {/* Full Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />
        
        {/* Role Select */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        >
          <option value="">Select Role</option>
          {roles.map((roleOption, index) => (
            <option key={index} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>

        {/* Contact Info Input */}
        <input
          type="text"
          placeholder="Contact Information"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          className="mr-4 p-2 mb-4 sm:mb-0 sm:w-1/5 bg-white text-black rounded focus:outline-none"
        />

        <button
          onClick={addStaffMember}
          className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition duration-200"
        >
          Add Staff Member
        </button>
      </div>
    </div>
  );
}

export default StaffManagement;

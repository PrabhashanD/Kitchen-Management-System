import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Reporting() {
  const [reportId, setReportId] = useState('');
  const [reportName, setReportName] = useState('');
  const [reportValue, setReportValue] = useState('');  // New state for report_value
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Sales Data',
        data: [65, 59, 80, 81],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  const [createdAt, setCreatedAt] = useState('');
  const navigate = useNavigate();

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Data Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Fetch existing report data when the component mounts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports'); // Adjust the URL to match your backend
        const reports = response.data;

        // Assuming the reports have the same structure as chart data
        const labels = reports.map(report => report.report_name);  // Adjusted to 'report_name'
        const data = reports.map(report => report.report_value);   // Adjusted to 'report_value'

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Sales Data',
              data: data,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  // Handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString();

    // Ensure report_value is a number and within range 1-20
    if (reportValue < 1 || reportValue > 20) {
      alert('Please enter a report value between 1 and 20');
      return;
    }

    try {
      // Send new report data to backend (including report_value)
      const response = await axios.post('http://localhost:5000/api/reports', {
        report_name: reportName,
        report_value: Number(reportValue),  // Ensure value is a number
        created_at: currentTime,  // Include the created_at field
      });

      const newReport = response.data;

      // Update the chart after submitting the new report
      setChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, newReport.report_name],
        datasets: [
          {
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, newReport.report_value],
          },
        ],
      }));

      // Clear the input fields after submitting
      setReportId(newReport.id);  // Set the ID from the response
      setReportName('');          // Clear report name after submit
      setReportValue('');         // Clear report value after submit
      setCreatedAt(currentTime);  // Set the created_at field
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="p-6 bg-blue-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Reporting & Analytics</h2>
      <p className="text-center mb-4">Here, you will find detailed insights and reports for your system.</p>

      {/* Line chart */}
      <div className="mb-6">
        <Line data={chartData} options={options} />
      </div>

      {/* Input Fields */}
      <div className="mb-6">
        {/* ID field (read-only) */}
        <input
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          className="p-2 mb-4 bg-white text-black rounded focus:outline-none w-full"
          placeholder="Report ID"
          readOnly
        />

        {/* Dropdown for selecting report name */}
        <select
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="p-2 mb-4 bg-white text-black rounded focus:outline-none w-full"
        >
          <option value="">Select Report Name</option>
          <option value="Sales">Sales</option>
          <option value="Inventory">Inventory</option>
          <option value="Marketing">Marketing</option>
        </select>

        {/* Input field for report value */}
        <input
          value={reportValue}
          onChange={(e) => setReportValue(e.target.value)}
          className="p-2 mb-4 bg-white text-black rounded focus:outline-none w-full"
          placeholder="Enter Report Value (1-20)"
          type="number"
          min="1"
          max="20"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 p-2 rounded hover:bg-blue-500 transition duration-200 mt-4"
        >
          Submit
        </button>
      </div>

      {/* Display Created At Date */}
      <div className="mt-6 text-center">
        {createdAt && <p>Report Created At: {new Date(createdAt).toLocaleString()}</p>}
      </div>
    </div>
  );
}

export default Reporting;

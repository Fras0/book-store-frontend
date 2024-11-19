import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import "./Dashboard.css";

Chart.register(CategoryScale);

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [topSellingBooks, setTopSellingBooks] = useState([]);
  const [totalSales, setTotalSales] = useState({
    totalRevenue: 0,
    totalBooksSold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/purchase/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setStats(data.data.purchaseStats);

        setTopSellingBooks(data.data.topSellingBooks);

        setTotalSales(
          data.data.totalSales || { totalRevenue: 0, totalBooksSold: 0 }
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const barChartData = {
    labels: stats.map((stat) => stat.categoryName),
    datasets: [
      {
        label: "Total Purchases",
        data: stats.map((stat) => stat.totalPurchases),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Total Amount Spent",
        data: stats.map((stat) => stat.totalAmountSpent),
        backgroundColor: "rgba(153,102,255,0.6)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: stats.map((stat) => stat.categoryName),
    datasets: [
      {
        label: "Category Distribution",
        data: stats.map((stat) => stat.totalPurchases),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Sales Dashboard</h2>

          {/* Charts */}
          <div className="chart-container">
            <h3>Purchases & Revenue</h3>
            <Bar data={barChartData} />
          </div>
          <div className="chart-container">
            <h3>Category Distribution</h3>
            <Pie data={pieChartData} />
          </div>

          {/* Total Sales */}
          <div className="dashboard-stats">
            <h3>Total Sales</h3>
            <p>
              <strong>Total Revenue:</strong> ${totalSales.totalRevenue}
            </p>
            <p>
              <strong>Total Books Sold:</strong> {totalSales.totalBooksSold}
            </p>
          </div>

          <div className="top-selling-books">
            <h3>Top 3 Selling Books</h3>
            {topSellingBooks.length > 0 ? (
              <ul>
                {topSellingBooks.map((book) => (
                  <li key={book._id}>
                    <strong>{book.title}</strong> - {book.salesCount} sales ($
                    {book.totalRevenue})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sales data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

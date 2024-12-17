import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  ScatterController,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  ScatterController,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  // Refs for chart instances and canvases
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const scatterChartInstanceRef = useRef(null);

  // State variables for data fetching and error handling
  const [dataFetched, setDataFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics data from /api/analytics
        const response = await fetch("http://localhost:5000/api/analytics");
        const data = await response.json();

        // Fetch clustering data from /api/clustering-graduates-by-batch
        const clusteringResponse = await fetch(
          "http://localhost:5000/api/clustering-graduates-by-batch"
        );
        const clusteringData = await clusteringResponse.json();

        console.log("Fetched Data:", data);
        console.log("Clustering Data:", clusteringData);

        // Check if both responses are OK
        if (response.ok && clusteringResponse.ok) {
          // Combine the data from both endpoints
          const combinedData = {
            ...data,
            clusters: clusteringData.clusters,
            data: clusteringData.data, // Ensure this matches your frontend expectations
          };

          // Render the charts with the combined data
          renderCharts(combinedData);
          setDataFetched(true);
        } else {
          setErrorMessage("Failed to load data. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(
          "Unable to connect to the server. Please check your backend."
        );
      }
    };

    const renderCharts = (data) => {
      // Bar Chart for "Graduates by Year"
      const barCtx = barChartRef.current.getContext("2d");
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: data.graduatesByYear.map((item) => item.year),
          datasets: [
            {
              label: "Graduates by Year",
              data: data.graduatesByYear.map((item) => item.count),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Graduates by Year",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Graduates",
              },
            },
          },
        },
      });

      // **Adjustments Start Here**

      // Generate a unique and sorted list of cluster indices
      const uniqueClusters = [...new Set(data.data.map((item) => item.cluster))];
      uniqueClusters.sort((a, b) => a - b);

      // Scatter Chart for Clustering "Graduates by Batch-Year"
      const scatterCtx = scatterChartRef.current.getContext("2d");
      if (scatterChartInstanceRef.current) {
        scatterChartInstanceRef.current.destroy();
      }
      scatterChartInstanceRef.current = new Chart(scatterCtx, {
        type: "scatter",
        data: {
          datasets: uniqueClusters.map((clusterIndex, index) => ({
            label: `Cluster ${clusterIndex + 1}`,
            data: data.data
              .filter((item) => item.cluster === clusterIndex)
              .map((item) => ({
                x: parseInt(item.batch_year.split("-")[0]), // Convert batch_year to numerical value
                y: item.graduate_count,
              })),
            backgroundColor: `rgba(${(index * 50) % 255}, ${
              (index * 100) % 255
            }, ${(index * 150) % 255}, 0.6)`,
          })),
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Graduates by Batch-Year (Clusters)",
            },
          },
          scales: {
            x: {
              type: "linear", // Set x-axis type to 'linear'
              title: {
                display: true,
                text: "Batch Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Graduates",
              },
            },
          },
        },
      });
    };

    fetchData();

    // Cleanup function to destroy chart instances on unmount
    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (scatterChartInstanceRef.current) {
        scatterChartInstanceRef.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="analytics-grid">
        {/* Bar Chart */}
        <div className="analytics-card">
          <h3>Graduates by Year</h3>
          <canvas ref={barChartRef} id="barChart"></canvas>
        </div>

        {/* Scatter Chart */}
        <div className="analytics-card">
          <h3>Graduates by Batch-Year (Clusters)</h3>
          <canvas ref={scatterChartRef} id="scatterChart"></canvas>
        </div>
      </div>

      {!dataFetched && !errorMessage && <p>Loading data...</p>}
    </div>
  );
};

export default Analytics;

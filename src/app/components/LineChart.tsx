import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Define the types for the data props
interface DataPoint {
  month: string;
  quantity: number;
}

interface LineChartProps {
  data: DataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Get the context of the canvas
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Create a new chart instance and save it to the ref
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: data.map((item) => item.month), // Labels for the x-axis
            datasets: [
              {
                label: "Order Quantity",
                data: data.map((item) => item.quantity), // Data for the y-axis
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
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
                text: "Order Quantity by Month",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Month",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Order Quantity",
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default LineChart;

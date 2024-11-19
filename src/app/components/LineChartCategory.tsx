import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Define the types for the data props
interface MonthlyCategoryDataPoint {
  month: string;
  category: string;
  totalQuantity: number;
}

interface LineChartCategoryProps {
  data: MonthlyCategoryDataPoint[];
}

const LineChartCategory: React.FC<LineChartCategoryProps> = ({ data }) => {
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
        // Group the data by category
        const categories = Array.from(
          new Set(data.map((item) => item.category))
        );
        const monthLabels = Array.from(new Set(data.map((item) => item.month)));

        const datasets = categories.map((category) => {
          const categoryData = data
            .filter((item) => item.category === category)
            .map((item) => item.totalQuantity);

          return {
            label: category,
            data: categoryData,
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 1)`,
            backgroundColor: `rgba(${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, 0.2)`,
            fill: false,
          };
        });

        // Create a new chart instance and save it to the ref
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: monthLabels, // Labels for the x-axis
            datasets: datasets,
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
                text: "Order Quantity by Month for Each Category",
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

export default LineChartCategory;

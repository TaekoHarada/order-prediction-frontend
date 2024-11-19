"use client";

import { useEffect, useState } from "react";
import LineChartTotal from "./components/LineChartTotal";
import LineChartCategory from "./components/LineChartCategory";
import DataTable from "./components/DataTable";

// Define the types for your sample data
interface MonthlyTotalDataPoint {
  month: string;
  quantity: number;
}

interface MonthlyCategoryDataPoint {
  month: string;
  category: string;
  totalQuantity: number;
}

interface DataRow {
  Category: string;
  Date: string;
  Day: number;
  IsHoliday: number;
  Month: number;
  PredictedOrderQuantity: number;
  Year: number;
}

const BASEURL = "http://127.0.0.1:5000";

const Home: React.FC = () => {
  const [predictedData, setPredictedData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTotalOrderData, setMonthlyTotalOrderData] = useState<
    MonthlyTotalDataPoint[] | null
  >(null);
  const [monthlyCategoryOrderData, setMonthlyCategoryOrderData] = useState<
    MonthlyCategoryDataPoint[] | null
  >(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/predict`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        // DataRow defined as the initial data
        const jsonData: DataRow[] = await response.json();
        setPredictedData(jsonData);

        // Calculate total predicted order quantity for each month across all categories
        const monthlyTotals: { [key: string]: number } = {};
        const categoryMonthlyTotals: {
          [key: string]: { [category: string]: number };
        } = {};

        jsonData.forEach((dataRow) => {
          const monthKey = `${dataRow.Year}-${dataRow.Month}`;

          // Calculate total quantity across all categories
          if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = 0;
          }
          monthlyTotals[monthKey] += dataRow.PredictedOrderQuantity;

          // Calculate total quantity for each category
          if (!categoryMonthlyTotals[monthKey]) {
            categoryMonthlyTotals[monthKey] = {};
          }
          if (!categoryMonthlyTotals[monthKey][dataRow.Category]) {
            categoryMonthlyTotals[monthKey][dataRow.Category] = 0;
          }
          categoryMonthlyTotals[monthKey][dataRow.Category] +=
            dataRow.PredictedOrderQuantity;
        });

        // Convert the totals into arrays for your charts
        const totalDataPoints: MonthlyTotalDataPoint[] = Object.keys(
          monthlyTotals
        ).map((key) => ({
          month: key,
          quantity: monthlyTotals[key],
        }));

        const categoryDataPoints: MonthlyCategoryDataPoint[] = [];
        for (const monthKey in categoryMonthlyTotals) {
          for (const category in categoryMonthlyTotals[monthKey]) {
            categoryDataPoints.push({
              month: monthKey,
              category,
              totalQuantity: categoryMonthlyTotals[monthKey][category],
            });
          }
        }

        // Set the state
        setMonthlyTotalOrderData(totalDataPoints);
        setMonthlyCategoryOrderData(categoryDataPoints);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Order Quantity Line Chart - Total</h1>
      {monthlyTotalOrderData ? (
        <LineChartTotal data={monthlyTotalOrderData} />
      ) : (
        <p>Loading data...</p>
      )}
      <h1>Order Quantity Line Chart - Category</h1>
      {monthlyCategoryOrderData ? (
        <LineChartCategory data={monthlyCategoryOrderData} />
      ) : (
        <p>Loading data...</p>
      )}
      <h1>Order Quantity Line Chart</h1>
      {predictedData && predictedData.length > 0 ? (
        <p>Predicted Data: {predictedData.length}</p>
      ) : null}
      <DataTable data={predictedData} />
    </div>
  );
};

export default Home;

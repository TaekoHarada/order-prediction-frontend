"use client";

import { useEffect, useState } from "react";
import LineChart from "./components/LineChart";
import DataTable from "./components/DataTable";

// Define the types for your sample data
interface DataPoint {
  month: string;
  quantity: number;
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
  const [orderData, setOrderData] = useState<DataPoint[] | null>(null);

  useEffect(() => {
    // Fetch the data from your API or use sample data
    const sampleData: DataPoint[] = [
      { month: "January", quantity: 150 },
      { month: "February", quantity: 200 },
      { month: "March", quantity: 250 },
      { month: "April", quantity: 300 },
      { month: "May", quantity: 180 },
      { month: "June", quantity: 220 },
      { month: "July", quantity: 270 },
      { month: "August", quantity: 310 },
      { month: "September", quantity: 240 },
      { month: "October", quantity: 290 },
      { month: "November", quantity: 260 },
      { month: "December", quantity: 310 },
    ];

    setOrderData(sampleData);
  }, []);

  const [predictedData, setPredictedData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/predict`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setPredictedData(jsonData);
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
      <h1>Order Quantity Line Chart</h1>
      {orderData ? <LineChart data={orderData} /> : <p>Loading data...</p>}
      {predictedData && predictedData.length > 0 ? (
        <p>Predicted Data: {predictedData.length}</p>
      ) : null}
      <DataTable data={predictedData} />
    </div>
  );
};

export default Home;

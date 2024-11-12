import React from "react";

interface DataRow {
  Category: string;
  Date: string;
  Day: number;
  IsHoliday: number;
  Month: number;
  PredictedOrderQuantity: number;
  Year: number;
}

interface TableProps {
  data: DataRow[];
}

const DataTable: React.FC<TableProps> = ({ data }) => {
  // Extract unique categories and dates
  const uniqueCategories = [...new Set(data.map((row) => row.Category))];
  const uniqueDates = [
    ...new Set(data.map((row) => `${row.Month}/${row.Day}`)),
  ];

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Date</th>
          {uniqueCategories.map((category) => (
            <th key={category} className="border border-gray-300 px-4 py-2">
              {category}
            </th>
          ))}
          <th className="border border-gray-300 px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {uniqueDates.map((date) => {
          const [month, day] = date.split("/").map(Number); //["1", "15"].map(Number) return [1, 15]

          // Filter rows for the current date
          const rowsForDate = data.filter(
            (row) => row.Month === month && row.Day === day
          );

          // True or False
          const isHoliday = rowsForDate.some((row) => row.IsHoliday === 1);

          // Calculate the total predicted order quantity
          const totalOrderQuantity = rowsForDate.reduce(
            (total, row) => total + row.PredictedOrderQuantity,
            0
          );

          return (
            <tr key={date} className={isHoliday ? "bg-red-100" : ""}>
              <td className="border border-gray-300 px-4 py-2">{`${month}/${day}`}</td>
              {uniqueCategories.map((category) => {
                const dataRow = rowsForDate.find(
                  (row) => row.Category === category
                );
                return (
                  <td
                    key={`${date}-${category}`}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {dataRow
                      ? dataRow.PredictedOrderQuantity.toFixed(2)
                      : "N/A"}
                  </td>
                );
              })}
              <td className="border border-gray-300 px-4 py-2 font-bold">
                {totalOrderQuantity.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;

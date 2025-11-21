import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function AutoChart({ text }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!text || text.length < 3) return;

    // Extract numbers
    const numbers = text.match(/[0-9.,]+/g);

    if (!numbers || numbers.length === 0) return;

    // Convert to clean integers
    const cleaned = numbers
      .map((n) => parseFloat(n.replace(/,/g, "")))
      .filter((n) => !isNaN(n));

    if (cleaned.length === 0) return;

    // Define labels
    const labels = cleaned.map((_, index) => `#${index + 1}`);

    // Destroy old chart if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create chart
    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Detected Financial Values",
            data: cleaned,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [text]);

  return (
    <div className="mt-6 p-4 bg-white border rounded shadow">
      <h2 className="text-lg font-bold mb-2">Auto-Generated Chart</h2>
      <canvas ref={canvasRef} className="w-full h-64"></canvas>
    </div>
  );
}

import { useEffect, useState } from "react";
import AutoChart from "../charts/AutoChart"; 

export default function AnalysisPanel() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [insights, setInsights] = useState("");

  useEffect(() => {
    const handler = (e) => {
      setInputText(e.detail.text);
      setSummary("");
      setInsights("");
    };

    window.addEventListener("section-text", handler);
    return () => window.removeEventListener("section-text", handler);
  }, []);

  const requestExtract = (ref) => {
    window.dispatchEvent(
      new CustomEvent("extract-section", { detail: { target: ref } })
    );
    window.dispatchEvent(
      new CustomEvent("highlight", { detail: { target: ref } })
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ------------------------------
  // SUMMARY LOGIC
  // ------------------------------
  const summarizeLocally = (text) => {
    if (!text || text.length < 50) return "Not enough text to summarize.";

    const sentences = text.split(/[.?!]/).filter((s) => s.length > 10);
    return sentences.slice(0, 3).join(". ") + ".";
  };

  const handleSummarize = () => {
    setLoading(true);

    setTimeout(() => {
      const result = summarizeLocally(inputText);
      setSummary(result);
      setLoading(false);
    }, 500);
  };

  // ------------------------------
  // INSIGHT GENERATOR
  // ------------------------------
  const extractInsights = (text) => {
    if (!text || text.length < 40)
      return "Not enough data to extract insights.";

    const insights = [];

    const numbers = text.match(/[0-9.,]+%?/g);
    if (numbers) insights.push("📊 Key Figures: " + numbers.join(", "));

    if (text.toLowerCase().includes("increase"))
      insights.push(" Growth detected.");
    if (text.toLowerCase().includes("decrease"))
      insights.push(" Decline detected.");
    if (text.toLowerCase().includes("logistics"))
      insights.push(" Logistics discussed.");
    if (text.toLowerCase().includes("revenue"))
      insights.push("  Revenue information found.");
    if (text.toLowerCase().includes("management"))
      insights.push(" Management commentary found.");
    if (text.toLowerCase().includes("margin"))
      insights.push(" Margin / EBITDA discussions.");

    if (insights.length === 0) return "No strong insights detected.";

    return insights.join("\n");
  };

  const handleInsights = () => {
    setLoading(true);
    setTimeout(() => {
      setInsights(extractInsights(inputText));
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Analysis Panel</h1>

        <textarea
          className="border p-2 w-full h-40 resize-none bg-white rounded"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Extracted text will appear here..."
        ></textarea>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-white text-black border rounded shadow hover:bg-gray-200"
        >
          {copied ? "Copied ✓" : "Copy Text"}
        </button>

        <button
          onClick={handleSummarize}
          className="px-4 py-2 bg-yellow-300 text-black border rounded shadow hover:bg-yellow-400 ml-2"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        <button
          onClick={handleInsights}
          className="px-4 py-2 bg-purple-300 text-black border rounded shadow hover:bg-purple-400 ml-2"
        >
          Generate Insights
        </button>

        {/* SUMMARY OUTPUT */}
        {summary && (
          <div className="mt-4 p-4 bg-yellow-50 border rounded shadow">
            <h2 className="font-bold mb-2">AI Summary:</h2>
            <p className="text-gray-800">{summary}</p>
          </div>
        )}

        {/* INSIGHTS OUTPUT */}
        {insights && (
          <div className="mt-4 p-4 bg-purple-50 border rounded shadow whitespace-pre-line">
            <h2 className="font-bold mb-2 text-purple-700">Insights:</h2>
            <pre className="text-gray-900 whitespace-pre-line">{insights}</pre>
          </div>
        )}

        {/* AUTO CHART SECTION — GENERATED FROM TEXT */}
        {inputText && <AutoChart text={inputText} />}

        {/* SECTION BUTTONS */}
        <div className="pt-4 space-y-3">
          <p>
            Revenue Increase →
            <button
              onClick={() => requestExtract("financials")}
              className="px-2 bg-blue-200 text-black rounded"
            >
              [3]
            </button>
          </p>

          <p>
            Management Review →
            <button
              onClick={() => requestExtract("operations")}
              className="px-2 bg-blue-200 text-black rounded"
            >
              [2]
            </button>
          </p>

          <p>
            Introduction →
            <button
              onClick={() => requestExtract("intro")}
              className="px-2 bg-blue-200 text-black rounded"
            >
              [1]
            </button>
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="mt-6">
        <h2 className="font-bold mb-2 text-lg">Search in PDF</h2>

        <input
          id="pdfSearch"
          type="text"
          placeholder="Enter keyword..."
          className="border p-2 w-full rounded mb-2"
        />

        <button
          onClick={() => {
            const text = document.getElementById("pdfSearch").value;
            window.dispatchEvent(
              new CustomEvent("pdf-search", { detail: { text } })
            );
          }}
          className="px-4 py-2 bg-green-300 text-black border rounded shadow hover:bg-green-400"
        >
          Search
        </button>
      </div>
    </>
  );
}

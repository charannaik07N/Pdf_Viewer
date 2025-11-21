import PdfViewer from "./components/PdfViewer";
import AnalysisPanel from "./components/AnalysisPanel";

export default function App() {
  return (
    <div className="grid grid-cols-2 h-screen overflow-hidden">
      <div className="overflow-hidden border-r">
        <PdfViewer />
      </div>

      <div className="p-6 overflow-y-auto bg-gray-50">
        <AnalysisPanel />
      </div>
    </div>
  );
}

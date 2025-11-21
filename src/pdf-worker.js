import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.js?worker";

GlobalWorkerOptions.workerSrc = workerSrc;

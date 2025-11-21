# 📘 PDF Reader & Analysis Panel

An interactive PDF analysis tool built using **React + Vite + PDF.js**.  
This project enables users to view PDFs, extract text, highlight sections, search within the document, auto-detect headings, generate summaries, insights, and even auto-create charts based on extracted numbers.

---

## 🚀 Features

### ✅ PDF Viewer (PDF.js iframe)
- Integrated official PDF.js viewer  
- Smooth scrolling  
- Dynamic highlight overlay  
- Custom text extraction per section  
- Automatic detection of PDF headings:  
  - Introduction  
  - Management Review  
  - Financials  

---

### 🔍 Search Inside PDF
- Keyword-based search  
- Automatic yellow highlights  
- Smooth scroll to first matching result  

---

### 🟡 Section Reference Buttons
Predefined buttons like:

- `[1] Introduction`  
- `[2] Management Review`  
- `[3] Revenue Increase / Financials`  

Each button triggers:

- Auto-scroll to the exact section in the PDF  
- Yellow highlight overlay  
- Extracts section text  
- Sends the extracted text to the Analysis Panel  

---

## ✏️ Analysis Panel

Includes:

- Extracted Text Viewer  
- Copy-to-Clipboard  
- Auto Summary Generator  
- Insight Generator  
- Auto Chart generated from extracted numbers  

---

## 📊 AutoChart
- Extracts numerical data from text  
- Auto-generates a clean bar chart  
- Useful for financial and operational insights  

---

## 📁 Project Structure

<img width="478" height="727" alt="image" src="https://github.com/user-attachments/assets/1b154a2b-7342-4aa9-a385-94e00b92dc2c" />



> ⚠️ **Important:**  
> Do NOT delete the `public/web` or `public/build` folders.  
> These are essential for the PDF.js viewer to work.

---

## 🛠️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/pdf_reader.git
cd pdf_reader

2️⃣ Install dependencies
npm install

3️⃣ Start Development Server
npm run dev


 App available at:
👉 http://localhost:5173/

📦 Build for Production
npm run build
npm run preview

✨ How It Works (Concept Summary)

PdfViewer.jsx loads the official PDF.js viewer inside an iframe.

.textLayer span elements are scanned to extract text.

Sections are identified automatically via keyword detection.

The AnalysisPanel interacts with the viewer using commands:

extract-section

highlight

pdf-search

The PdfViewer highlights, extracts text, and returns results back to the panel.

The Analysis Panel displays:

Extracted text

Summaries

Insights

Auto-generated charts

📄 Technologies Used

React + Vite

PDF.js (Official Viewer)

Chart.js

TailwindCSS (optional)

Modern ES6 JavaScript

## 🧑‍💻 Author

Charan Nayak
B.Tech – SRM AP
Frontend Developer & UX/UI Enthusiast

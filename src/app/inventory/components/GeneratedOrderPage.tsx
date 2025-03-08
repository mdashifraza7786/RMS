import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface GeneratedOrderPageProps {
  inventoryOrder: { item_name: string; quantity: number; unit: string; remarks?: string }[];
  onClose: () => void;
}

const GeneratedOrderPage: React.FC<GeneratedOrderPageProps> = ({ inventoryOrder, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // PDF width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("GeneratedOrder.pdf");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-primary text-xl font-semibold mb-4">Generated Order</h2>
        <div ref={printRef} className="overflow-x-auto p-4 border border-gray-300 rounded-md bg-white">
            <div className="flex justify-between py-5">
                <div>DATE - {new Date().toLocaleDateString()}</div>
                <div>TIME - {new Date().toLocaleTimeString()}</div>
            </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Unit</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {inventoryOrder.map((order, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{order.item_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.unit}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.remarks || "No remarks"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">Close</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white rounded">Print as PDF</button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedOrderPage;

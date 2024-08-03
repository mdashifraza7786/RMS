// // Popup.jsx
// import React from 'react';

// const Popup = ({ data, onClose }:any) => {
//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//             <div className="bg-white p-8 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4">Details</h2>
//                 <div className="mb-4">
//                     <p><strong>Name:</strong> {data.name}</p>
//                     <p><strong>ID:</strong> {data.id}</p>
//                     <p><strong>Mobile:</strong> {data.mobile}</p>
//                     <p><strong>Role:</strong> {data.role}</p>
//                     <p><strong>Account Holder:</strong> {data.accountHolder}</p>
//                     <p><strong>Account Number:</strong> {data.accountNumber}</p>
//                     <p><strong>IFSC:</strong> {data.ifsc}</p>
//                     <p><strong>Branch:</strong> {data.branch}</p>
//                     <p><strong>Amount:</strong> {data.amount}</p>
//                     <p><strong>Status:</strong> {data.status}</p>
//                     <p><strong>Date of Payment:</strong> {data.dateofpayment}</p>
//                 </div>
//                 <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-md">Close</button>
//             </div>
//         </div>
//     );
// };

// export default Popup;
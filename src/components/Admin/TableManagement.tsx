"use client";

import React, { Suspense } from "react";
import { Bars } from "react-loader-spinner";
import { MdTableBar } from "react-icons/md";

interface TableManagementProps {
  tableLoaded: boolean;
  tableData: { tablenumber: number; availability: number }[];
  TableStatusCard: React.ComponentType<any>;
  handleOrder: (tablenumber: number) => void;
  clickableTables?: number[];
}

const TableManagement: React.FC<TableManagementProps> = ({
  tableLoaded,
  tableData,
  TableStatusCard,
  handleOrder,
  clickableTables = [],
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MdTableBar className="text-primary" />
          Table Management
        </h3>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Occupied</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        <Suspense
          fallback={
            <div className="col-span-full flex justify-center items-center h-32 sm:h-40">
              <span className="text-primary">
                <Bars height="32" width="32" color="currentColor" ariaLabel="bars-loading" visible={true} />
              </span>
            </div>
          }
        >
          {tableLoaded ? (
            <div className="col-span-full flex justify-center items-center h-32 sm:h-40">
              <span className="text-primary">
                <Bars height="32" width="32" color="currentColor" ariaLabel="bars-loading" visible={true} />
              </span>
            </div>
          ) : tableData && tableData.length > 0 ? (
            tableData.map((item, index) => (
              <TableStatusCard
                key={index}
                tablestatus={item.availability === 0 ? "available" : "notavailable"}
                tableno={Number(item.tablenumber)}
                doOrder={handleOrder}
                isClickable={clickableTables.includes(Number(item.tablenumber))}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-32 sm:h-40 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500 text-xs sm:text-sm">No tables available. Please add a table.</p>
            </div>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default TableManagement;



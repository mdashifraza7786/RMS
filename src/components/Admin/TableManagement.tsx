"use client";

import React, { Suspense } from "react";
import Skeleton from "../ui/Skeleton";
import { MdTableBar } from "react-icons/md";

interface TableManagementProps {
  isTableLoading: boolean;
  tableData: { tablenumber: number; availability: number }[];
  TableStatusCard: React.ComponentType<any>;
  handleOrder: (tablenumber: number) => void;
  clickableTables?: number[];
}

const TableManagement: React.FC<TableManagementProps> = ({
  isTableLoading,
  tableData,
  TableStatusCard,
  handleOrder,
  clickableTables = [],
}) => {
  const availableCount = tableData.filter(t => t.availability === 0).length;
  const occupiedCount = tableData.filter(t => t.availability !== 0).length;

  return (
    <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2.5">
          <span className="w-1 h-5 bg-primary rounded-full inline-block flex-shrink-0" />
          Table Management
        </h3>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-success rounded-full" />
            <span className="text-xs text-gray-500">
              Available
              {!isTableLoading && <span className="font-mono font-semibold text-gray-700 ml-1">{availableCount}</span>}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-danger rounded-full" />
            <span className="text-xs text-gray-500">
              Occupied
              {!isTableLoading && <span className="font-mono font-semibold text-gray-700 ml-1">{occupiedCount}</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 tablet:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        <Suspense
          fallback={
            <div className="col-span-full grid grid-cols-3 sm:grid-cols-4 tablet:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} variant="rect" width="100%" height="88px" className="rounded-xl" />
              ))}
            </div>
          }
        >
          {isTableLoading ? (
            <div className="col-span-full grid grid-cols-3 sm:grid-cols-4 tablet:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} variant="rect" width="100%" height="88px" className="rounded-xl" />
              ))}
            </div>
          ) : tableData && tableData.length > 0 ? (
            [...tableData]
              .sort((a, b) => Number(a.tablenumber) - Number(b.tablenumber))
              .map((item, index) => (
                <TableStatusCard
                  key={index}
                  tablestatus={item.availability === 0 ? "available" : "notavailable"}
                  tableno={Number(item.tablenumber)}
                  doOrder={handleOrder}
                  isClickable={clickableTables.includes(Number(item.tablenumber))}
                />
              ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No tables configured. Add tables in settings.</p>
            </div>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default TableManagement;

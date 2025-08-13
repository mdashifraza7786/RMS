"use client";

import React from 'react';

interface MobileTableViewProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (value: any, item: any) => React.ReactNode;
    isHidden?: boolean;
  }[];
  keyField: string;
  actions?: (item: any) => React.ReactNode;
  emptyMessage?: string;
}

const MobileTableView: React.FC<MobileTableViewProps> = ({
  data,
  columns,
  keyField,
  actions,
  emptyMessage = "No data available"
}) => {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div 
          key={item[keyField]} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Card header - typically contains the most important info */}
          <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
            <div className="font-medium text-gray-800">
              {item[columns[0].key] ? (
                columns[0].render ? 
                  columns[0].render(item[columns[0].key], item) : 
                  item[columns[0].key]
              ) : "—"}
            </div>
            {columns.find(col => col.key === 'status') && (
              <div>
                {columns.find(col => col.key === 'status')?.render ? 
                  columns.find(col => col.key === 'status')?.render!(item['status'], item) : 
                  item['status']}
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            {columns.slice(1).map((column) => (
              !column.isHidden && column.key !== 'status' && (
                <div key={column.key} className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">{column.header}</div>
                  <div className="font-medium text-gray-800">
                    {item[column.key] !== undefined && item[column.key] !== null ? (
                      column.render ? 
                        column.render(item[column.key], item) : 
                        item[column.key]
                    ) : "—"}
                  </div>
                </div>
              )
            ))}
          </div>

          {actions && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2 justify-end">
                {actions(item)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileTableView;


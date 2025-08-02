"use client";

import React, { useState, useEffect } from 'react';
import { FaBox, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';


const InventoryForecastPage: React.FC = () => {
 

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaChartLine className="mr-2" /> Inventory Forecast
        </h1>
        <p className="text-gray-600 mt-1">
          Predict inventory needs based on historical usage patterns
        </p>
      </div>
    </div>
  );
};

export default InventoryForecastPage;

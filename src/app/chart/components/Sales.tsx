"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions } from 'chart.js';

type ChartKey =
    'week day vs sales' |
    'time slot vs orders' |
    'week day vs customer' |
    'Dish category vs sales' |
    'payment method vs sales' |
    'age group vs sales' |
    'gender group vs sales';

interface Data {
    sunday_sales: number;
    monday_sales: number;
    tuesday_sales: number;
    wednesday_sales: number;
    thursday_sales: number;
    friday_sales: number;
    saturday_sales: number;
    week1_sales: number;
    week2_sales: number;
    week3_sales: number;
    week4_sales: number;
    jan_sales: number;
    feb_sales: number;
    march_sales: number;
    april_sales: number;
    may_sales: number;
    june_sales: number;
    july_sales: number;
    aug_sales: number;
    sept_sales: number;
    oct_sales: number;
    nov_sales: number;
    dec_sales: number;

    orders_week_breakfast: number;
    orders_week_lunch: number;
    orders_week_evening: number;
    orders_week_dinner: number;
    orders_month_breakfast: number;
    orders_month_lunch: number;
    orders_month_evening: number;
    orders_month_dinner: number;
    orders_year_breakfast: number;
    orders_year_lunch: number;
    orders_year_evening: number;
    orders_year_dinner: number;

    sunday_visits_week: number;
    monday_visits_week: number;
    tuesday_visits_week: number;
    wednesday_visits_week: number;
    thursday_visits_week: number;
    friday_visits_week: number;
    saturday_visits_week: number;

    sunday_visits_month: number;
    monday_visits_month: number;
    tuesday_visits_month: number;
    wednesday_visits_month: number;
    thursday_visits_month: number;
    friday_visits_month: number;
    saturday_visits_month: number;

    sunday_visits_year: number;
    monday_visits_year: number;
    tuesday_visits_year: number;
    wednesday_visits_year: number;
    thursday_visits_year: number;
    friday_visits_year: number;
    saturday_visits_year: number;

    sales_week_breakfast: number;
    sales_week_lunch: number;
    sales_week_evening: number;
    sales_week_dinner: number;
    sales_month_breakfast: number;
    sales_month_lunch: number;
    sales_month_evening: number;
    sales_month_dinner: number;
    sales_year_breakfast: number;
    sales_year_lunch: number;
    sales_year_evening: number;
    sales_year_dinner: number;

    cash_week: number;
    upi_week: number;
    debitcard_week: number;
    creditcard_week: number;
    others_week: number;

    cash_month: number;
    upi_month: number;
    debitcard_month: number;
    creditcard_month: number;
    others_month: number;

    cash_year: number;
    upi_year: number;
    debitcard_year: number;
    creditcard_year: number;
    others_year: number;

    children_week: number;
    teens_week: number;
    adults_week: number;
    middle_aged_week: number;
    seniors_week: number;

    children_month: number;
    teens_month: number;
    adults_month: number;
    middle_aged_month: number;
    seniors_month: number;

    children_year: number;
    teens_year: number;
    adults_year: number;
    middle_aged_year: number;
    seniors_year: number;

    male_week: number;
    female_week: number;
    other_week: number;

    male_month: number;
    female_month: number;
    other_month: number;

    male_year: number;
    female_year: number;
    other_year: number;
}


const Sales: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs sales');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [data, setData] = useState<Data>({
        sunday_sales: 0,
        monday_sales: 0,
        tuesday_sales: 0,
        wednesday_sales: 0,
        thursday_sales: 0,
        friday_sales: 0,
        saturday_sales: 0,
      
        week1_sales: 0,
        week2_sales: 0,
        week3_sales: 0,
        week4_sales: 0,
      
        jan_sales: 0,
        feb_sales: 0,
        march_sales: 0,
        april_sales: 0,
        may_sales: 0,
        june_sales: 0,
        july_sales: 0,
        aug_sales: 0,
        sept_sales: 0,
        oct_sales: 0,
        nov_sales: 0,
        dec_sales: 0,
      
        orders_week_breakfast: 0,
        orders_week_lunch: 0,
        orders_week_evening: 0,
        orders_week_dinner: 0,
        orders_month_breakfast: 0,
        orders_month_lunch: 0,
        orders_month_evening: 0,
        orders_month_dinner: 0,
        orders_year_breakfast: 0,
        orders_year_lunch: 0,
        orders_year_evening: 0,
        orders_year_dinner: 0,
      
        sunday_visits_week: 0,
        monday_visits_week: 0,
        tuesday_visits_week: 0,
        wednesday_visits_week: 0,
        thursday_visits_week: 0,
        friday_visits_week: 0,
        saturday_visits_week: 0,
      
        sunday_visits_month: 0,
        monday_visits_month: 0,
        tuesday_visits_month: 0,
        wednesday_visits_month: 0,
        thursday_visits_month: 0,
        friday_visits_month: 0,
        saturday_visits_month: 0,
      
        sunday_visits_year: 0,
        monday_visits_year: 0,
        tuesday_visits_year: 0,
        wednesday_visits_year: 0,
        thursday_visits_year: 0,
        friday_visits_year: 0,
        saturday_visits_year: 0,
      
        sales_week_breakfast: 0,
        sales_week_lunch: 0,
        sales_week_evening: 0,
        sales_week_dinner: 0,
        sales_month_breakfast: 0,
        sales_month_lunch: 0,
        sales_month_evening: 0,
        sales_month_dinner: 0,
        sales_year_breakfast: 0,
        sales_year_lunch: 0,
        sales_year_evening: 0,
        sales_year_dinner: 0,
      
        cash_week: 0,
        upi_week: 0,
        debitcard_week: 0,
        creditcard_week: 0,
        others_week: 0,
      
        cash_month: 0,
        upi_month: 0,
        debitcard_month: 0,
        creditcard_month: 0,
        others_month: 0,
      
        cash_year: 0,
        upi_year: 0,
        debitcard_year: 0,
        creditcard_year: 0,
        others_year: 0,
      
        children_week: 0,
        teens_week: 0,
        adults_week: 0,
        middle_aged_week: 0,
        seniors_week: 0,
      
        children_month: 0,
        teens_month: 0,
        adults_month: 0,
        middle_aged_month: 0,
        seniors_month: 0,
      
        children_year: 0,
        teens_year: 0,
        adults_year: 0,
        middle_aged_year: 0,
        seniors_year: 0,
      
        male_week: 0,
        female_week: 0,
        other_week: 0,
      
        male_month: 0,
        female_month: 0,
        other_month: 0,
      
        male_year: 0,
        female_year: 0,
        other_year: 0,
      });
      

    useEffect(() => {
        document.title = "Sales";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const response = await axios.get("/api/chart/salesChart");

                // Convert response data from string to number
                const parsedData: Data = Object.fromEntries(
                    Object.entries(response.data).map(([key, value]) => [key, Number(value)])
                ) as unknown as Data;

                setData(parsedData);
                console.log(parsedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataset();
    }, []);

    const generateData = (label: string) => {

        if (chartXY === 'week day vs sales') {
            return {
                labels: timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] :
                    timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.sunday_sales, data?.monday_sales, data?.tuesday_sales, data?.wednesday_sales, data?.thursday_sales, data?.friday_sales, data?.saturday_sales] :
                        timeFrame === 'monthly' ? [data?.week1_sales, data?.week2_sales, data?.week3_sales, data?.week4_sales] :
                            [data?.jan_sales, data?.feb_sales, data?.march_sales, data?.april_sales, data?.may_sales, data?.june_sales, data?.july_sales, data?.aug_sales, data?.sept_sales, data?.oct_sales, data?.nov_sales, data?.dec_sales],
                    backgroundColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'time slot vs orders') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.orders_week_breakfast, data?.orders_week_lunch, data?.orders_week_evening, data?.orders_week_dinner] :
                        timeFrame === 'monthly' ? [data?.orders_month_breakfast, data?.orders_month_lunch, data?.orders_month_evening, data?.orders_month_dinner] : [data?.orders_year_breakfast, data?.orders_year_lunch, data?.orders_year_evening, data?.orders_year_dinner],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'week day vs customer') {
            return {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.sunday_visits_week, data?.monday_visits_week, data?.tuesday_visits_week, data?.wednesday_visits_week, data?.thursday_visits_week, data?.friday_visits_week, data?.saturday_visits_week] :
                        timeFrame === 'monthly' ? [data?.sunday_visits_month, data?.monday_visits_month, data?.tuesday_visits_month, data?.wednesday_visits_month, data?.thursday_visits_month, data?.friday_visits_month, data?.saturday_visits_month] :
                            [data?.sunday_visits_year, data?.monday_visits_year, data?.tuesday_visits_year, data?.wednesday_visits_year, data?.thursday_visits_year, data?.friday_visits_year, data?.saturday_visits_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'Dish category vs sales') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.sales_week_breakfast, data?.sales_week_lunch, data?.sales_week_evening, data?.sales_week_dinner] :
                        timeFrame === 'monthly' ? [data?.sales_month_breakfast, data?.sales_month_lunch, data?.sales_month_evening, data?.sales_month_dinner] :
                            [data?.sales_year_breakfast, data?.sales_year_lunch, data?.sales_year_evening, data?.sales_year_dinner],

                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'payment method vs sales') {
            return {
                labels: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Others'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.upi_week, data?.creditcard_week, data?.debitcard_week, data?.cash_week, data?.others_week] :
                        timeFrame === 'monthly' ? [data?.upi_month, data?.creditcard_month, data?.debitcard_month, data?.cash_month, data?.others_month] :
                            [data?.upi_year, data?.creditcard_year, data?.debitcard_year, data?.cash_year, data?.others_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'age group vs sales') {
            return {
                labels: ['<10', '10-18', '18-40', '40-60', '60+'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.children_week, data?.teens_week, data?.adults_week, data?.middle_aged_week, data?.seniors_week] :
                        timeFrame === 'monthly' ? [data?.children_month, data?.teens_month, data?.adults_month, data?.middle_aged_month, data?.seniors_month] :
                            [data?.children_year, data?.teens_year, data?.adults_year, data?.middle_aged_year, data?.seniors_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        else {
            return {
                labels: ['Female', 'Male', 'Others'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data?.male_week, data?.female_week, data?.other_week] :
                        timeFrame === 'monthly' ? [data?.male_month, data?.female_month, data?.other_month] :
                            [data?.male_year, data?.female_year, data?.other_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }
    };


    const chartData = useMemo(() => {
       
        return generateData('Sales (₹)');
    }, [chartXY, colors, timeFrame]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'week day vs sales': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
            'time slot vs orders': 'Time Slots',
            'week day vs customer': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Quarters'),
            'Dish category vs sales': 'Dish Category',
            'payment method vs sales': 'Payment Method',
            'age group vs sales': 'Age Group',
            'gender group vs sales': 'Gender Group',
        };

        const yAxisLabels: Record<ChartKey, string> = {
            'week day vs sales': 'Sales (₹)',
            'time slot vs orders': 'Orders',
            'week day vs customer': 'Customer Visits',
            'Dish category vs sales': 'Sales (₹)',
            'payment method vs sales': 'Sales (₹)',
            'age group vs sales': 'Sales (₹)',
            'gender group vs sales': 'Sales (₹)',
        };

        const tooltipLabels: Record<ChartKey, string> = {
            'week day vs sales': 'Sales (₹)',
            'time slot vs orders': 'Orders',
            'week day vs customer': 'Customer Visits',
            'Dish category vs sales': 'Sales (₹)',
            'payment method vs sales': 'Sales (₹)',
            'age group vs sales': 'Sales (₹)',
            'gender group vs sales': 'Sales (₹)',
        };

        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabels[chartXY] || 'X Axis',
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yAxisLabels[chartXY] || 'Y Axis',
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            // Get the correct tooltip label based on chart type
                            const value = context.raw;
                            const label = tooltipLabels[chartXY] || '';  // Fetch the appropriate label
                            return `${value} ${label}`;  // Return only the value and correct label
                        }
                    }
                },
            },
        };
    }, [chartType, chartXY, timeFrame]);



    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="week day vs sales">Sales by timeline</option>
                    <option value="time slot vs orders">Orders by time of day</option>
                    <option value="week day vs customer">Customer visits by days of the week</option>
                    <option value="Dish category vs sales">Sales by dish category</option>
                    <option value="payment method vs sales">Sales by payment method</option>
                    <option value="age group vs sales">Sales by age group</option>
                    <option value="gender group vs sales">Sales distribution by customer gender</option>
                </select>

                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line')}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="line">Line Chart</option>
                </select>

                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

            </section>

            {/* Chart */}
            <section className="flex justify-center items-center" style={{ width: '100%', height: '450px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
            </section>
        </div>
    );
};

export default Sales;


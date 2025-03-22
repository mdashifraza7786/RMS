import { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaReceipt, FaSearch, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { MenuData, OrderScreenProps } from "./types";
import MenuSearch from "./MenuSearch";
import SelectedItems from "./SelectedItems";
import OrderedItems from "./OrderedItems";
import BillSummary from "./BillSummary";
import CompleteOrderModal from "./CompleteOrderModal";
import ConfirmationModal from "./ConfirmationModal";

const OrderScreen: React.FC<OrderScreenProps> = ({
    tableNumber,
    tabledata,
    orderedItem,
    setorderitemsfun,
    removeOrderedItems,
    resettable,
    closeOrderScreen
}) => {
    // State variables
    const [menuData, setMenuData] = useState<MenuData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<{ item: MenuData; quantity: number }[]>([]);
    const [modal, setModal] = useState<{ visible: boolean; message: string; success: boolean }>({ visible: false, message: "", success: false });
    const [booked, setBooked] = useState<boolean>(false);
    const [completeOrderPopup, setCompleteOrderPopup] = useState<boolean>(false);
    const [currentCompleteOrder, setCurrentCompleteOrder] = useState<{ tablenumber: number, orderid: number }>({} as { tablenumber: number, orderid: number });
    const [activeTab, setActiveTab] = useState<'menu' | 'order'>('menu');

    // Effects
    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchMenuData();
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const table = tabledata.find((t) => t.availability === 1 && t.tablenumber === tableNumber);
        if (table) {
            setBooked(true);
        } else {
            setBooked(false);
        }
    }, [tabledata, tableNumber]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            setIsDropdownVisible(true);
        } else {
            setIsDropdownVisible(false);
        }
    }, [searchTerm]);

    // API handlers
    const fetchMenuData = async () => {
        try {
            const response = await axios.get('/api/menu');
            if (Array.isArray(response.data.menu)) {
                setMenuData(response.data.menu.map((item: any) => ({
                    ...item,
                    item_price: Number(item.item_price),
                })));
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const placeOrder = async () => {
        if (selectedItems.length === 0) {
            setModal({ visible: true, message: "Please add items to place an order!", success: false });
            return;
        }

        const orderData = {
            tableNumber,
            items: selectedItems.map(({ item, quantity }) => ({
                item_id: item.item_id,
                item_name: item.item_name,
                quantity,
                price: item.item_price
            })),
            subtotal,
            gst,
            totalAmount
        };

        try {
            const response = booked 
                ? await axios.post(`/api/order/placeOrder/${orderedItem.find(table => table.tablenumber === tableNumber)?.orderid}`, orderData) 
                : await axios.post('/api/order/placeOrder', orderData);
                
            if (response.data.success) {
                const bookedItems = selectedItems.map(({ item, quantity }) => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity,
                    price: item.item_price,
                }));

                setorderitemsfun({ 
                    orderid: response.data.orderId, 
                    billing: { subtotal: subtotal }, 
                    tablenumber: tableNumber, 
                    itemsordered: bookedItems 
                });

                if (booked) {
                    setModal({ visible: true, message: `Order Updated Successfully!`, success: true });
                } else {
                    setModal({ visible: true, message: `Order Placed Successfully! Order ID: ${response.data.orderId}`, success: true });
                    tabledata.map((table) => {
                        if (table.tablenumber === tableNumber) {
                            table.availability = 1;
                        }
                    });
                    setBooked(true);
                }
                setSelectedItems([]);
            } else {
                setModal({ visible: true, message: response.data.error || "Order Failed", success: false });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setModal({ visible: true, message: "Failed to place order, please try again!", success: false });
        }
    };

    const completeOrder = async (tablenumber: number, orderid: number, method: string, discount?: { value: number, type: string }) => {
        setCompleteOrderPopup(false);
        try {
            const response = await axios.post(`/api/order/completeOrder/${orderid}`, { 
                tablenumber: tablenumber, 
                paymentmethod: method,
                discount: discount || null
            });
            
            if (response.data.success) {
                setModal({ visible: true, message: `Order Completed!`, success: true });
                printBill(tablenumber, orderid, method, discount);
                tabledata.map((table) => {
                    if (table.tablenumber === tableNumber) {
                        table.availability = 0;
                    }
                });
                setBooked(false);
                setSelectedItems([]);
                setorderitemsfun({ orderid: 0, billing: { subtotal: 0 }, tablenumber: 0, itemsordered: [] });
                resettable(tablenumber);
            } else {
                setModal({ 
                    visible: true, 
                    message: response.data.message || "Order Completion failed", 
                    success: false 
                });
            }
        } catch (error) {
            console.error("Error completing order:", error);
            setModal({ 
                visible: true, 
                message: "Error completing order. Please try again.", 
                success: false 
            });
        }
    };

    // Event handlers
    const handleItemSelect = (selectedItem: MenuData) => {
        const existingItem = selectedItems.find(entry => entry.item.item_id === selectedItem.item_id);
        if (existingItem) {
            setSelectedItems(selectedItems.map(entry =>
                entry.item.item_id === selectedItem.item_id ? { ...entry, quantity: entry.quantity + 1 } : entry
            ));
        } else {
            setSelectedItems([...selectedItems, { item: selectedItem, quantity: 1 }]);
        }
        setSearchTerm('');
        setIsDropdownVisible(false);
    };

    const handleQuantityChange = (itemId: string, newQuantity: string) => {
        if (!/^\d*$/.test(newQuantity)) return;

        setSelectedItems(selectedItems.map(({ item, quantity }) =>
            item.item_id === itemId
                ? { item, quantity: newQuantity === "" ? 0 : parseInt(newQuantity, 10) }
                : { item, quantity }
        ));
    };

    const handleBlur = (itemId: string, quantity: number) => {
        if (quantity === 0) {
            setSelectedItems(selectedItems.filter(({ item }) => item.item_id !== itemId));
        }
    };

    const removeSelectedItem = (itemId: string) => {
        setSelectedItems(selectedItems.filter(entry => entry.item.item_id !== itemId));
    };

    const handleCompleteOrder = () => {
        const currentOrder = orderedItem.find(table => table.tablenumber === tableNumber);
        if (currentOrder) {
            setCompleteOrderPopup(true);
            setCurrentCompleteOrder({ 
                tablenumber: tableNumber, 
                orderid: currentOrder.orderid 
            });
        }
    };

    // Bill calculations
    const currentOrder = orderedItem.find(table => table.tablenumber === tableNumber);
    const presubtotal = currentOrder?.billing?.subtotal ?? 0;
    const newSubtotal = selectedItems.reduce((total, entry) => total + (entry.item.item_price * entry.quantity), 0);
    const subtotal = presubtotal + newSubtotal;
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;

    // Memoized data
    const filteredData = useMemo(() => {
        return menuData.filter(item =>
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, menuData]);

    // Helper functions
    const printBill = (tablenumber: number, orderid: number, method: string, discount?: { value: number, type: string }) => {
        const currentOrder = orderedItem.find(table => table.tablenumber === tableNumber);

        if (!currentOrder) {
            setModal({ visible: true, message: "No order found for this table.", success: false });
            return;
        }

        const subtotal = currentOrder.itemsordered.reduce((sum, item) => sum + item.quantity * item.price, 0);
        
        // Calculate discount if provided
        let discountAmount = 0;
        if (discount && discount.value > 0) {
            if (discount.type === "flat") {
                discountAmount = discount.value;
            } else {
                // Percentage discount
                discountAmount = (discount.value / 100) * subtotal;
            }
        }
        
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const GST = discountedSubtotal * 0.18;
        const totalAmount = discountedSubtotal + GST;
        const currentDate = new Date().toLocaleString();

        const billContent = `
            <html>
            <head>
                <title>Restaurant Bill</title>
                <style>
                    body { font-family: 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 20px; }
                    .bill-container { width: 300px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    h2 { text-align: center; margin-bottom: 5px; color: #333; }
                    hr { border: 1px dashed #ccc; margin: 15px 0; }
                    .details, .footer { text-align: left; font-size: 14px; line-height: 1.4; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; }
                    td, th { padding: 8px; font-size: 14px; }
                    th { color: #666; font-weight: 600; }
                    .total { font-weight: 600; font-size: 16px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; }
                    .grand-total { font-size: 18px; font-weight: 700; color: #333; }
                    .payment-method { background: #f8f9fa; padding: 8px; border-radius: 5px; text-align: center; margin: 10px 0; }
                </style>
            </head>
            <body onload="window.print(); window.onafterprint = window.close;">
                <div class="bill-container">
                    <h2>BUSINESS NAME</h2>
                    <p style="text-align:center; color: #666;">123 Main Street, Suite 567<br>City Name, State 54321<br>📞 123-456-7890</p>
                    <hr>
                    <div class="details">
                        ${tablenumber === 0 ? "<p><strong>Order Type: Parcel Order</strong></p>" : `<p><strong>Table Number:</strong> ${tablenumber}</p>`}
                        <p><strong>Date & Time:</strong> ${currentDate}</p>
                        <p><strong>Order ID: </strong>${orderid}</p>
                    </div>
                    <hr>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentOrder.itemsordered.map(item => `
                                <tr>
                                    <td>${item.item_name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <hr>
                    <p class="total">Subtotal: ₹${subtotal.toFixed(2)}</p>
                    ${discountAmount > 0 ? 
                        `<p class="total">Discount (${discount?.type === 'percent' ? discount.value + '%' : 'Flat'}): ₹${discountAmount.toFixed(2)}</p>` 
                        : ''}
                    <p class="total">GST (18%): ₹${GST.toFixed(2)}</p>
                    <p class="grand-total">TOTAL: ₹${totalAmount.toFixed(2)}</p>
                    <div class="payment-method">Paid By: ${method.toUpperCase()}</div>
                    <hr>
                    <p class="footer">THANK YOU FOR YOUR PURCHASE!</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open("", "", "width=400,height=600");
        printWindow!.document.write(billContent);
        printWindow!.document.close();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-[90%] h-[90%] bg-white font-normal flex flex-col relative shadow-2xl rounded-2xl p-6 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="font-bold text-xl text-gray-800 flex items-center">
                        <span className="bg-primary text-white px-3 py-1 rounded-lg mr-3">
                            {tableNumber === 0 ? "Parcel" : `Table #${tableNumber}`}
                        </span>
                        {booked && <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active Order</span>}
                    </div>
                    <button 
                        onClick={closeOrderScreen} 
                        className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-3 gap-6 h-[calc(100%-80px)] overflow-hidden">
                    {/* Left column: Menu search and tabs */}
                    <div className="flex flex-col col-span-2 gap-4 h-full overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b flex-shrink-0">
                            <button 
                                className={`flex items-center py-3 px-5 gap-2 font-medium border-b-2 transition-all ${
                                    activeTab === 'menu' 
                                        ? 'border-primary text-primary' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('menu')}
                            >
                                <FaSearch size={16} />
                                <span>Menu</span>
                            </button>
                            {booked && (
                                <button 
                                    className={`flex items-center py-3 px-5 gap-2 font-medium border-b-2 transition-all ${
                                        activeTab === 'order' 
                                            ? 'border-primary text-primary' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('order')}
                                >
                                    <FaReceipt size={16} />
                                    <span>Current Order</span>
                                </button>
                            )}
                        </div>

                        {/* Content based on active tab */}
                        <div className="flex-grow overflow-hidden">
                            {activeTab === 'menu' ? (
                                <div className="flex flex-col gap-4 h-full">
                                    <div className="flex-shrink-0">
                                        <MenuSearch 
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            isDropdownVisible={isDropdownVisible}
                                            filteredData={filteredData}
                                            handleItemSelect={handleItemSelect}
                                        />
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <SelectedItems 
                                            selectedItems={selectedItems}
                                            handleQuantityChange={handleQuantityChange}
                                            handleBlur={handleBlur}
                                            removeSelectedItem={removeSelectedItem}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <OrderedItems 
                                    tableNumber={tableNumber}
                                    orderedItem={orderedItem}
                                    removeOrderedItems={removeOrderedItems}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right column: Bill summary */}
                    <div className="h-full flex flex-col">
                        <div className="flex items-center mb-3 text-gray-800 flex-shrink-0">
                            <FaShoppingCart className="mr-2" />
                            <h2 className="font-medium text-lg">Order Summary</h2>
                        </div>
                        <div className="flex-grow">
                            <BillSummary 
                                subtotal={subtotal}
                                gst={gst}
                                totalAmount={totalAmount}
                                booked={booked}
                                handlePlaceOrder={placeOrder}
                                handleCompleteOrder={handleCompleteOrder}
                                tableNumber={tableNumber}
                            />
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <CompleteOrderModal 
                    isVisible={completeOrderPopup}
                    tableNumber={currentCompleteOrder.tablenumber}
                    orderId={currentCompleteOrder.orderid}
                    totalAmount={totalAmount}
                    closeModal={() => setCompleteOrderPopup(false)}
                    completeOrder={completeOrder}
                />

                <ConfirmationModal 
                    isVisible={modal.visible}
                    message={modal.message}
                    success={modal.success}
                    closeModal={() => setModal({ ...modal, visible: false })}
                />
            </div>
        </div>
    );
};

export default OrderScreen;
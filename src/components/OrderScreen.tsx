import axios from "axios";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";
import { billingAmount, OrderedItems, Table } from "./AdminDashboard";

interface OrderScreenProps {
    tableNumber: number;
    tabledata: Table[];
    orderedItem: { orderid: number; billing: billingAmount; tablenumber: number; itemsordered: OrderedItems[] }[];
    setorderitemsfun: (bookedItems: { orderid: number; billing: billingAmount; tablenumber: number; itemsordered: OrderedItems[]; }) => void;
    closeOrderScreen: () => void;
}

interface MenuData {
    item_id: string;
    item_description: string;
    item_name: string;
    item_foodtype: string;
    item_price: number;
    item_thumbnail?: string;
    item_type: string;
}

const OrderScreen: React.FC<OrderScreenProps> = ({ tableNumber, orderedItem, setorderitemsfun, tabledata, closeOrderScreen }) => {
    const [menuData, setMenuData] = useState<MenuData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<{ item: MenuData; quantity: number }[]>([]);
    const [modal, setModal] = useState<{ visible: boolean; message: string; success: boolean }>({ visible: false, message: "", success: false });
    const [booked, setBooked] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchMenuData();
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    useEffect(() => {
        const table = tabledata.find((t) => t.availability === 1 && t.tablenumber === tableNumber);
        if (table) setBooked(true);
    }, [tabledata, tableNumber]);



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
            alert("Please add items to place an order!");
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
            const response = booked ? await axios.post(`/api/order/placeOrder/${orderedItem.find(table => table.tablenumber === tableNumber)?.orderid}`, orderData) : await axios.post('/api/order/placeOrder', orderData);
            if (response.data.success) {
                const bookedItems = selectedItems.map(({ item, quantity }) => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity,
                    price: item.item_price,
                }));

                setorderitemsfun({ orderid: response.data.orderId, billing:{subtotal:subtotal}, tablenumber: tableNumber, itemsordered: bookedItems });
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
            alert("Failed to place order, please try again!");
        }
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setIsDropdownVisible(value.length > 0);
    };

    const filteredData = useMemo(() => {
        return menuData.filter(item =>
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, menuData]);


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
    const currentOrder = orderedItem.length > 0 ? orderedItem.find(table => table.tablenumber === tableNumber) : null;

    const presubtotal = currentOrder?.billing?.subtotal ?? 0;
    const newSubtotal = selectedItems.reduce((total, entry) => total + (entry.item.item_price * entry.quantity), 0);

    const subtotal = presubtotal + newSubtotal;
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
            <div className="w-[90%] h-[90%] bg-white font-semibold flex flex-col gap-3 relative shadow-lg rounded-2xl p-5">
                <div className="flex justify-between shadow-md rounded-lg p-[2vh]">
                    <div className="font-bold text-[15px]">Order for Table #{tableNumber}</div>
                    <button onClick={closeOrderScreen} className="text-[15px] font-extrabold">
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 h-full ">
                    <div className="flex flex-col col-span-2 gap-3 relative">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Menu..."
                                className="w-full py-2 px-2 h-10 border-[2px] rounded-md outline-none border-gray-300"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {isDropdownVisible && filteredData.length > 0 && (
                                <ul className="border-2 border-gray-300 bg-white z-10 max-h-60 overflow-y-auto absolute left-0 top-full w-full">
                                    {filteredData.map((item, index) => (
                                        <li
                                            key={index}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-200 flex justify-between"
                                            onClick={() => handleItemSelect(item)}
                                        >
                                            <span>{item.item_name}</span>
                                            <span className="text-gray-500 text-sm">₹{item.item_price}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg shadow-md max-h-[40vh] ">
                            <h3 className="font-bold text-lg mb-2">Selected Items</h3>
                            {selectedItems.length === 0 ? (
                                <p className="text-gray-500 text-sm">No items added yet.</p>
                            ) : (
                                <ul className="space-y-2 overflow-y-auto max-h-[33vh]">
                                    {selectedItems.map(({ item, quantity }) => (
                                        <li key={item.item_id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                            <span>{item.item_name} - ₹{item.item_price} ×
                                                <input
                                                    type="text"
                                                    value={quantity === 0 ? "" : quantity.toString()}
                                                    onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                                                    onBlur={() => handleBlur(item.item_id, quantity)}
                                                    className="w-10 border text-center"
                                                />


                                            </span>
                                            <button onClick={() => removeSelectedItem(item.item_id)} className="text-red-500 hover:text-red-700">
                                                <IoClose size={20} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {booked && (
                            <div className="absolute bottom-0 w-full left-0 bg-gray-100 p-3 rounded-lg shadow-md h-[30vh] overflow-y-auto">
                                <h3 className="font-bold text-lg mb-2">Ordered Items</h3>
                                <ul className="space-y-2 overflow-y-auto max-h-[33vh]">
                                    {orderedItem
                                        .filter(table => table.tablenumber === tableNumber)
                                        .flatMap(table => table.itemsordered)
                                        .map((item) => (
                                            <li key={item.item_id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                                <span>
                                                    {item.item_name} - ₹{item.price} ×
                                                    <input
                                                        type="text"
                                                        disabled
                                                        value={item.quantity === 0 ? "" : item.quantity.toString()}
                                                        onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                                                        onBlur={() => handleBlur(item.item_id, item.quantity)}
                                                        className="w-10 border text-center"
                                                    />
                                                </span>
                                            </li>
                                        ))}

                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="border border-gray-300 p-5 rounded-lg shadow-md col-span-1 relative">
                        <h3 className="font-bold text-lg mb-2">Bill Summary</h3>
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (18%):</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <hr className="my-2 border-t-2 border-gray-300" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <button
                                onClick={placeOrder}
                                className="w-[100%] bg-primary text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-primaryhover"
                            >
                                {!booked ? " Place Order" : "Update Order"}
                            </button>
                        </div>
                    </div>
                </div>
                {modal.visible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white p-6 w-[40%] max-w-md rounded-xl shadow-2xl text-center animate-fadeIn scale-105">
                            <div className={`flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full ${modal.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                {modal.success ? <IoCheckmarkCircle size={32} /> : <IoCloseCircle size={32} />}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">{modal.message}</h3>
                            <button
                                onClick={() => setModal({ ...modal, visible: false })}
                                className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all">
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderScreen;

"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Bars } from "react-loader-spinner";

// Define the type for inventory items
interface InventoryItem {
  item_id: string;
  item_name: string;
  current_stock: number;
  low_limit: number;
  unit: string;
}

const InventoryCard: React.FC = () => {
  const [formValues, setFormValues] = useState({
    item_name: "",
    current_stock: "",
    low_limit: "",
    unit: "",
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState<InventoryItem | null>(null);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [addInventoryPopupVisible, setAddInventoryPopupVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteItemBoxValue, setDeleteItemBoxValue] = useState("");


  useEffect(() => {
    document.title = "Inventory";
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(
    (item) =>
      item.item_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/inventory");
      const data = response.data;
      if (data && Array.isArray(data.users)) {
        setInventory(data.users);
      } else {
        console.error("Fetched data does not contain an array of users:", data);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (data: InventoryItem) => {
    setEditData(data);
    setEditPopupVisible(true);
  };

  const handleDeleteClick = (item_id: string, item_name: string) => {
    // You can use item_id here if needed
    setDeletePopupVisible(true);
    setDeleteItemId(item_id);
    setDeleteItemName(item_name);
  };

  const handleEditInventory = async (data: InventoryItem) => {
    try {
      setEditLoading(true);
      await axios.put("/api/inventory/updateInventory", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchInventory();
      setEditPopupVisible(false);
    } catch (error) {
      console.error("Error updating inventory item:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteInventory = async (deleteItemId: string) => {
    try {
      setDeleteLoading(true);
      await axios.delete("/api/inventory/delete", { data: { item_id: deleteItemId } });
      fetchInventory();
      setDeletePopupVisible(false);
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteItemBoxValue("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = {
      item_name: formValues.item_name,
      current_stock: Number(formValues.current_stock),
      low_limit: Number(formValues.low_limit),
      unit: formValues.unit,
    };
    setAddLoading(true);

    console.log("Form Data:", formData);
    try {
      await axios.post("/api/inventory/register", formData);
      setAddInventoryPopupVisible(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adding inventory item:", error);
    } finally {
      setFormValues({
        item_name: "",
        current_stock: "",
        low_limit: "",
        unit: "",
      });

      setAddLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Bars height="50" width="50" color="#25476A" ariaLabel="bars-loading" visible={true} />
        </div>
      ) : (
        <>
          {/* Search Input */}
          <section className="flex gap-4 items-center justify-between">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all w-[280px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setAddInventoryPopupVisible(true)}
              className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Item
            </button>
          </section>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="table-fixed w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white font-light">
                  <th className="px-4 py-3 text-left w-[15%]">ID</th>
                  <th className="px-4 py-3 text-left w-[25%]">Item</th>
                  <th className="px-4 py-3 text-left w-[20%]">Current Quantity</th>
                  <th className="px-4 py-3 text-left w-[20%]">Low Limit</th>
                  <th className="px-4 py-3 text-left w-[20%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => (
                  <tr key={index} className="text-[14px] font-medium font-montserrat hover:bg-gray-50 transition-colors duration-200">
                    <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.item_id}</td>
                    <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.item_name}</td>
                    <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                      <div className="flex items-center">
                        <span className={`${item.current_stock < item.low_limit ? 'text-red-500 font-semibold' : ''}`}>
                          {item.current_stock} {item.unit}
                        </span>
                        {item.current_stock < item.low_limit && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium ml-2 px-2 py-0.5 rounded-full">Low Stock</span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.low_limit} {item.unit}</td>
                    <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-primary hover:bg-[#30557b] text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors duration-200"
                          onClick={() => handleEditClick(item)}
                        >
                          <div>Edit</div> <FaPenToSquare />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors duration-200"
                          onClick={() => handleDeleteClick(item.item_id, item.item_name)}>
                          <div>Delete</div> <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add New Item Popup */}
      {addInventoryPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md relative animate-fadeIn">
            {addLoading && (
              <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                <Bars height="60" width="60" color="#25476A" ariaLabel="loading" visible={true} />
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9FCC2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Inventory Item
              </h2>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setAddInventoryPopupVisible(false)}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Name</label>
                <input
                  required
                  type="text"
                  placeholder="Enter item name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={formValues.item_name}
                  onChange={(e) => setFormValues({ ...formValues, item_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Quantity</label>
                <input
                  required
                  type="number"
                  placeholder="Enter current quantity"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={formValues.current_stock}
                  onChange={(e) => setFormValues({ ...formValues, current_stock: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Low Limit</label>
                <input
                  required
                  type="number"
                  placeholder="Enter low stock threshold"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={formValues.low_limit}
                  onChange={(e) => setFormValues({ ...formValues, low_limit: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                  value={formValues.unit}
                  onChange={(e) => setFormValues({ ...formValues, unit: e.target.value })}
                >
                  <option value="" disabled>--Select Unit--</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="ml">ml</option>
                  <option value="litre">Litre</option>
                  <option value="pieces">Pieces</option>
                  <option value="packets">Packets</option>
                  <option value="bottles">Bottles</option>
                  <option value="boxes">Boxes</option>
                  <option value="dozens">Dozens</option>
                </select>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-200 mt-4">
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setAddInventoryPopupVisible(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formValues.item_name || !formValues.unit || addLoading}
                  >
                    {addLoading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editPopupVisible && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md relative animate-fadeIn">
            {editLoading && (
              <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                <Bars height="60" width="60" color="#25476A" ariaLabel="loading" visible={true} />
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <FaPenToSquare className="text-primary" size={20} />
                Edit Inventory Item
              </h2>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setEditPopupVisible(false)}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Name</label>
                <input
                  required
                  value={editData.item_name}
                  onChange={(e) => setEditData((prev) => prev ? { ...prev, item_name: e.target.value } : null)}
                  type="text"
                  placeholder="Enter item name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Quantity</label>
                <input
                  required
                  value={editData.current_stock}
                  onChange={(e) => setEditData((prev) => prev ? { ...prev, current_stock: Number(e.target.value) } : null)}
                  type="number"
                  placeholder="Enter current quantity"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Low Limit</label>
                <input
                  required
                  value={editData.low_limit}
                  onChange={(e) => setEditData((prev) => prev ? { ...prev, low_limit: Number(e.target.value) } : null)}
                  type="number"
                  placeholder="Enter low stock threshold"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <select
                  required
                  value={editData.unit}
                  onChange={(e) => setEditData((prev) => prev ? { ...prev, unit: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                >
                  <option value="" disabled>--Select Unit--</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="ml">ml</option>
                  <option value="litre">Litre</option>
                  <option value="pieces">Pieces</option>
                  <option value="packets">Packets</option>
                  <option value="bottles">Bottles</option>
                  <option value="boxes">Boxes</option>
                  <option value="dozens">Dozens</option>
                </select>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-200 mt-4">
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setEditPopupVisible(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleEditInventory(editData)}
                    disabled={!editData.item_name || !editData.unit}
                  >
                    Update Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
            {deleteLoading && (
              <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                <Bars
                  height="60"
                  width="60"
                  color="#25476A"
                  ariaLabel="deleting"
                  visible={true}
                />
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Item</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold text-primary">{deleteItemName}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type &quot;{deleteItemName}&quot; to confirm
              </label>
              <input
                type="text"
                placeholder={`Type ${deleteItemName}`}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                value={deleteItemBoxValue}
                onChange={(e) => setDeleteItemBoxValue(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                onClick={() => {setDeletePopupVisible(false); setDeleteItemBoxValue("");}}
              >
                Cancel
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDeleteInventory(deleteItemId)}
                disabled={deleteItemBoxValue !== deleteItemName || deleteLoading}
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryCard;

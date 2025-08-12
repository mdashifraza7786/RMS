"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { FaTrash, FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
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
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <button
          onClick={() => setAddInventoryPopupVisible(true)}
          className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5"
        >
          <FaPlus size={16} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.item_id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.current_stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.low_limit} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.current_stock < item.low_limit
                          ? 'bg-red-100 text-red-800'
                          : item.current_stock < item.low_limit * 1.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.current_stock < item.low_limit
                          ? 'Low Stock'
                          : item.current_stock < item.low_limit * 1.5
                          ? 'Warning'
                          : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaPenToSquare className="mr-1.5" size={12} />
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                          onClick={() => handleDeleteClick(item.item_id, item.item_name)}
                        >
                          <FaTrash className="mr-1.5" size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        className="w-16 h-16 mb-4 text-gray-300"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="1" 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-lg font-medium">No inventory items found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or adding a new item.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden px-4">
            {filteredInventory.length > 0 ? (
              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <div key={item.item_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-3 flex justify-between items-center">
                      <div className="font-medium text-gray-800">{item.item_name}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.current_stock < item.low_limit
                          ? 'bg-red-100 text-red-800'
                          : item.current_stock < item.low_limit * 1.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.current_stock < item.low_limit
                          ? 'Low Stock'
                          : item.current_stock < item.low_limit * 1.5
                          ? 'Warning'
                          : 'In Stock'}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">ID</span>
                        <span className="text-sm font-medium">{item.item_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Current Stock</span>
                        <span className="text-sm">{item.current_stock} {item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Low Limit</span>
                        <span className="text-sm">{item.low_limit} {item.unit}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end space-x-2">
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaPenToSquare className="mr-1.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                        onClick={() => handleDeleteClick(item.item_id, item.item_name)}
                      >
                        <FaTrash className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">No inventory items found</p>
                  <p className="mt-1 text-sm">Try adding new items or adjusting your search.</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Inventory Popup */}
      {addInventoryPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-xl p-8 w-[90%] max-w-[600px] relative animate-fadeIn">
            {addLoading && (
              <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                <Bars
                  height="80"
                  width="80"
                  color="#1e4569"
                  ariaLabel="bars-loading"
                  visible={true}
                />
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
              <h1 className="text-2xl font-bold text-[#1e4569] flex items-center gap-2">
                <FaPlus className="text-[#1e4569]" size={24} />
                Add New Inventory Item
              </h1>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setAddInventoryPopupVisible(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Item Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                    type="text"
                    value={formValues.item_name}
                    onChange={(e) => setFormValues({ ...formValues, item_name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Current Stock
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                      type="number"
                      value={formValues.current_stock}
                      onChange={(e) => setFormValues({ ...formValues, current_stock: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Low Limit
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                      type="number"
                      value={formValues.low_limit}
                      onChange={(e) => setFormValues({ ...formValues, low_limit: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all bg-white"
                    value={formValues.unit}
                    onChange={(e) => setFormValues({ ...formValues, unit: e.target.value })}
                    required
                  >
                    <option value="" className="font-semibold">--SELECT UNIT--</option>
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
              </div>
              
              <div className="flex justify-end pt-3 border-t border-gray-200 mt-6">
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
                    className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                    disabled={!formValues.item_name || !formValues.unit}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inventory Popup */}
      {editPopupVisible && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white shadow-2xl rounded-xl p-8 w-[90%] max-w-[600px] relative animate-fadeIn">
            {editLoading && (
              <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                <Bars
                  height="80"
                  width="80"
                  color="#1e4569"
                  ariaLabel="bars-loading"
                  visible={true}
                />
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
              <h1 className="text-2xl font-bold text-[#1e4569] flex items-center gap-2">
                <FaPenToSquare className="text-[#1e4569]" size={24} />
                Edit Inventory Item
              </h1>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setEditPopupVisible(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); handleEditInventory(editData); }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Item Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                    type="text"
                    value={editData.item_name}
                    onChange={(e) => setEditData({ ...editData, item_name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Current Stock
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                      type="number"
                      value={editData.current_stock}
                      onChange={(e) => setEditData({ ...editData, current_stock: Number(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Low Limit
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                      type="number"
                      value={editData.low_limit}
                      onChange={(e) => setEditData({ ...editData, low_limit: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all bg-white"
                    value={editData.unit}
                    onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                    required
                  >
                    <option value="" className="font-semibold">--SELECT UNIT--</option>
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
              </div>
              
              <div className="flex justify-end pt-3 border-t border-gray-200 mt-6">
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setEditPopupVisible(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                    disabled={!editData.item_name || !editData.unit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
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
                  color="#1e4569"
                  ariaLabel="bars-loading"
                  visible={true}
                />
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Inventory Item</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold text-[#1e4569]">{deleteItemName}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold">delete</span> to confirm
              </label>
              <input
                type="text"
                placeholder="delete"
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
                disabled={deleteItemBoxValue !== "delete"}
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

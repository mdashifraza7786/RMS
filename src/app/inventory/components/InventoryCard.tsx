"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
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
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
            <input
              type="search"
              placeholder="Search Name, ID..."
              className="border w-1/4 border-[#807c7c] rounded-xl px-4 py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setAddInventoryPopupVisible(true)}
              className="bg-supporting2 hover:bg-[#badb69] w-1/5 text-white font-bold rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-supporting2-dark transition-colors mt-4"
            >
              Add New Item
            </button>
          </section>

          {/* Inventory Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-2 text-left w-[200px]">ID</th>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Current Quantity</th>
                <th className="px-4 py-2 text-left">Low Limit</th>
                <th className="px-4 py-2 text-left w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr key={index} className="text-[14px] font-medium font-montserrat">
                  <td className="border px-4 py-2">{item.item_id}</td>
                  <td className="border px-4 py-2">{item.item_name}</td>
                  <td className="border px-4 py-2">{item.current_stock} {item.unit}</td>
                  <td className="border px-4 py-2">{item.low_limit} {item.unit}</td>
                  <td className="border px-4 py-4">
                    <div className="flex gap-4 justify-center">
                      <button
                        className="bg-primary hover:bg-[#416f9d] text-white px-6 py-2 rounded text-[12px] flex items-center gap-2"
                        onClick={() => handleEditClick(item)}
                      >
                        <div>Edit</div> <FaPenToSquare />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded text-[12px] flex items-center gap-2"
                        onClick={() => handleDeleteClick(item.item_id, item.item_name)}>
                        <div>Delete</div> <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Add Inventory Popup */}
      {addInventoryPopupVisible && (

        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 max-w-full">
            <h2 className="text-xl font-bold text-primary text-center mb-4">Add New Item</h2>
            {addLoading ? (
              <div className="flex justify-center items-center py-4">
                <Bars height="50" width="50" color="#25476A" ariaLabel="bars-loading" visible={true} />
              </div>
            ) :
              (<div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium text-gray-700">Item Name</label>
                  <input
                    required
                    value={formValues.item_name}
                    onChange={(e) => setFormValues({ ...formValues, item_name: e.target.value })}
                    type="text"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Current Quantity</label>
                  <input
                    required
                    value={formValues.current_stock}
                    onChange={(e) => setFormValues({ ...formValues, current_stock: e.target.value })}
                    type="number"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Low Limit</label>
                  <input
                    required
                    value={formValues.low_limit}
                    onChange={(e) => setFormValues({ ...formValues, low_limit: e.target.value })}
                    type="number"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Unit</label>
                  <select
                    required
                    value={formValues.unit}
                    onChange={(e) => setFormValues({ ...formValues, unit: e.target.value })}
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => setAddInventoryPopupVisible(false)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  {formValues.item_name !== "" && formValues.unit !== "" ? (
                    <button
                      onClick={handleSubmit}
                      className="bg-supporting2 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                    >
                      Add Now
                    </button>
                  )
                    : (
                      <button
                        disabled
                        className="bg-green-300 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                      >
                        Add Now
                      </button>
                    )}
                </div>
              </div>)}
          </div>
        </div>

      )}

      {/* edit inventory Popup */}
      {editPopupVisible && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 max-w-full">
            <h2 className="text-xl font-bold text-primary text-center mb-4">Update Item</h2>

            {editLoading ? (
              <div className="flex justify-center items-center py-4">
                <Bars height="50" width="50" color="#25476A" ariaLabel="bars-loading" visible={true} />
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium text-gray-700">Item Name</label>
                  <input
                    required
                    value={editData.item_name}
                    onChange={(e) => setEditData((prev) => prev ? { ...prev, item_name: e.target.value } : null)}
                    type="text"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Current Quantity</label>
                  <input
                    required
                    value={editData.current_stock}
                    onChange={(e) => setEditData((prev) => prev ? { ...prev, current_stock: Number(e.target.value) } : null)}
                    type="number"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Low Limit</label>
                  <input
                    required
                    value={editData.low_limit}
                    onChange={(e) => setEditData((prev) => prev ? { ...prev, low_limit: Number(e.target.value) } : null)}
                    type="number"
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <label className="font-medium text-gray-700">Unit</label>
                  <select
                    required
                    value={editData.unit}
                    onChange={(e) => setEditData((prev) => prev ? { ...prev, unit: e.target.value } : null)}
                    className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => setEditPopupVisible(false)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  {editData.item_name !== "" && editData.unit !== "" ? (
                    <button
                      onClick={() => handleEditInventory(editData)}
                      className="bg-supporting2 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-green-300 text-white px-5 py-2 rounded-lg hover:bg-opacity-80"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-96 max-w-full">
            <h2 className="text-xl font-bold text-red-600 text-center mb-3">Delete Item</h2>
            <p className="text-gray-700 text-center mb-4">
              Are you sure you want to delete this item? Type the item name ({deleteItemName}) to confirm.
            </p>

            <input
              required
              type="text"
              placeholder="Type the item name"
              className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-100 focus:outline-none"
              value={deleteItemBoxValue}
              onChange={(e) => setDeleteItemBoxValue(e.target.value)}
            />

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {setDeletePopupVisible(false); setDeleteItemBoxValue("");}}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              {deleteItemName === deleteItemBoxValue ? (

                <button
                  onClick={() => handleDeleteInventory(deleteItemId)}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              ) : (
                <button
                  disabled
                  className="bg-red-300 text-white px-5 py-2 rounded-lg hover:bg-red-400 transition-all"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryCard;

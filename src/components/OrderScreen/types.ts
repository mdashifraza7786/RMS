import { Table, OrderedItems, billingAmount } from "../Dashboard";

export interface MenuData {
    item_id: string;
    item_description: string;
    item_name: string;
    item_foodtype: string;
    item_price: number;
    item_thumbnail?: string;
    item_type: string;
}

export interface OrderScreenProps {
    role?: string | undefined;
    userid?: string | undefined;
    tableNumber: number;
    tabledata: Table[];
    orderedItem: { 
        orderid: number; 
        billing: billingAmount; 
        tablenumber: number; 
        itemsordered: OrderedItems[] 
    }[];
    setorderitemsfun: (bookedItems: { 
        orderid: number; 
        billing: billingAmount; 
        tablenumber: number; 
        itemsordered: OrderedItems[]; 
    }) => void;
    removeOrderedItems: (itemId: string, tableNumber: number, orderID: number) => void;
    resettable: (tablenumber: any) => void;
    closeOrderScreen: () => void;
    updateItemStatus?: (orderId: number, itemId: string, status: string) => void;
}

export interface MenuSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    isDropdownVisible: boolean;
    filteredData: MenuData[];
    handleItemSelect: (selectedItem: MenuData) => void;
}

export interface SelectedItemsProps {
    selectedItems: { item: MenuData; quantity: number }[];
    handleQuantityChange: (itemId: string, newQuantity: string) => void;
    handleBlur: (itemId: string, quantity: number) => void;
    removeSelectedItem: (itemId: string) => void;
}

export interface OrderedItemsProps {
    tableNumber: number;
    orderedItem: OrderScreenProps['orderedItem'];
    removeOrderedItems: (itemId: string, tableNumber: number, orderID: number) => void;
    onUpdateItemStatus?: (orderId: number, itemId: string, status: string) => void;
}

export interface BillSummaryProps {
    subtotal: number;
    gst: number;
    totalAmount: number;
    booked: boolean;
    handlePlaceOrder: () => void;
    handleCompleteOrder: () => void;
    tableNumber: number;
    items?: { item_id?: string; item_name: string; quantity: number; price: number }[];
}

export interface CompleteOrderModalProps {
    isVisible: boolean;
    tableNumber: number;
    orderId: number;
    totalAmount: number;
    closeModal: () => void;
    completeOrder: (
        tablenumber: number, 
        orderid: number, 
        method: string, 
        discount?: { value: number, type: string }
    ) => void;
}

export interface ConfirmationModalProps {
    isVisible: boolean;
    message: string;
    success: boolean;
    closeModal: () => void;
}

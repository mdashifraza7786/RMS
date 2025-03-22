import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { ConfirmationModalProps } from "./types";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    message,
    success,
    closeModal
}) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
            <div className="bg-white p-8 w-full max-w-md rounded-xl shadow-2xl text-center animate-fadeIn scale-105 transform transition-all">
                <div className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full ${
                    success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                    {success ? <IoCheckmarkCircle size={40} /> : <IoCloseCircle size={40} />}
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 ${success ? "text-green-700" : "text-red-700"}`}>
                    {success ? "Success!" : "Error!"}
                </h3>
                
                <p className="text-gray-600 mb-6">{message}</p>
                
                <button
                    onClick={closeModal}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                        success 
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg" 
                            : "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                    }`}
                >
                    {success ? "Continue" : "Try Again"}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;

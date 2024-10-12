import { useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Delete() {
  const { id } = useParams<{ id: string }>(); // للحصول على id من ال URL
  const [itemDeleted, setItemDeleted] = useState<boolean>(false); // حالة للتحكم في ظهور العنصر المحذوف
  const navigate = useNavigate();

  // Handle delete action
  const handleDelete = async () => {
    const token = localStorage.getItem("token"); // Get token from local storage

    try {
      await axios.delete(`https://test1.focal-x.com/api/items/${id}`, {
        headers: {
          Authorization: token, // Send token for authorization
        },
      });

      setItemDeleted(true); // قم بتحديث الحالة لإزالة العنصر
      // يمكنك الانتقال بعد الحذف، إذا أردت:
      // navigate("/showall");
    } catch (error: any) {
      // يمكنك الاحتفاظ برسالة الخطأ في حال رغبتك بالتحقق منها دون عرضها
      console.error("Error deleting item: " + error.response?.data?.message || error.message);
    }
  };

  // Cancel deletion and navigate away
  const handleCancel = () => {
    navigate("/showall"); // Redirect back if user cancels
  };

  // إذا تم حذف العنصر، يمكنك إخفاء المحتوى
  if (itemDeleted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-green-500 text-sm"></p>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-28 h-screen w-screen flex items-center justify-center"> 
      {/* تأكيد الحذف */}
      <div className="pt-20 h-80 w-deleteW border rounded-lg shadow-lg text-center bg-white ">
        <p className="text-xl font-semibold">Are you sure you want to delete the product?</p>
        <div className="pt-20 flex gap-48 justify-center">
          <button
            onClick={handleDelete}
            className="w-12.4375 h-3.812 font-medium text-2xl bg-my-yello text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="w-12.4375 h-3.812 font-medium text-2xl bg-my-yello text-white rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
      
      <Outlet />
    </div>
  );
}

export default Delete;

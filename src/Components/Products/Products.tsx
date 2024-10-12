import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface Item {
  id: number;
  name: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

function Products() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // To track the current page
  const [itemsPerPage] = useState<number>(8); // Number of items to show per page
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      axios
        .get("https://test1.focal-x.com/api/items", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setItems(response.data);
          setFilteredItems(response.data);
        })
        .catch((error) => {
          setError("Error fetching items: " + error.message);
        });
    }
  }, [navigate]);

  // Handle search filtering
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle navigation for edit and delete
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation(); // Prevent the click from navigating to the item page
    navigate(`/edit/${id}`);
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation(); // Prevent the click from navigating to the item page
    navigate(`/showall/delete/${id}`);
  };

  // Logic for displaying the items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Total pages for pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      {error && <p className="text-red-500">{error}</p>}

      <div className="h-4.4 w-56.75 mt-6 flex">
        <input
          type="text"
          placeholder="Search product by name"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 h-full w-full border border-gray-300 rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal focus:border-yellow-500 transition duration-300"
        />
      </div>

      <div className="w-81.367 h-4.89 flex justify-end justify-items-center mb-8 mt-12">
        <button
          onClick={() => navigate("/addnew")}
          className="h-full w-199 text-sm font-medium lg:font-normal lg:text-xs flex justify-center items-center text-white bg-my-yello rounded"
        >
          ADD NEW PRODUCT
        </button>
      </div>

      <div className="w-81.367 h-50.667 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/showitem/${item.id}`)} // Navigate on div click
              className="relative flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden group transition-all duration-300 cursor-pointer" // Add cursor-pointer for better UX
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full p-4 object-scale-down rounded-2xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-my-ofWhite bg-opacity-50">
                <h3 className="font-medium text-3xl lg:text-xl text-center mb-2">
                  {item.name}
                </h3>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={(event) => handleEdit(event, item.id)} // Pass the event
                    className="mb-2 flex flex-row items-center gap-3 text-white bg-my-yello h-10 w-20 rounded justify-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(event) => handleDelete(event, item.id)}
                    className="mb-2 flex flex-row items-center gap-3 bg-red-600 text-white h-10 w-20 rounded justify-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">
            No items found.
          </p>
        )}
      </div>

      <div className="flex h-6.667 w-450">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="text-xs w-16 h-16 flex justify-center items-center border-solid border-2 border-gray-200 mx-1 rounded-full"
        >
          <GrFormPrevious />
        </button>

        {/* Display the first three pages */}
        {Array.from({ length: 3 }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`font-Open-Sans text-xs w-16 h-16 border-solid border-2 border-gray-200 rounded-[50%] mx-1 ${
              currentPage === index + 1 ? "bg-my-yello text-white border-my-yello" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Ellipsis for the middle pages */}
        <span className="w-13.3 h-16 flex items-center justify-center">
          ...
        </span>
        {currentPage > 3 && currentPage < totalPages &&  (
          <button
          onClick={() => handlePageChange(currentPage)}
          className={`font-Open-Sans text-xs w-16 h-16 border-solid border-2 border-gray-200 rounded-[50%] mx-1 ${
            currentPage ? "bg-my-yello text-white border-my-yello" : ""
          }`}
          >
          {currentPage}
          </button>
        )}

        {/* Last page (dynamic based on totalPages) */}
        {totalPages > 5 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`text-xs font-Open-Sans w-16 h-16 border-solid border-2 border-gray-200 rounded-[50%] mx-1 ${
              currentPage === totalPages ? "bg-my-yello text-white border-my-yello " : ""
            }`}
          >
            {totalPages}
          </button>
        )}
      
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="text-xs font-Open-Sans w-16 h-16 flex justify-center items-center mx-1 border-solid border-2 border-gray-200 rounded-[50%]"
        >
          <GrFormNext />
        </button>
      </div>
      <Outlet />
    </div>
  );
}

export default Products;

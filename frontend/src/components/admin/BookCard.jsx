import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

const BookCard = ({ book, onEdit, onDelete, onDetails }) => {
  const {
    Title,
    Author,
    TotalCopies,
    AvailableCopies,
    Image,
  } = book;

  // Badge color based on available copies
  const badgeColor =
    AvailableCopies === 0
      ? "bg-red-500"
      : AvailableCopies < 5
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl hover:shadow-blue-300 hover:-translate-y-1 transition-transform duration-300 w-80 overflow-hidden transform hover:scale-[1.02] hover:rotate-[0.5deg]">
      {/* Badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColor}`}>
        {AvailableCopies} Available
      </div>

      {/* Book image */}
      <img
        src={Image}
        alt={Title}
        className="h-48 w-full object-cover border-b border-gray-200"
      />

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{Title}</h3>
        <p className="text-sm text-gray-600 mb-1">Author: {Author}</p>
        <p className="text-sm text-gray-600 mb-3">Total Copies: {TotalCopies}</p>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
          >
            <FaTrash /> Delete
          </button>
          <button
            onClick={onDetails}
            className="flex items-center gap-1 text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg shadow"
          >
            <FaInfoCircle /> Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

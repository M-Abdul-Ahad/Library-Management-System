import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

const MemberCard = ({ member, onEdit, onDelete, onDetails }) => {
  const { name, email, isActive, avatar } = member;

  return (
    <div className="bg-white rounded-2xl shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-transform duration-300 w-80 overflow-hidden transform hover:scale-[1.02] hover:rotate-[0.5deg]">
      {/* Avatar */}
      <div className="flex justify-center pt-6">
        <img
          src={avatar || "/default-avatar.png"}
          alt={name}
          className="w-24 h-24 object-cover rounded-full border-4 border-indigo-500 shadow"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-1">{email}</p>
        <p
          className={`text-sm font-medium ${
            isActive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </p>

        {/* Buttons */}
        <div className="flex justify-between mt-5">
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

export default MemberCard;

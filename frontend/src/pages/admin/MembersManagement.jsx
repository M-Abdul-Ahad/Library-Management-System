import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import MemberCard from '../../components/admin/MemberCard';
import { FaPlus } from 'react-icons/fa';

// Mock members
const mockMembers = Array.from({ length: 124 }).map((_, i) => ({
  id: i + 1,
  name: `Member ${i + 1}`,
  email: `member${i + 1}@library.com`,
  isActive: Math.random() > 0.3
}));

const MemberManagement = () => {
  const [members, setMembers] = useState(mockMembers);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 12;

  const handleSearch = () => {
    const filtered = mockMembers.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );
    setMembers(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setMembers(mockMembers);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = members.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(members.length / membersPerPage);

  const changePage = (dir) => {
    setCurrentPage(prev => Math.max(1, Math.min(prev + dir, totalPages)));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Members Management</h1>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by member name"
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Add Member */}
        <div className="flex justify-end mb-4">
          <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow">
            <FaPlus /> Add New Member
          </button>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-10">
          {currentMembers.map(member => (
            <div key={member.id} className="mb-10">
              <MemberCard
                member={member}
                onEdit={() => console.log('Edit', member.id)}
                onDelete={() => console.log('Delete', member.id)}
                onDetails={() => console.log('Details', member.id)}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span>
            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, members.length)} of {members.length} members
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => changePage(-1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;

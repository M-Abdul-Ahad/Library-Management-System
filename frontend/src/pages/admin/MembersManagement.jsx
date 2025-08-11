import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminHeader from '../../components/admin/AdminHeader';
import MemberCard from '../../components/admin/MemberCard';
import AddMemberModal from '../../components/admin/AddMemberModal';
import MemberDetailsModal from '../../components/admin/MemberDetailsModal';

import { FaPlus } from 'react-icons/fa';
import {
  fetchMembers,
  addMember,
  updateMember,
  deleteMember,
} from '../../store/admin/memberSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MemberManagement = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector(
    (state) => state.members
  );

  const [search, setSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 12;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Local state for details modal
  const [detailsMember, setDetailsMember] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredMembers(
      members.filter((m) =>
        m.MemberName.toLowerCase().includes(search.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [search, members]);

  const handleReset = () => {
    setSearch('');
    setFilteredMembers(members);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const changePage = (dir) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + dir, totalPages)));
  };

  const handleDelete = async (memberId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This member will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#f0f6ff',
      color: '#1e293b',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteMember(memberId));
        toast.success('Member deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete member!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Members Management</h1>

        {/* Search */}
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
              onClick={() => {}}
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

        {/* Add Member Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingMember(null);
              setIsEditMode(false);
            }}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow"
          >
            <FaPlus /> Add New Member
          </button>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-10">
          {loading ? (
            <p className="text-blue-700">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : currentMembers.length === 0 ? (
            <p>No members found.</p>
          ) : (
            currentMembers.map((member) => (
              <div key={member.MemberID} className="mb-10">
                <MemberCard
                  member={member}
                  onEdit={() => {
                    setEditingMember(member);
                    setIsEditMode(true);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => handleDelete(member.MemberID)}
                  onDetails={() => {
                    setDetailsMember(member);
                    setIsDetailsOpen(true);
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        <AddMemberModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
            setIsEditMode(false);
          }}
          initialData={editingMember}
          isEdit={isEditMode}
          onSubmit={async (data) => {
            try {
              if (isEditMode && editingMember?.MemberID) {
                const resultAction = await dispatch(
                  updateMember({
                    id: editingMember.MemberID,
                    updatedData: data,
                  })
                );
                if (updateMember.fulfilled.match(resultAction)) {
                  toast.success('Member updated successfully!');
                } else {
                  throw new Error('Update failed');
                }
              } else {
                const resultAction = await dispatch(addMember(data));
                if (addMember.fulfilled.match(resultAction)) {
                  toast.success('Member added successfully!');
                } else {
                  throw new Error('Add failed');
                }
              }

              setIsModalOpen(false);
              setEditingMember(null);
              setIsEditMode(false);
            } catch (err) {
              toast.error(err.message || 'Something went wrong!');
            }
          }}
        />

        {/* Details Modal */}
        <MemberDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setDetailsMember(null);
          }}
          member={detailsMember}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span>
            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredMembers.length)} of{' '}
            {filteredMembers.length} members
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

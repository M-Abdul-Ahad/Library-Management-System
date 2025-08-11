import { useEffect, useState } from 'react';

const AddMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    MemberName: '',
    Email: '',
    JoinDate: new Date().toISOString().slice(0, 10),
    IsActive: true,
    Password: '',
    Image: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        MemberID: initialData.MemberID,
        MemberName: initialData.MemberName || '',
        Email: initialData.Email || '',
        JoinDate: initialData.JoinDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        IsActive: initialData.IsActive ?? true,
        Password: '',
        Image: initialData.Image || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = { ...formData };

    // If in edit mode and password is empty, remove it from submission
    if (isEdit && !formData.Password.trim()) {
      delete dataToSubmit.Password;
    }

    onSubmit(dataToSubmit);
  };

  const handleClose = () => {
    setFormData({
      MemberName: '',
      Email: '',
      JoinDate: new Date().toISOString().slice(0, 10),
      IsActive: true,
      Password: '',
      Image: '',
    });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white border-4 border-blue-700 rounded-xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            {isEdit ? 'Edit Member' : 'Add New Member'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="MemberName"
              placeholder="Member Name"
              required
              value={formData.MemberName}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              name="Email"
              placeholder="Email"
              required
              value={formData.Email}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="date"
              name="JoinDate"
              placeholder="Join Date"
              readOnly
              value={formData.JoinDate}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="password"
              name="Password"
              placeholder={isEdit ? 'New Password (Optional)' : 'Password'}
              required={!isEdit}
              value={formData.Password}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              name="Image"
              placeholder="Image URL"
              value={formData.Image}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <label className="flex items-center space-x-2 text-sm col-span-2">
              <input
                type="checkbox"
                name="IsActive"
                checked={formData.IsActive}
                onChange={handleChange}
              />
              <span>Active Member</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
            >
              {isEdit ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddMemberModal;

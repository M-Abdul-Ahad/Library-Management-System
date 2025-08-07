import { useEffect, useState } from 'react';

const categories = [
  { id: 1, name: 'Urdu Literature' },
  { id: 2, name: 'History' },
  { id: 3, name: 'Islamic Studies' },
  { id: 4, name: 'Science' },
  { id: 5, name: 'Fiction' },
];

const AddBookModal = ({ isOpen, onClose, onSubmit, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    Title: '',
    Author: '',
    TotalCopies: '',
    AvailableCopies: '',
    CategoryID: '',
    Image: '',
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCategorySelect = (id) => {
    setFormData(prev => ({ ...prev, CategoryID: id }));
    setShowCategoryDropdown(false);
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg mx-auto bg-blue-50 border-4 border-blue-800 rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="Title"
              placeholder="Title"
              required
              value={formData.Title}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              name="Author"
              placeholder="Author"
              required
              value={formData.Author}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="number"
              name="TotalCopies"
              placeholder="Total Copies"
              required
              value={formData.TotalCopies}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="number"
              name="AvailableCopies"
              placeholder="Available Copies"
              required
              value={formData.AvailableCopies}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />

            <div className="relative">
              <input
                type="text"
                name="CategoryID"
                placeholder="Click to select Category"
                readOnly
                value={formData.CategoryID}
                onClick={() => setShowCategoryDropdown(prev => !prev)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer"
              />
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    >
                      {cat.id} for {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              name="Image"
              placeholder="Image URL"
              value={formData.Image}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 text-white"
            >
              {isEdit ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddBookModal;

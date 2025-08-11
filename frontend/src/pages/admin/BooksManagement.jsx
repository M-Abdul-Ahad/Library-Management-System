import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminHeader from '../../components/admin/AdminHeader';
import BookCard from '../../components/admin/BookCard';
import { FaPlus } from 'react-icons/fa';
import {
  fetchBooks,
  searchBooks,
  deleteBook,
  addBook,
  updateBook
} from '../../store/admin/BookSlice.js'; 
import AddBookModal from '../../components/admin/AddBookModal.jsx';
import BookDetailsModal from '../../components/admin/BookDetailsModal.jsx';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const BooksManagement = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // stores the book being edited
  const [isEditMode, setIsEditMode] = useState(false);
  const [detailsBook, setDetailsBook] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);



  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ author: '', title: '', status: '', sort: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // Fetch all books on component mount
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(searchBooks(filters));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setFilters({ author: '', title: '', status: '', sort: '' });
    dispatch(fetchBooks());
    setCurrentPage(1);
  };

  // Filter and sort on client side for status and sort only
  const filteredBooks = books
    .filter(book => {
      const title = book.Title || "";
      const author = book.Author || "";
      const searchMatch =
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        author.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        !filters.status ||
        (filters.status === 'available' && book.AvailableCopies > 0) ||
        (filters.status === 'unavailable' && book.AvailableCopies === 0);

      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (filters.sort === 'title') return a.Title.localeCompare(b.Title);
      if (filters.sort === 'author') return a.Author.localeCompare(b.Author);
      return 0;
    });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const changePage = (dir) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + dir, totalPages)));
  };

  const handleDelete = async (bookId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This book will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#f0f6ff',
      color: '#1e293b'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBook(bookId));
        toast.success('Book deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete book!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Books Management</h1>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by title, author, ISBN..."
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Author"
              className="px-3 py-2 rounded bg-gray-100"
              value={filters.author}
              onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            />
            <input
              type="text"
              placeholder="Title"
              className="px-3 py-2 rounded bg-gray-100"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
            <select
              className="px-3 py-2 rounded bg-gray-100"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              className="px-3 py-2 rounded bg-gray-100"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Add Book */}
        <div className="flex justify-end mb-4">
         <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow transition duration-300"
          >
            <FaPlus /> Add New Book
          </button>

        </div>

        {/* Book Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-10">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : currentBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            currentBooks.map((book) => (
              <div key={book.BookID || book.id} className="mb-10">
                <BookCard
                  book={book}
                  onEdit={() => {
                    setEditingBook(book);
                    setIsEditMode(true);
                    setIsModalOpen(true);
                  }}

                  onDelete={() => handleDelete(book.BookID || book.id)}
                  onDetails={() => {
                    setDetailsBook(book);
                    setIsDetailsOpen(true);
                  }}
                />
              </div>
            ))
          )}
        </div>

        <AddBookModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingBook(null);
    setIsEditMode(false);
  }}
  initialData={editingBook}
  isEdit={isEditMode}
  onSubmit={async (bookData) => {
    try {
      if (isEditMode && editingBook?.BookID) {
        const resultAction = await dispatch(updateBook({ BookID: editingBook.BookID, updatedData: bookData }));
        if (updateBook.fulfilled.match(resultAction)) {
          toast.success('Book updated successfully!');
        } else {
          throw new Error(resultAction.error?.message || 'Failed to update book');
        }
      } else {
        const resultAction = await dispatch(addBook(bookData));
        if (addBook.fulfilled.match(resultAction)) {
          toast.success('Book added successfully!');
        } else {
          throw new Error(resultAction.error?.message || 'Failed to add book');
        }
      }
      setIsModalOpen(false);
      setEditingBook(null);
      setIsEditMode(false);
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    }
  }}
/>

<BookDetailsModal
  isOpen={isDetailsOpen}                                                         
  onClose={() => setIsDetailsOpen(false)}
  book={detailsBook}
/>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span>
            Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
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

export default BooksManagement;

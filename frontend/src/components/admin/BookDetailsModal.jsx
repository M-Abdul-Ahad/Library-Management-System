import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const BookDetailsModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const isAvailable = book.AvailableCopies > 0;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-blue-100/70 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-8"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-8"
          >
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl border-4 border-blue-800 bg-blue-50 p-6 shadow-2xl transition-all">
              <Dialog.Title className="text-2xl font-bold text-blue-900 mb-6 text-center">
                Book Details
              </Dialog.Title>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Book Image */}
                {book.Image && (
                  <div className="flex-shrink-0 w-full md:w-1/2">
                    <img
                      src={book.Image}
                      alt={book.Title}
                      className="w-full h-64 object-cover rounded-lg border border-blue-300"
                    />
                  </div>
                )}

                {/* Book Info */}
                <div className="flex-1 space-y-4 text-blue-900">
                  <div>
                    <span className="font-semibold">Title:</span> {book.Title}
                  </div>
                  <div>
                    <span className="font-semibold">Author:</span> {book.Author}
                  </div>
                  <div>
                    <span className="font-semibold">Total Copies:</span> {book.TotalCopies}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Available Copies:</span> {book.AvailableCopies}
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        isAvailable
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Category ID:</span> {book.CategoryID}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BookDetailsModal;

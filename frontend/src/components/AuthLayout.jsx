const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Panel with Darker Gradient & Welcome Text */}
      <div className="md:w-1/2 h-64 md:h-screen bg-gradient-to-br from-gray-200 via-blue-200 to-gray-100 text-gray-900 flex items-center justify-center relative px-6 py-10">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md leading-tight text-blue-900">
            Welcome to Smart Library Portal
          </h1>
          <p className="text-sm bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Manage books, track transactions, and explore our digital library with ease.
          </p>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;

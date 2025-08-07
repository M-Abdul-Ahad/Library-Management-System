const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">Oops! The page you are looking for doesn’t exist.</p>
      <a href="/" className="mt-6 text-blue-500 underline">Go to Home</a>
    </div>
  );
};

export default NotFound;

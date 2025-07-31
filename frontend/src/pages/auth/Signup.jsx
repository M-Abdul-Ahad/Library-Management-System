import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/auth/memberAuthSlice";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agreed: false,
    picture: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.memberAuth);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.agreed) return;

    dispatch(signupUser(form));
  };

  useEffect(() => {
    if (token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-2xl shadow-2xl drop-shadow-lg ring-1 ring-gray-300 w-full transform transition-all hover:scale-[1.01] duration-300 ease-in-out">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 drop-shadow">
          Signup as User
        </h2>
        <p className="text-gray-500 text-center mb-6">Create a new account</p>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 shadow">
                📤 Upload
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600 truncate w-48">
                {form.picture ? form.picture.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="mr-2 accent-green-600"
              />
              I agree to the{" "}
              <a href="#" className="text-blue-600 ml-1 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 shadow-md transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>

          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;

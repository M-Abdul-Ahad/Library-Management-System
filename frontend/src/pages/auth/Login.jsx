import { useState, useEffect } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/memberAuthSlice";
import { loginAdmin } from "../../store/auth/adminAuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const memberState = useSelector((state) => state.memberAuth);
  const adminState = useSelector((state) => state.adminAuth);

  const handleLogin = (e) => {
    e.preventDefault();
    if (isAdmin) {
      dispatch(loginAdmin({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  useEffect(() => {
    if (memberState.token && !isAdmin) {
      navigate("/home");
    }
    if (adminState.token && isAdmin) {
      navigate("/dashboard");
    }
  }, [memberState.token, adminState.token, isAdmin, navigate]);

  const loading = isAdmin ? adminState.loading : memberState.loading;
  const error = isAdmin ? adminState.error : memberState.error;

  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-2xl shadow-2xl drop-shadow-lg ring-1 ring-gray-300 w-full transform transition-all hover:scale-[1.01] duration-300 ease-in-out">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 drop-shadow">
          Login
        </h2>
        <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="accent-blue-600"
              />
              Login as Admin
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition"
          >
            Sign In
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </a>
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}
          {loading && (
            <p className="text-blue-500 text-sm text-center mt-3">
              Logging in...
            </p>
          )}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

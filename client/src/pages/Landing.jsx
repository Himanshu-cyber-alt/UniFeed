import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { googleRegister } from "../features/auth/authSlice";
import Footer from "./Footer";

export default function Landing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleGoogleRegister = async () => {
    try {
      const resultAction = await dispatch(googleRegister());
      console.log(resultAction)
   let img = resultAction.payload.user.avatar
      if (googleRegister.fulfilled.match(resultAction)) {
        navigate("/home",{ state: { avatar: resultAction.payload.user.avatar } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <h1 className="text-9xl font-extrabold text-blue-400">U</h1>
        </div>
        <div className="flex flex-col w-full md:w-1/2 justify-center px-8">
          <h2 className="text-5xl font-bold mb-6">Happening now</h2>
          <h3 className="text-2xl font-semibold mb-8">Join UniFeed today.</h3>
          <div className="flex flex-col space-y-4 mb-8 w-80">
            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="bg-white text-black font-semibold rounded-full px-6 py-3 hover:bg-gray-200"
            >
              {loading ? "Signing in..." : "Sign up with Google"}
            </button>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-6 py-3 text-center"
            >
              Sign up with Email
            </Link>
          </div>
          <p className="text-sm text-gray-400 mb-6 w-80">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
          <div>
            <p className="text-lg font-semibold mb-3">Already have an account?</p>
            <Link
              to="/login"
              className="border border-gray-500 hover:bg-gray-800 text-white font-semibold rounded-full px-6 py-3 w-80 text-center inline-block"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


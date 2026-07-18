import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(formData);
      console.log(res.data);

      // pour  stockage token JWT
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirection dashboard
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data?.message || "Erreur login");
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#F6FEFE] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Connexion
        </h1>

        <div className="space-y-4">
          <input
            name="email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg pr-10"
              placeholder="Mot de passe"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c1.01 0 1.99-.137 2.928-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 12.544 12.544M10.5 10.5a1.5 1.5 0 1 0 3 3"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322C3.423 8.151 7.36 5.5 12 5.5c4.638 0 8.573 2.65 9.964 6.822-.07.207-.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.01-9.964-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-primary text-white py-3 rounded-lg"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

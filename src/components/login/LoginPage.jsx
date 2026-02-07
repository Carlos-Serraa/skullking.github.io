import { useState, useRef } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function LoginPage() {
  const isRegisteringRef = useRef(false);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    isRegisteringRef.current = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      setSuccess("Compte creat!");

      setIsRegister(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      isRegisteringRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-80 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {isRegister ? "Registra't" : "Inicia sessió"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-3">
          {isRegister && (
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          <input
            type="email"
            placeholder="Correu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Carregant..."
              : isRegister
              ? "Registra't"
              : "Inicia sessió"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

        <p className="mt-4 text-sm">
          {isRegister ? (
            <>
              Ja tens compte?{" "}
              <span
                onClick={() => {
                  setIsRegister(false);
                  setSuccess("");
                }}
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Inicia sessió
              </span>
            </>
          ) : (
            <>
              No tens compte?{" "}
              <span
                onClick={() => setIsRegister(true)}
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Registra't
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

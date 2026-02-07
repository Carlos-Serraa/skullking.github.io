import { useEffect, useState } from "react";
import LoginPage from "./components/login/LoginPage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import Dashboard from "./components/dashboard/Dashboard";
import { collection, getDocs } from "firebase/firestore";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSignOut = async () => {
    await signOut(auth)
  }

  return (
    <>
      {user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <LoginPage />}
    </>
  );
}

export default App;

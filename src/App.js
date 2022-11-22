import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./Feed";
import SignInAndLogin from "./SignInAndLogin";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, Zoom } from "react-toastify";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // setLoading(false);
    });
  }, []);
  return (
    <div className="">
      <ToastContainer transition={Zoom} />
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Feed />} />
          <Route path={`/Login`} element={<SignInAndLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

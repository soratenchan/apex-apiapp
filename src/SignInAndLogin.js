import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "./firebase";
import SingUpModal from "./SignUpModal";
import "react-toastify/dist/ReactToastify.css";
import crypto from "./imgs/apex-legends-cover.webp";

export default function SignInAndLogin() {
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      notify("ログインしました");
      navigate("/");
    } catch (error) {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };
  const notify = (sentence) =>
    toast.success(sentence, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  return (
    <>
      {!auth.currentUser ? (
        <div className="flex h-screen bg-dark-900">
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-6 text-3xl tracking-tight font-Tangerine font-bold text-white">
                  Welcome!
                </h2>
              </div>
              <div className="mt-6">
                <div>
                  <div>
                    {/* <p className="text-sm font-medium text-white">
                  好きな方法でログイン・登録しよう！
                </p> */}
                    {/* <div className="mt-1 grid grid-cols-1">
                  <div onClick={() => signInWithGoogle()}>
                    <a
                      href="#"
                      className="w-full inline-flex justify-center py-1 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign in with Google</span>
                      <FcGoogle size={32} />
                    </a>
                  </div>
                </div> */}
                  </div>
                  {/* <div className="mt-6 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2  text-white">または</span>
                </div>
              </div> */}
                </div>
                <div className="mt-6">
                  <form
                    action="#"
                    method="POST"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                      >
                        メールアドレス
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white"
                      >
                        パスワード
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-white"
                        >
                          記憶する
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          パスワードを忘れた方
                        </a>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        ログイン
                      </button>
                    </div>
                  </form>
                </div>
                <div className="mt-6 relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm"></div>
                </div>
                <div className="mt-6 ">
                  <button
                    type="button"
                    onClick={() => setOpenSignUpModal(true)}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    新規登録
                  </button>
                </div>
              </div>
            </div>
          </div>
          <SingUpModal
            openSignUpModal={openSignUpModal}
            setOpenSignUpModal={setOpenSignUpModal}
          />
          <div className="hidden lg:block relative w-0 flex-1">
            <img
              className="absolute inset-0 h-full object-fill"
              src={crypto}
              alt=""
            />
          </div>
        </div>
      ) : (
        <Navigate to={`/`} />
      )}
    </>
  );
}

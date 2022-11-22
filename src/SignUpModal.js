import { React, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import db, { auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

export default function SingUpModal({ openSignUpModal, setOpenSignUpModal }) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      if (userData) {
        await setDoc(doc(db, "users", userData.user.uid), {
          nickName: userName,
        });
      } else {
        notify("アカウント作成に失敗しました");
      }
      notify("新規作成しました");
      navigate("/");
    } catch (error) {
      console.log(error);
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
    <Transition.Root show={openSignUpModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenSignUpModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full  p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* ここのclassNameでモーダルの大きさ変えれる */}
              <Dialog.Panel className="relative bg-dark-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full sm:p-6">
                <div>
                  <p className="text-sm font-medium text-white">
                    まずはアカウント情報を登録しましょう。
                  </p>
                </div>

                <div className="mt-6">
                  <form
                    action="#"
                    method="POST"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-1">
                      <label
                        htmlFor=""
                        className="block text-sm font-medium text-white"
                      >
                        ユーザー名
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          autoComplete="userName"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
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
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          // required
                          className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense space-y-6 sm:space-y-0">
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
                            // required
                            className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-white"
                        >
                          パスワード(再確認)
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={registerPassword}
                            autoComplete="current-password"
                            // required
                            onChange={(e) =>
                              setRegisterPassword(e.target.value)
                            }
                            className="appearance-none block w-full px-3 py-2 border border-dark-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-7 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        登録
                      </button>
                      <button
                        onClick={() => setOpenSignUpModal(false)}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-dark-900 shadow-sm px-4 py-2 bg-dark-500 text-base font-medium text-white hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import db, { auth } from "./firebase";
import { Origin, Psn, Xbox } from "./utils/PlatformIcons";

export default function Post({ post, userName }) {
  const messageRef = useRef();
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const deletePost = async (id) => {
    const result = window.confirm("投稿を削除しますか？");
    if (result) {
      await deleteDoc(doc(db, "stats", id));
      console.log(id);
    }
    // alert("aaa");
  };
  const postComment = async () => {
    if (!message) {
      alertNotify("未入力ではコメントできません");
      return;
    }
    addDoc(collection(db, "stats", post.id, "comments"), {
      userId: auth.currentUser?.uid || "",
      comment: message,
      userName: userName,
      createdAt: new Date(),
    });
    messageRef.current.value = null;
    setMessage(null);
  };
  useEffect(() => {
    const commentsRefs = collection(
      db,
      "stats",
      post.id, //ここをmapしているpostsのidを入れたい
      "comments"
    );
    const commentSub = onSnapshot(commentsRefs, (querySnapshot) => {
      setComments(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return () => {
      commentSub();
    };
  }, []);
  const alertNotify = (sentence) =>
    toast.warn(sentence, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div className="flex justify-center flex-col w-full  bg-dark-700 rounded-lg shadow-lg border-2 border-dark-900">
      <div className="relative px-3 py-1 pt-1 break-all text-gray-300 pb-10">
        {post.text}
        {post.discordUrl ? (
          <div className="absolute bottom-1 right-1">
            <a href={post.discordUrl} target="_blank">
              <FaDiscord size={20} color="" />
            </a>
          </div>
        ) : null}
        {post.twitterUrl ? (
          <div
            className={`absolute ${
              post.discordUrl ? "bottom-1 right-7" : "bottom-1 right-1"
            } `}
          >
            <a href={post.twitterUrl} target="_blank">
              <BsTwitter size={20} color="" />
            </a>
          </div>
        ) : null}
      </div>
      <div
        className="relative flex justify-center flex-col space-y-16 py-3 rounded-lg p-2 mb-3"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), center url(
                   ${post.stats.bgImage}
                                    )`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row space-x-4">
            <div className="flex  flex-row space-x-2">
              <div className="flex items-center justify-center rounded-full shadow-lg bg-white text-dark-900 h-8 w-8">
                {post.stats.platForm === "psn" ? (
                  <Psn />
                ) : post.stats.platForm === "origin" ? (
                  <Origin />
                ) : post.stats.platForm === "xbox" ? (
                  <Xbox />
                ) : null}
              </div>

              <div className="flex items-center justify-center text-white">
                {post.stats.userName}
              </div>
            </div>
            <div className="flex items-center justify-center text-sm text-white">
              Level:{post.stats.level}
            </div>
            <div className="flex items-center justify-center text-sm text-white">
              Kills:{post.stats.kills}
            </div>
          </div>
          <div className="flex items-center justify-center  text-sm text-white">
            {post.createdAt
              .toDate()
              .toString()
              .replace("GMT+0900 (日本標準時)", "")}
          </div>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="flex flex-col space-y-1">
            <p className="font-bold text-center text-white">バトルロワイヤル</p>
            <p className="text-center text-white">
              {post.stats.battleRoyaleRankName}
            </p>
            <img class="h-28 w-28" src={post.stats.battleRoyaleRankIconUrl} />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="font-bold text-center text-white">アリーナ</p>
            <p className="text-center text-white">{post.stats.arenaRankName}</p>
            <img class="h-28 w-28" src={post.stats.arenaRankIconUrl} />
          </div>
          <div className="flex flex-col space-y-6">
            <p className="font-bold text-center text-white">使用レジェンド</p>
            <div className="flex flex-row">
              <img class="h-20 w-20" src={post.stats.legend1} />
              <img class="h-20 w-20" src={post.stats.legend2} />
              {post.stats.legend3 ? (
                <img class="h-20 w-20" src={post.stats.legend3} />
              ) : null}
            </div>
          </div>
        </div>
        {auth.currentUser?.uid === post.uid ? (
          <div
            className="absolute z-10 bottom-1 right-1 cursor-pointer"
            onClick={() => deletePost(post.id)}
          >
            <MdDelete size={36} color="" />
          </div>
        ) : (
          <div className="absolute z-10 bottom-1 right-1 cursor-pointer text-gray-200 text-sm">
            posted by {post.userName}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col space-y-2 p-2 pt-2 border-t border-dark-600">
        <div className="flex flex-col space-y-2 items-start justify-start">
          {comments
            .sort(function (a, b) {
              return a.createdAt - b.createdAt;
            })
            .map((comment) => (
              <div class="flex items-center rounded-md bg-dark-800 py-2 px-4">
                <div class="w-full">
                  <div class="flex items-center space-x-8 justify-between">
                    <a class="text-gray-900 dark:text-gray-100 hover:underline text-sm font-medium">
                      {comment.userName}
                    </a>
                  </div>
                  <div class="mt-1 text-gray-700 dark:text-gray-300">
                    <p class="text-base break-all">{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="w-full flex flex-row items-center justify-center space-x-2 pb-1">
          <p className="text-gray-300">{userName}</p>
          <div className="w-full relative">
            <input
              ref={messageRef}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="w-full pl-2 p-1 shadow-sm rounded-md border border-dark-600"
              placeholder="コメントを入力"
            />

            <div class="absolute bottom-0 right-0 py-1 px-2">
              <button
                onClick={postComment}
                type="submit"
                class="p-1 border border-transparent rounded-full shadow-sm text-white focus:outline-none bg-violet-600 hover:bg-violet-700 focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-4 w-4"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

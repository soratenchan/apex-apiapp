import React, { useEffect, useState } from "react";
import { useRef } from "react";
import ApexInputForm from "./utils/ApexInputForm";
import { Origin, Psn, Xbox } from "./utils/PlatformIcons";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import db, { auth } from "./firebase";
import bgApexImage from "./imgs/apex-legends-header.png";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Post from "./Post";
import InduceLoginModal from "./InduceLoginModal";
import { FaDiscord } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";

export default function Feed() {
  const accountNameRef = useRef();
  const textRef = useRef();
  const discordRef = useRef();
  const twitterRef = useRef();
  const [platform, setPlatform] = useState();
  const [battleRecord, setBattleRecord] = useState({});
  // firebaseに入れた投稿したやつを、撮ってきた後に入れるstate。mapでまわす！
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("Guest");
  const [openInduceLogin, setOpenInduceLogin] = useState(false);
  const logout = async () => {
    await signOut(auth);
    notify("ログアウトしました");
  };
  const handleClick = async () => {
    const jsonData = await fetch("http://localhost:8000/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform: platform,
        userName: accountNameRef.current.value,
      }),
      // mode: "cors",
    });

    const data = await jsonData.json();
    setBattleRecord(data);
    console.log(data.data);
  };
  const addFirebase = async () => {
    if (auth.currentUser) {
      await addDoc(collection(db, "stats"), {
        uid: auth.currentUser.uid,
        userName: userName,
        text: textRef.current.value,
        createdAt: new Date(),
        discordUrl: discordRef.current.value,
        twitterUrl: twitterRef.current.value,
        stats: {
          platForm: battleRecord?.data?.platformInfo?.platformSlug,
          userName: battleRecord?.data?.platformInfo?.platformUserId,
          level: battleRecord?.data?.segments[0]?.stats?.level?.value,
          kills: battleRecord?.data?.segments[0]?.stats?.kills?.value,
          battleRoyaleRankName:
            battleRecord?.data?.segments[0]?.stats?.rankScore?.metadata
              ?.rankName,
          battleRoyaleRankIconUrl:
            battleRecord?.data?.segments[0]?.stats?.rankScore?.metadata
              ?.iconUrl,
          arenaRankName:
            battleRecord?.data?.segments[0]?.stats?.arenaRankScore?.metadata
              ?.rankName,
          arenaRankIconUrl:
            battleRecord?.data?.segments[0]?.stats?.arenaRankScore?.metadata
              ?.iconUrl,
          legend1: battleRecord?.data?.segments[1]?.metadata?.imageUrl,
          legend2: battleRecord?.data?.segments[2]?.metadata?.imageUrl,
          legend3: battleRecord?.data?.segments[3]?.metadata?.imageUrl,
          bgImage: battleRecord?.data?.segments[1]?.metadata?.bgImageUrl,
        },
      });
      textRef.current.value = null;
    } else {
      setOpenInduceLogin(true);
    }
  };
  const userInfo = auth.currentUser;
  useEffect(() => {
    // 監視するコードを書くonSnapshot的なやつ。
    // 上の投稿ボタン押した時の関数でsetDoc（useEffectでは使わない）した段階で感知してとってくる
    // ここでsetPostsする
    const statsRef = collection(db, "stats");

    const unsub = onSnapshot(statsRef, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    // getDocでとってきたuserからとってきたユーザーネームをstateに入れる
    // postComment時にとってきたユーザーネームをfireStoreに投げる
    // logOutFuncのなかでstateを空またはguestに変えるのを忘れずに
    return () => {
      unsub();
    };
  }, []);
  useEffect(() => {
    console.log("uooooo", userInfo?.uid);
    const getUserName = async () => {
      const uid = userInfo?.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      docSnap.data();
      setUserName(
        docSnap._document.data.value.mapValue.fields.nickName.stringValue
      );
    };
    if (userInfo?.uid) {
      getUserName();
    } else {
      setUserName("Guest");
    }
    return () => {};
  }, [userInfo]);
  const notify = (sentence) =>
    toast.info(sentence, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div className="relative flex flex-col relative items-center justify-center pb-10 bg-dark-900">
      <div className="w-full ">
        <img className="w-full h-80 bg-cover" src={bgApexImage} />
      </div>
      <div className="w-full md:w-2/5 bg-dark-900 rounded-lg shadow-xl mt-5">
        {battleRecord?.data ? (
          <div className="flex flex-col items-end justify-end">
            <button
              className="btn btn-primary rounded-sm animate-none"
              onClick={addFirebase}
            >
              投稿する
            </button>
            <textarea ref={textRef} className="relative pl-2 w-full" rows="3" />
            <div class="w-full shadow-sm flex undefined">
              <span class="bg-dark-900 border border-r-0 border-dark-700 px-2 inline-flex items-center text-gray-500 sm:text-sm">
                <FaDiscord size={20} color="" />
              </span>
              <input
                ref={discordRef}
                type="url"
                name="url"
                id="url"
                placeholder="https://discord..."
                title=""
                class="py-1.5 pl-1 flex-grow block w-full min-w-0 rounded-none sm:text-sm bg-dark-700 focus:ring-violet-500 focus:border-violet-500 border-dark-700 text-gray-100"
              />
            </div>
            <div class="w-full shadow-sm flex undefined">
              <span class="bg-dark-900 border border-r-0 border-dark-700 px-2 inline-flex items-center text-gray-500 sm:text-sm">
                <BsTwitter size={20} color="" />
              </span>
              <input
                ref={twitterRef}
                type="url"
                name="url"
                id="url"
                placeholder="https://twitter..."
                title=""
                class="py-1.5 pl-1 flex-grow block w-full min-w-0 rounded-none sm:text-sm bg-dark-700 focus:ring-violet-500 focus:border-violet-500 border-dark-700 text-gray-100"
              />
            </div>
          </div>
        ) : null}
        {battleRecord?.data ? (
          <div
            className="flex justify-center flex-col w-full p-3 space-y-12"
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), center url(
              ${battleRecord?.data?.segments[1]?.metadata?.bgImageUrl}
            )`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-row space-x-4">
              <div className="flex flex-row space-x-2">
                <div className="flex items-center justify-center rounded-full bg-white text-dark-900 h-8 w-8">
                  {battleRecord?.data?.platformInfo?.platformSlug === "psn" ? (
                    <Psn />
                  ) : battleRecord?.data?.platformInfo?.platformSlug ===
                    "origin" ? (
                    <Origin />
                  ) : battleRecord?.data?.platformInfo?.platformSlug ===
                    "xbox" ? (
                    <Xbox />
                  ) : null}
                </div>
                <div className="flex items-center justify-center text-white">
                  {battleRecord?.data?.platformInfo?.platformUserId}
                </div>
              </div>
              <div className="flex items-center justify-center text-sm text-white">
                Level:{battleRecord?.data?.segments[0]?.stats?.level?.value}
              </div>
              <div className="flex items-center justify-center text-sm text-white">
                Kills:{battleRecord?.data?.segments[0]?.stats?.kills?.value}
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-col space-y-1">
                <p className="font-bold text-center text-white">
                  バトルロワイヤル
                </p>
                <p className="text-center text-white">
                  {
                    battleRecord?.data?.segments[0]?.stats?.rankScore?.metadata
                      ?.rankName
                  }
                </p>
                <img
                  class="h-28 w-28"
                  src={
                    battleRecord?.data?.segments[0]?.stats?.rankScore?.metadata
                      ?.iconUrl
                  }
                />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-bold text-center text-white">アリーナ</p>
                <p className="text-center text-white">
                  {
                    battleRecord?.data?.segments[0]?.stats?.arenaRankScore
                      ?.metadata?.rankName
                  }
                </p>
                <img
                  class="h-28 w-28"
                  src={
                    battleRecord?.data?.segments[0]?.stats?.arenaRankScore
                      ?.metadata?.iconUrl
                  }
                />
              </div>
              <div className="flex flex-col space-y-6">
                <p className="font-bold text-center text-white">
                  使用レジェンド
                </p>
                <div className="flex flex-row">
                  <img
                    class="h-20 w-20"
                    src={battleRecord?.data?.segments[1]?.metadata?.imageUrl}
                  />
                  <img
                    class="h-20 w-20"
                    src={battleRecord?.data?.segments[2]?.metadata?.imageUrl}
                  />
                  {battleRecord?.data?.segments[3] ? (
                    <img
                      class="h-20 w-20"
                      src={battleRecord?.data?.segments[3]?.metadata?.imageUrl}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-row justify-between border-2 rounded-lg border-dark-800">
          <ApexInputForm setPlatform={setPlatform} platform={platform} />

          <div className="flex flex-row">
            <input
              className="pl-2 w-72"
              placeholder="アカウント名を入力"
              ref={accountNameRef}
            />
            <button
              className="btn rounded-none animate-none rounded-r-lg"
              onClick={handleClick}
            >
              連携
            </button>
          </div>
        </div>
      </div>
      <div className="md:w-2/5 flex flex-col w space-y-7 pt-12">
        {posts
          .sort(function (a, b) {
            return b.createdAt - a.createdAt;
          })
          .map((post) => (
            <Post key={post.id} post={post} userName={userName} />
          ))}
      </div>
      {auth.currentUser ? (
        <button
          class="absolute top-3 right-3 bg-indigo-800 hover:bg-indigo-900 text-white font-Mincho font-bold py-2 w-30 md:px-5"
          onClick={logout}
        >
          ログアウト
        </button>
      ) : (
        <button class="absolute top-3 right-3 bg-green-800 hover:bg-green-900 text-white font-Mincho font-bold py-2 w-30 md:px-7">
          <Link to={`/Login`}>ログイン</Link>
        </button>
      )}
      <p>
        <a
          className="absolute top-0 left-0 text-xs text-blue-700"
          href="javascript:(function () {var s = document.createElement('script');s.setAttribute('src', 'http://fontbomb.ilex.ca/js/main.js');document.body.appendChild(s);}());"
        >
          <strong>bomb</strong>
        </a>
      </p>
      <InduceLoginModal
        openInduceLogin={openInduceLogin}
        setOpenInduceLogin={setOpenInduceLogin}
      />
    </div>
  );
}

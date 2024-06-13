'use client';

import Image from "next/image";
import "@/app/homepage.css";
import LoginButton from "@/app/components/LoginButton/LoginButton";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { logout, removeTokens } = AuthActions();


  function handleClickWithoutLogin() {
    alert("Вы не вошли в аккаунт");
  }
  if (AuthActions().getToken("refresh") == null) {
    
    var fullName = "";
    var user = null;
    var handleLogout = () => {
      alert("Вы не вошли в аккаунт");
    }
  }
  else {
    var { data: user } = useSWR("/auth/users/me", fetcher);
    var { data: userFull } = useSWR("/api/users/" + user?.id, fetcher);


    var fullName = "";
    if (userFull) {
      fullName = `${userFull.first_name} ${userFull.last_name}`
    }
    var handleLogout = () => {
      logout()
        .res(() => {
          removeTokens();

          router.push("/");
          window.location.reload();
        })
        .catch(() => {
          removeTokens();
          router.push("/");
          window.location.reload();
        });
    };
  }
  return (
    <main className="mainly">
      <div className="header">
          <Link className="logo" href={"/"}>
            <Image
              src={'/logo-asi.png'}
              width={60}
              height={60}
              alt="Logo"
            />
            <h2 className="text--big">Инженерный центр АСИ</h2>
          </Link>
        <div className="btn--authorize">
          <LoginButton name={fullName} handleClick={handleLogout} logged={user != null} />
        </div>
      </div>

      <div className="section--main
      place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className={`sidebar ${user ? "active" : ""}`}>
          <Sidebar user={user} />
        </div>
        <div className="section-right">
          <div className="test--child text-center">здесь</div>
        </div>

      </div>

      <div className="footer">
        <div className="bordered">
          <h2 className="mb-3 text-2xl font-semibold">tut1</h2>
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            texttexttextextetetextextetextextextexte. texttexttextextetextextextexte
          </p>
        </div>
        <div className="bordered">
          <h2 className="mb-3 text-2xl font-semibold">tut1</h2>
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            texttexttexttexttextextetextextextexte. texttexttextextetextextextexte
          </p>
        </div>
        <div className="bordered">
          <h2 className="mb-3 text-2xl font-semibold">tut1</h2>
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            texttexttextextexttextextetextextextexte. texttexttextextetextextextexte
          </p>
        </div>
        <div className="bordered">
          <h2 className="mb-3 text-2xl font-semibold">tut1</h2>
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            texttexttextettexttextextetextextextexte. texttexttextextetextextextexte
          </p>
        </div>
      </div>
    </main>
  );
}

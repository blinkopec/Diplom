import { AuthActions } from "@/app/auth/utils";
import { useRouter, useParams } from "next/navigation";
import styles from "./Board.module.css";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import Block from "./Block/Block";
import AddBlockButton from "./AddBlockButton/AddBlockButton";
import { useState } from "react";
import Link from "next/link";

export default function Board() {
    if (AuthActions().getToken("refresh") == null) {
        useRouter().push("/");
    }
    const boardId = useParams().boardId
    const { data: board } = useSWR("/api/boards/" + boardId, fetcher)
    const { data: blocks, isLoading } = useSWR("/api/blocks/" + boardId + "/get_by_id_board/", fetcher)
    const { data: user, isLoading: userLoading } = useSWR("/auth/users/me", fetcher);
    const { data: userFull, isLoading: userFullLoading } = useSWR("/api/users/" + user?.id, fetcher);

    if (isLoading || userLoading || userFullLoading) {
        return <></>
    }


    const blocksDisplay = blocks.map((block: Block) => {
        return (
            <Block block={block} />
        );
    })

    // TODO: сделать отображение пользователя 
    // TODO: сделать переход обратно на главную страницу
    return (
        <div className={`${styles.mainly} place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]`}>
            <div className={styles.header}>
                <div className={styles.header__content}>
                    <h1>Доска: {board?.name}</h1>
                    <div className={styles.header__menu}>
                        <Link className={styles.header__menu_element} href={`/board/${boardId}/members`}>Участники</Link>
                        <Link className={styles.header__menu_element} href={`/board/${boardId}/roles`}>Роли</Link>
                        <p className={styles.header__menu_element}>{userFull.first_name + " " + userFull.last_name }</p>
                    </div>

                </div>
                <div className={styles.horizontal_line}></div>
                <AddBlockButton boardId={board?.id} />
            </div>

            <div className={styles.body}>
                {blocksDisplay}
            </div>
        </div>
    );
}
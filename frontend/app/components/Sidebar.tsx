import Link from "next/link";
import Image from "next/image";
import "@/app/styles.css";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import '@/app/styles.css'
function FillBoards({ usersBoards, userInBoards }: { usersBoards: any, userInBoards: any }) {
    if (!usersBoards && !userInBoards) {
        return (
            <div>No boards</div>
        )
    }

    if (usersBoards) {
        return (
            <div>
                {usersBoards.map((board: any) => {
                    return (
                        <Link href={`/board/${board.id}`}>{board.name}</Link>
                    )
                })}
            </div>
        )
    }
}

export default function Sidebar({ user }: { user: any }) {
    const router = useRouter();
    const { data: usersBoards } = useSWR("/api/boards/get_users_boards", fetcher);
    const { data: userInBoards } = useSWR("/api/boards/get_user_in_boards", fetcher);
    
    if (!usersBoards) {
        return (
            <div>Loading...</div>
        )
    }
    if (!userInBoards) {
        return (
            <div>Loading...</div>
        )
    }
    if (usersBoards.length <= 0 && userInBoards.length <= 0) {
        return (
            <>
                <div>У вас нет досок</div>
                <AddBoardButton />
            </>
        )
    }

    var boardListTmp = null;
    if (usersBoards.length > 0) {
        boardListTmp = usersBoards.map((board: any) => {
            return (
                <Link href={`/board/${board.id}`}>{board.name}</Link>
            )
        })
    }


    var adminBoardListTmp = null;
    if (userInBoards.length > 0) {
        adminBoardListTmp = userInBoards.map((board: any) => {
            return (
                <Link href={`/board/${board.id}`}>{board.name}</Link>
            )
        })
    }

    const boardList = (
        <div>
            <h2>Доски, в которых вы состоите:</h2>
            {boardListTmp}
        </div>
    )

    const adminBoardList = (
        <div>
            <h2>Ваши доски:</h2>
            <div className="boards">
                {adminBoardListTmp}
            </div>
        </div>
    )

    if (usersBoards.length <= 0 && userInBoards.length > 0) {
        return (
            <div>
                {adminBoardList}
                <AddBoardButton />
            </div>
        )
    }
    if (usersBoards.length > 0 && userInBoards.length <= 0) {
        return (
            <div>
                {boardList}

                <AddBoardButton />

            </div>
        );
    }
    return (
            <div>
                {adminBoardList}
                {boardList}

                <AddBoardButton />

            </div>
        );
}

function AddBoardButton() {
    return (
        <div>
            {/* тут ссылка на создание новой доски или всплывающее меню */}
            <Link href='/' className="add-board">
                <Image src='/plus-icon.png'
                    width={25}
                    height={25}
                    alt="Plus icon"
                />
            </Link>
        </div>
    )
}
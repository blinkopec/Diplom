'use client'

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import './Members.css';
import MemberField from "./MemberField";

export default function Members() {
    const boardId = useParams().boardId
    const { data: board, isLoading: boardLoading } = useSWR("/api/boards/" + boardId, fetcher)
    const { data: user, isLoading: userLoading } = useSWR("/auth/users/me", fetcher);
    const { data: userFull, isLoading: userFullLoading } = useSWR("/api/users/" + user?.id, fetcher);
    const { data: role, isLoading: roleLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board_user/', fetcher);
    const { data: roles, isLoading: rolesLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board/', fetcher)
    const { data: userBoards, isLoading: userBoardsLoading } = useSWR("/api/user_boards/" + boardId + '/get_by_id_board/', fetcher)
    const { data: userBoard, isLoading: userBoardLoading } = useSWR("/api/user_boards/" + boardId + '/get_user_board_of_user/', fetcher)
    if (boardLoading || userLoading || userFullLoading || roleLoading || rolesLoading || userBoardsLoading || userBoardLoading) {
        return (
            <div>

            </div>
        )
    }

    const roleDisplay = userBoards.map((userBoard: UserBoard) => {
        return (
            <MemberField userBoard={userBoard} roles={roles} editing={role.edit_members} deleting={role.delete_members} is_admin={userBoard.is_admin} />
        )
    })

    return (
        <div className="members__mainly  place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <div className="header">
                <div className="members__header-content">
                    <div className="members__header-content-title">
                        <h1>Доска: {board.name}</h1>
                        <Link className="members__header-back" href={'/board/' + boardId}>Назад</Link>
                    </div>
                    <div>{userFull.first_name + ' ' + userFull.last_name}</div>
                </div>
                <div className="members__horizontal-line"></div>
            </div>
            <div className="members__body">
                <Link className="members__search" href={'/board/' + boardId + '/members/search/'}>Добавить участника</Link>
                <div className="members__body-form">

                    {roleDisplay}
                </div>
            </div>
        </div>
    )
}
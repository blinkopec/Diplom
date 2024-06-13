'use client'

import { fetcher } from "@/app/fetcher";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import './MemberSearch.css'
import { useState } from "react";
import { apiRequests } from "@/app/apiRequests";
import Popup from "reactjs-popup";
export default function MemberSearch() {
    const boardId = useParams().boardId
    const { data: board, isLoading: boardLoading } = useSWR("/api/boards/" + boardId, fetcher)
    const { data: user, isLoading: userLoading } = useSWR("/auth/users/me", fetcher);
    const { data: userFull, isLoading: userFullLoading } = useSWR("/api/users/" + user?.id, fetcher);
    const { data: roles, isLoading: rolesLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board/', fetcher)
    const [inputValue, setValue] = useState('')
    const [resultDisplay, setDisplay] = useState(Array)

    if (boardLoading || userLoading || userFullLoading || rolesLoading) {
        return <></>
    }
    const rolesElements = roles.map((role: UserRole) => <option value={role.id}>{role.name}</option>)

    async function handleSearch() {
        if (inputValue) {
            var response = await apiRequests._get('/api/users/' + inputValue + '/get_by_name/' + boardId + '/')
            var tmp = roles[0].id
            var result = response.map((element: any) => {
                return (
                    <div className="search__element">
                        <p className="search__text">{element.username + ' ' + element.first_name + ' ' + element.last_name}</p>
                        <select onChange={(e) => tmp = e.target.value} defaultValue={roles[0].id}>
                            {rolesElements}
                        </select>
                        <button onClick={() => handleAddMember(element, tmp)} className="search__add">Добавить</button>
                    </div>
                );
            })
            setDisplay(result)
        }
    }
    function handleAddMember(user: any, roleId: string) {
        if (roleId) {
            apiRequests._post('/api/user_boards/', {
                id_board: boardId,
                id_user_role: roleId,
                id_user: user.id,
                is_admin: false
            })

            window.location.reload()
        }
    }



    return (
        <div className="members__mainly place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <div className="header">
                <div className="members__header-content">
                    <div className="members__header-content-title">
                        <h1>Доска: {board.name}</h1>
                        <Link className="members__header-back" href={'/board/' + boardId + '/members/'}>Назад</Link>
                    </div>
                    <div>{userFull.first_name + ' ' + userFull.last_name}</div>
                </div>
                <div className="members__horizontal-line"></div>
            </div>
            <div className="search__body">
                <div className="search__input">
                    <input className="search__input-box" onChange={(e) => setValue(e.target.value)} />
                    <button className="search__button" onClick={() => handleSearch()}>Поиск</button>
                </div>
                <div className="search__result">
                    {resultDisplay}
                </div>
            </div>
        </div>
    );
}


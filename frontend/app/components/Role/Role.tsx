import useSWR from "swr";
import "./Role.css";
import { useParams } from "next/navigation";
import { fetcher } from "@/app/fetcher";
import { useEffect, useState } from "react";
import { apiRequests } from "@/app/apiRequests";
import RoleInfo from "./RoleInfo/RoleInfo";
import Link from "next/link";
interface DataProps {
    name: string,
    commenting: boolean
    deleting_ur_comment: boolean
    deleting_all_comment: boolean
    editing_ur_comment: boolean
    deleting_board: boolean
    editing_board: boolean
    creating_task: boolean
    editing_task: boolean
    deleting_task: boolean
    creating_block: boolean
    editing_block: boolean
    deleting_block: boolean
    creating_role: boolean
    editing_role: boolean
    deleting_role: boolean
    add_members: boolean,
    delete_members: boolean,
    edit_members: boolean,
}
export default function Role() {
    const boardId = useParams().boardId
    const { data: board, isLoading: boardLoading } = useSWR("/api/boards/" + boardId, fetcher)
    const { data: roles, isLoading: rolesLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board/', fetcher)
    const { data: user, isLoading: userLoading } = useSWR("/auth/users/me", fetcher);
    const { data: userFull, isLoading: userFullLoading } = useSWR("/api/users/" + user?.id, fetcher);
    const { data: role, isLoading: roleLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board_user/', fetcher);
    const [inputValue, setInputValue] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>();
    const [childData, setChildData] = useState<DataProps>();
    const [isUsed, setUsed] = useState<UserBoard>();

    if (boardLoading || rolesLoading || userLoading || userFullLoading || roleLoading) {
        return (
            <div className="role__mainly place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
                <div className="header">
                    <div className="role__header-content">
                        <h1>Доска:</h1>
                        <div></div>
                    </div>
                    <div className="role__horizontal-line"></div>
                </div>
                <div className="role__body">
                    <div className="role__body-list"></div>
                    <div className="role__body-form"></div>
                    <div className="role__body-footer"></div>
                </div>
            </div>
        );
    }
    const rolesDisplay = roles?.map((role: UserRole) => {
        return (
            <button className="role__body-list-element" onClick={() => setSelectedRole(role)}>
                {role.name}
            </button>
        );
    })

    function createRole() {
        if (inputValue) {
            apiRequests._post('/api/user_roles/', {
                name: inputValue,
                id_board: boardId,

            })
            window.location.reload()
        }
    }

    function handleSaveData() {
        if (childData || selectedRole) {
            console.log(childData)
            apiRequests._patch('/api/user_roles/' + selectedRole.id + '/', {
                name: childData.name,
                commenting: childData.commenting,
                deleting_ur_comment: childData.deleting_ur_comment,
                deleting_all_comment: childData.deleting_all_comment,
                editing_ur_comment: childData.editing_ur_comment,
                deleting_board: childData.deleting_board,
                editing_board: childData.editing_board,
                creating_task: childData.creating_task,
                editing_task: childData.editing_task,
                deleting_task: childData.deleting_task,
                creating_block: childData.creating_block,
                editing_block: childData.editing_block,
                deleting_block: childData.deleting_block,
                creating_role: childData.creating_role,
                editing_role: childData.editing_role,
                deleting_role: childData.deleting_role,
                add_members: childData.add_members,
                delete_members: childData.delete_members,
                edit_members: childData.edit_members,
                creating_status_task: false,
                editing_status_task: false,
                deleting_status_task: false,
            })

            window.location.reload()
        }
    }

    async function handleDeleteRole() {
        if (selectedRole) {
            var response = await getOwnerRole()

            if (response.id_user != null) {
                alert('Данная роль используется')
            }
            else {
                apiRequests._delete('/api/user_roles/' + selectedRole.id + '/')
                window.location.reload()
            }

        }
    }

    async function getOwnerRole() {
        if (selectedRole) {
            var response = await apiRequests._get('/api/user_boards/' + selectedRole.id + '/get_by_id_role/') //.then((result: any) => {

            return response
        }
    }


    function handleChildData(data: any) {
        setChildData(data)
        return data
    }

    return (
        <div className={`role__mainly place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]`}>
            <div className="header">
                <div className="role__header-content">
                    <div className="role__header-content-title">
                        <h1>Доска: {board.name}</h1>
                        <Link className="role__header-back" href={'/board/' + boardId}>Назад</Link>
                    </div>
                    <div>{userFull.first_name + ' ' + userFull.last_name}</div>
                </div>
                <div className="role__horizontal-line"></div>
            </div>
            <div className="role__body">
                <div className="role__body-list">
                    {rolesDisplay}
                </div>
                <div className="role__body-form">
                    <RoleInfo roleId={selectedRole} onGetData={handleChildData} />
                </div>
                <div className="role__body-footer">
                    <div className="role__body-footer-left">
                        <input className={`role__body-footer-input ${role.creating_role ? 'active' : ''}`} onChange={(e) => setInputValue(e.target.value)}></input>
                        <button className={`role__body-footer-add ${role.creating_role ? 'active' : ''}`} onClick={() => createRole()}>Добавить</button>
                    </div>

                    <div className="role__body-footer-right">
                        <button onClick={() => handleDeleteRole()} className={`role__body-footer-delete ${role.deleting_role ? 'active' : ''}`}>Удалить </button>
                        <button onClick={() => handleSaveData()} className={`role__body-footer-save ${role.editing_role ? 'active' : ''}`}>Сохранить </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

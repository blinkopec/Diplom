'use client'

import { apiRequests } from "@/app/apiRequests";
import { fetcher } from "@/app/fetcher";
import useSWR from "swr";

export default function MemberField({ userBoard, editing, deleting, roles, is_admin }: {
    userBoard: UserBoard, editing: boolean,
    deleting: boolean, roles: Array<UserRole>,
    is_admin: boolean
}) {
    const { data: user, isLoading } = useSWR("/api/users/" + userBoard.id_user, fetcher)
    const role = roles.find(role => role.id === userBoard.id_user_role)
    const rolesElements = roles.map(role => <option value={role.id}>{role.name}</option>)

    if (isLoading) {
        return (
            <div></div>
        )
    }

    function handleChangeRole(roleId :string) {
        apiRequests._patch('/api/user_boards/' + userBoard.id + '/', {
            id_user_role: roleId
        })
        window.location.reload()
    }
    
    function handleDeleteMember() {
        apiRequests._delete('/api/user_boards/' + userBoard.id + '/')
        window.location.reload()
    }

    function checkPermissionsDelete() {
        if (is_admin) {
            return true
        }
        if (deleting) {
            return true
        }
        return false
    }
    function checkPermissionsEdit() {
        if (is_admin) {
            return false
        }
        if (editing) {
            return false
        }
        return true
    }
    return (
        <div className="member__field">
            <p>{user.username + ' ' + user.first_name + ' ' + user.last_name}</p>
            <select onChange={(e) => {handleChangeRole(e.target.value)}} defaultValue={role?.id} disabled={checkPermissionsEdit()}>
                {rolesElements}
            </select>
            <button onClick={() => {handleDeleteMember()}} className={`member__field-button ${checkPermissionsDelete() ? 'active' : ''}`} >Исключить</button>
        </div>
    );
}
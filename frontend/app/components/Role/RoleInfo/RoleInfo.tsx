import { fetcher } from "@/app/fetcher";
import useSWR from "swr";
import "./RoleInfo.css"
import { useEffect, useState } from "react";

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

export default function RoleInfo({ roleId, onGetData }: { roleId: UserRole, onGetData: (data: DataProps) => void }) {
    if (!roleId) {
        return <></>
    }

    const [state, setState] = useState<DataProps>({
        name: '',
        commenting: false,
        deleting_ur_comment: false,
        deleting_all_comment: false,
        editing_ur_comment: false,
        deleting_board: false,
        editing_board: false,
        creating_task: false,
        editing_task: false,
        deleting_task: false,
        creating_block: false,
        editing_block: false,
        deleting_block: false,
        creating_role: false,
        editing_role: false,
        deleting_role: false,
        add_members: false,
        delete_members: false,
        edit_members: false,
    });

    useEffect(() => {
        if (roleId) {
            setState({
                name: roleId.name || '',
                commenting: roleId.commenting || false,
                deleting_all_comment: roleId.deleting_all_comment || false,
                deleting_ur_comment: roleId.deleting_ur_comment || false,
                editing_ur_comment: roleId.editing_ur_comment || false,
                deleting_board: roleId.deleting_board || false,
                editing_board: roleId.editing_board || false,
                creating_task: roleId.creating_task || false,
                editing_task: roleId.editing_task || false,
                deleting_task: roleId.deleting_task || false,
                creating_block: roleId.creating_block || false,
                editing_block: roleId.editing_block || false,
                deleting_block: roleId.deleting_block || false,
                creating_role: roleId.creating_role || false,
                editing_role: roleId.editing_role || false,
                deleting_role: roleId.deleting_role || false,
                add_members: roleId.add_members || false,
                delete_members: roleId.delete_members || false,
                edit_members: roleId.edit_members || false,
            })
        }
    }, [roleId]);
    function updateField(fieldName: keyof DataProps, value: any) {
        setState(prevState => ({
            ...prevState,
            [fieldName]: value
        }))
    }

    console.log(state)
    useEffect(() => {
        onGetData(state);
    }, [state, onGetData])
    // TODO: проверка на разщрешение изменение роли

    return (
        <div >
            <div className="role-info__header">
                <p>Выбрана роль: </p>
                <input className="role-info__header-input" value={state.name} onChange={(e) => updateField('name', e.target.value)} />
            </div>

            <div className="role-info__body">
                <div className="role-info__body-element">
                    <p>Комментирование</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.commenting} onChange={(e) => updateField('commenting', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление своих комметариев</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_ur_comment} onChange={(e) => updateField('deleting_ur_comment', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление всех комментариев</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_all_comment} onChange={(e) => updateField('deleting_all_comment', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование своих комментариев</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.editing_ur_comment} onChange={(e) => updateField('editing_ur_comment', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление доски</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_board} onChange={(e) => updateField('deleting_board', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование доски</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.editing_board} onChange={(e) => updateField('editing_board', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Создание задач</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.creating_task} onChange={(e) => updateField('creating_task', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование задач</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.editing_task} onChange={(e) => updateField('editing_task', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление задач</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_task} onChange={(e) => updateField('deleting_task', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Создание блоков</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.creating_block} onChange={(e) => updateField('creating_block', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование блоков</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.editing_block} onChange={(e) => updateField('editing_block', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление блоков</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_block} onChange={(e) => updateField('deleting_block', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Создание ролей</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.creating_role} onChange={(e) => updateField('creating_role', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование ролей</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.editing_role} onChange={(e) => updateField('editing_role', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление ролей</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.deleting_role} onChange={(e) => updateField('deleting_role', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Добавление участников</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.add_members} onChange={(e) => updateField('add_members', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Удаление участников</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.delete_members} onChange={(e) => updateField('delete_members', e.target.checked)} />
                </div>
                <div className="role-info__body-element">
                    <p>Редактирование участников</p>
                    <input className="role-info__body-element-box" type="checkbox" checked={state.edit_members} onChange={(e) => updateField('edit_members', e.target.checked)} />
                </div>
            </div>
        </div>

    );
}


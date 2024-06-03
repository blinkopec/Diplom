import { apiRequests } from "@/app/apiRequests";
import { fetcher } from "@/app/fetcher";
import { use, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { useOutsideClick } from "@/app/components/useClickOutside";
import './MenuActionsTask.css';

export default function MenuActionsTask({ task }: { task: any }) {
    const [isOpen, setOpen] = useState(false);


    const { data: userBoard, isLoading: isLoadingUserBoard } = useSWR('/api/user_boards/' + task.id + '/get_by_id_task/', fetcher);
    const { data: role, isLoading: isLoacdingTask } = useSWR('/api/user_roles/' + task.id + '/get_by_id_task/', fetcher);
    const [inputValue, setInputValue] = useState('');
    const [isRename, setRename] = useState(false);

    const menuRef = useOutsideClick(() => {
        if (isOpen) setTimeout(() => setOpen(false), 50)
    })

    function deleteClick() {
        apiRequests._delete('/api/tasks/' + task.id + '/');
        window.location.reload();
    }
    const expandInput = (value: boolean) => {
        console.log('asd')
        setRename(value)
        setOpen(false)
        setInputValue(task.text)
    }

    function editClick() {
        if (inputValue) {
            const response = apiRequests._patch('/api/tasks/' + task.id + '/', { text: inputValue })
            window.location.reload();
        }
    }


    if (isLoacdingTask || isLoadingUserBoard) {
        return <></>
    }

    var deleteItem = false;
    var editItem = false;
    const activeMenu = role.editing_task || role.deleting_task || userBoard[0].is_admin;
    if (userBoard[0].is_admin) {
        deleteItem = true;
        editItem = true;
    }
    else {
        if (role.deleting_task) {
            deleteItem = true;
        }
        if (role.editing_task) {
            editItem = true;
        }
    }
    return (
        <div className={`menu1 ${activeMenu ? "active" : ""}`}>
            <button onClick={() => setOpen(!isOpen)}>
                <Image src="/menu-icon.png"
                    width={25}
                    height={25}
                    alt="menu" />
            </button>

            <nav className={`menu__nav ${isOpen ? "active" : ""}`} ref={menuRef}>
                <ul >
                    <li className={`menu__item ${editItem ? "active" : ""}`} >
                        <button className={`menu__button ${isOpen ? "active" : ""}`} onClick={() => expandInput(true)}>
                            <h3>Изменить</h3>
                        </button>
                    </li>
                    <li className={`menu__item ${deleteItem ? "active" : ""}`}>
                        <button onClick={() => deleteClick()} className={`menu__button ${isOpen ? "active" : ""}`}>
                            <h3>Удалить</h3>
                        </button>
                    </li>
                </ul>
            </nav>

            <div className={`menu__input ${isRename ? "active" : ""}`}>
                <input name="nameBoard" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="menu__input-box"></input>
                <button onClick={() => expandInput(false)} className="menu__input-close">
                    <Image src='/close.png'
                        width={20}
                        height={20}
                        alt="close"
                    />
                </button>
                <button onClick={() => editClick()} className="menu__input-check">
                    <Image src='/check.png'
                        width={20}
                        height={20}
                        alt="check"
                    />
                </button>
            </div>
        </div>
    );
}
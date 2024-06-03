import { useState } from 'react';
import './MenuActionsBlock.css';
import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import { apiRequests } from '@/app/apiRequests';
import { useOutsideClick } from '@/app/components/useClickOutside';
import Image from 'next/image';

export default function MenuActionsBlock({ block }: { block: Block }) {
    const [isOpen, setOpen] = useState(false);


    const { data: userBoard, isLoading: isLoadingUserBoard } = useSWR('/api/user_boards/' + block.id + '/get_by_id_block/', fetcher);
    const { data: role, isLoading: isLoacdingRole } = useSWR('/api/user_roles/' + block.id + '/get_by_id_block/', fetcher);
    const [inputValue, setInputValue] = useState('');
    const [isRename, setRename] = useState(false);

    const menuRef = useOutsideClick(() => {
        if (isOpen) setTimeout(() => setOpen(false), 50)
    })

    function deleteClick() {
        apiRequests._delete('/api/blocks/' + block.id + '/');
        window.location.reload();
    }
    const expandInput = (value: boolean) => {
        console.log('asd')
        setRename(value)
        setOpen(false)
        setInputValue(block.name)
    }

    function editClick() {
        if (inputValue) {
            const response = apiRequests._patch('/api/blocks/' + block.id + '/', { name: inputValue })
            window.location.reload();
        }
    }


    if (isLoacdingRole || isLoadingUserBoard) {
        return <></>
    }

    var deleteItem = false;
    var editItem = false;
    const activeMenu = role.editing_task || role.deleting_task || userBoard.is_admin;
    if (userBoard.is_admin) {
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
        <div className={`menu-block ${activeMenu ? "active" : ""}`}>
            <button onClick={() => setOpen(!isOpen)}>
                <Image src="/menu-icon.png"
                    width={25}
                    height={25}
                    alt="menu" />
            </button>

            <nav className={`menu-block__nav ${isOpen ? "active" : ""}`} ref={menuRef}>
                <ul >
                    <li className={`menu-block__item ${editItem ? "active" : ""}`} >
                        <button className={`menu-block__button ${isOpen ? "active" : ""}`} onClick={() => expandInput(true)}>
                            <h3>Изменить</h3>
                        </button>
                    </li>
                    <li className={`menu-block__item ${deleteItem ? "active" : ""}`}>
                        <button onClick={() => deleteClick()} className={`menu-block__button ${isOpen ? "active" : ""}`}>
                            <h3>Удалить</h3>
                        </button>
                    </li>
                </ul>
            </nav>

            <div className={`menu-block__input ${isRename ? "active" : ""}`}>
                <input name="nameBoard" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="menu-block__input-box"></input>
                <button onClick={() => expandInput(false)} className={`menu-block__input-close ${isRename ? "active" : ""}`}>
                    <Image src='/close.png'
                        width={20}
                        height={20}
                        alt="close"
                    />
                </button>
                <button onClick={() => editClick()} className={`menu-block__input-check ${isRename ? "active" : ""}`}>
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
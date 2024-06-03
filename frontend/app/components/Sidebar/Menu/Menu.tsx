import { useState } from "react";
import { useOutsideClick } from "@/app/components/useClickOutside";
import { apiRequests } from "@/app/apiRequests";
import Image from "next/image";
import Link from "next/link";
import "./styles.css";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";

type Board = {
    id: number,
    name: string,
}
export default function Menu({board,admin}: {board:Board,admin:boolean}) {
    const [isOpen, setOpen] = useState(false);
    const [isRename, setRename] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { data: userBoard} = useSWR('/api/user_boards/' + board.id + '/get_user_board_of_user/', fetcher)

    const menuRef = useOutsideClick(() => {
        if (isOpen) setTimeout(() => setOpen(false), 50)
    })

    const editBoard = async (board: Board) => {
        const response = apiRequests._patch('/api/boards/' + board.id + '/', { name: inputValue })
        window.location.reload();
    }

    const deleteBoard = async (board: Board) => {
        if (admin) {
            apiRequests._delete('/api/boards/' + board.id + '/');
        }
        else {
            apiRequests._delete('/api/user_boards/' + userBoard?.id + '/');
        }
        
        window.location.reload();
    }

  
    const expandInput = (value: boolean) => {
        setRename(value)
        setOpen(false)
        setInputValue(board.name)
    }

    return (
        <>
            <Link href={`/board/${board.id}`}>{board.name}</Link>
            <button onClick={() => setOpen(!isOpen)}>
                <Image src={'/menu-icon.png'}
                    width={25}
                    height={25}
                    alt="menu" />
            </button>
            <nav className={`menu ${isOpen ? "active" : ""}`} ref={menuRef}>
                <ul className="menu__list">
                    <li>
                        <button onClick={() => expandInput(true)}>
                            <h3>Изменить</h3>
                        </button>
                    </li>
                    <li>

                        <button onClick={() => deleteBoard(board)}>
                            <h3>{admin ? "Удалить" : "Покинуть"}</h3>
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
                <button onClick={() => editBoard(board)} className="menu__input-check">
                    <Image src='/check.png'
                        width={20}
                        height={20}
                        alt="check"
                    />
                </button>
            </div>
        </>
    )
}

import { useState } from "react";
import { useOutsideClick } from "@/app/components/useClickOutside";
import { apiRequests } from "@/app/apiRequests";
import Image from "next/image";
import "./styles.css"


export default function AddBoardButton() {
    const [isOpen, setOpen] = useState(false);
    const [isActive, setActive] = useState(true);
    const [inputValue, setInputValue] = useState('');


    const inputRef = useOutsideClick(() => {
        if (isOpen) setTimeout(() => { setOpen(false); setActive(true) }, 50)
    })

    const createBoard = async () => {
        const response = await apiRequests._post('/api/boards/', { name: inputValue })
        window.location.reload();
    }
    const expandInput = () => {
        setActive(false)
        setOpen(true)
        setInputValue('')
    }

    return (
        <div>
            <button onClick={expandInput} className={`add-board ${isActive ? "active" : ""}`}>
                <Image src='/plus-icon.png'
                    width={15}
                    height={15}
                    alt="Plus icon"
                />
            </button>

            <div className={`input__board ${isOpen ? "active" : ""}`} ref={inputRef}>
                <input name="nameBoard" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input__box"></input>
                <button onClick={() => createBoard()}>
                    <Image src='/add-icon.png'
                        width={25}
                        height={25}
                        alt="create board "
                    />
                </button>
            </div>
        </div>
    )
}
import { apiRequests } from "@/app/apiRequests"
import Image from "next/image"
import { useState } from "react"
import './AddTaskButton.css'

export default function AddTaskButton({ blockId }: { blockId: number }) {
    const [isOpen, setOpen] = useState(false)
    const [isInput, setInput] = useState(false)
    const [insertValue, setInsertValue] = useState("")


    function addTask() {
        if (insertValue) {
            apiRequests._post('/api/tasks/', {
                "text": insertValue,
                "id_block": blockId,
                "id_status_task": 2, 
                "date": null,
            })
            window.location.reload()
        }
    }

    return (
        <div >
            <button onClick={() => setOpen(true)}>
                <Image src='/plus-icon.png'
                    width={17}
                    height={17}
                    alt="add task" />
            </button>
            <nav className={`add-task__insert-menu ${isOpen ? "active" : ""}`}>
                <input className="add-task__insert-menu__insert-box" onChange={(e) => setInsertValue(e.target.value)} />
                <button className={`add-task__insert-menu__cancel-button ${isOpen ? "active" : ""}`} onClick={() => setOpen(false)}>
                    <Image
                        src='/close.png'
                        width={15}
                        height={15}
                        alt="close"
                    />
                </button>
                <button className={`add-task__insert-menu__cancel-button ${isOpen ? "active" : ""}`} onClick={() => addTask()}>
                    <Image
                        src='/check.png'
                        width={15}
                        height={15}
                        alt="check"
                    />
                </button>
            </nav>
        </div>
    )
}
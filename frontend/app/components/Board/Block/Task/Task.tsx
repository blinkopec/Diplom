import MenuActionsTask from "./MenuActionsTask/MenuActionsTask";
import "./styles.css"
import Image from "next/image";
import StatusTask from "./StatusTask/StatusTask";
import { apiRequests } from "@/app/apiRequests";
import ModalTask from "./ModalTask/ModalTask";
import { useState } from "react";
import ModalEdit from "./ModalTask/ModalEdit";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useParams } from "next/navigation";

export default function Task({ task, block }: { task: Task, block: Block }) {

    const [isOpen, setOpen] = useState(false)
    const [isOpenEdit, setOpenEdit] = useState(false)
    const boardId = useParams().boardId
    const { data: role, isLoading: roleLoading } = useSWR("/api/user_roles/" + boardId + '/get_by_id_board_user/', fetcher);
    if (roleLoading)    {
        return <></>
    }
    const updateField = (open: boolean, edit: boolean) => {
        setOpen(open)
        setOpenEdit(edit)
      };

    function dragStartHandler(e: any, task: Task, block: Block) {
        var t = JSON.stringify(task);
        e.dataTransfer.setData("task", t);

        var b = JSON.stringify(block);
        e.dataTransfer.setData("block", b);
    }

    function handleDragDrop(e: any) {
        var b = JSON.parse(e.dataTransfer.getData("block"));
        var t = JSON.parse(e.dataTransfer.getData("task"));
        if (b.id == block.id) {
            var perviousPosition = t.position
            apiRequests._patch("/api/tasks/" + t.id + "/", { position: task.position })
            apiRequests._patch("/api/tasks/" + task.id + "/", { position: perviousPosition })

            window.location.reload()
        }
        else {
            e.preventDefault()
        }


    }

 
    return (
        <div className="task" draggable={true} onDragStart={(e) => dragStartHandler(e, task, block)}
            onDrop={(e) => handleDragDrop(e)}>
            <div className="task__header">
                <button className="task__tittle" onClick={() => setOpen(true)}>
                    <div className="task__status">
                        <StatusTask id_status_task={task.id_status_task} />
                        <h1>{task.text}</h1>
                    </div>

                    <MenuActionsTask task={task} />
                </button>
                <div className="task__line" />
            </div>
            <ModalTask editing={role.editing_task} open={isOpen} task={task} setOpen={updateField} />
            <ModalEdit open={isOpenEdit} task={task} setOpen={updateField} />
            <div className="task__body">
                <p className="task__description">
                    {task.description}
                </p>
                <p className="task__date">
                    {typeof task.date === 'object'
                        && task.date instanceof Date
                        ? task.date.toLocaleDateString() : task.date}
                </p>
            </div>
        </div>
    );
}

import MenuActionsTask from "./MenuActionsTask/MenuActionsTask";
import "./styles.css"
import Image from "next/image";
import StatusTask from "./StatusTask/StatusTask";

export default function Task({ task }: { task: Task }) {

    

    return (
                <div className="task" draggable={true} >
                    <div className="task__header">
                        <div className="task__tittle">
                            <div className="task__status">
                                <StatusTask id_status_task={task.id_status_task} />
                                <h1>{task.text}</h1>
                            </div>

                            <MenuActionsTask task={task} />
                        </div>
                        <div className="task__line" />
                    </div>

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

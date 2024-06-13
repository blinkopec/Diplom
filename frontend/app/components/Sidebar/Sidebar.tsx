import useSWR, { mutate } from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";
import '@/app/components/Sidebar/styles.css'
import AddBoardButton from "./AddBoardButton/AddBoardButton";
import Menu from "./Menu/Menu";

type Board = {
    id: number,
    name: string,
}
export default function Sidebar({ user }: { user: any }) {
    if (!user) {
        return (
            <></>
        )
    }
    const router = useRouter();
    const { data: usersBoards } = useSWR("/api/boards/get_users_boards", fetcher);
    const { data: userInBoards } = useSWR("/api/boards/get_user_in_boards", fetcher);
    
    if (!usersBoards || !userInBoards) {
        return (
            <div></div>
        )
    }
   

    if (usersBoards.length <= 0 && userInBoards.length <= 0) {
        return (
            <>
                <AddBoardButton />
                <div>У вас нет досок</div>

            </>
        )
    }

    var boardListTmp = null;
    if (userInBoards.length > 0) {
        
        boardListTmp = userInBoards.map((board: any) => {
         
            return (
                <div className="sidebar__columns">
                    <Menu board={board} admin={false} />
                </div>
            )
        })
    }


    var adminBoardListTmp = null;
    if (usersBoards.length > 0) {

        adminBoardListTmp = usersBoards.map((board: Board) => {
            return (
                <div className="sidebar__columns">
                    <Menu admin={true}  board={board} />

                </div>
            )
        })
    }

    const boardList = (
        <div>
            <h2>Доски, в которых вы состоите:</h2>
            <div className="boards">
                {boardListTmp}
            </div>

        </div>
    )

    const adminBoardList = (
        <div>
            <h2>Ваши доски:</h2>
            <div className="boards">
                {adminBoardListTmp}
            </div>
        </div>
    )

    if (usersBoards.length <= 0 && userInBoards.length > 0) {

        return (
            <div>
                <AddBoardButton />
                <div className="sidebar__body">
                    {boardList}
                </div>
            </div>
        )
    }
    
    if (usersBoards.length > 0 && userInBoards.length <= 0) {
        return (
            <div>
                <AddBoardButton />

                <div className="sidebar__body">
                    {adminBoardList}
                </div>


            </div>
        );
    }
    return (
        <div>
            <AddBoardButton />
            <div className="sidebar__body">
                {adminBoardList}
                {boardList}
            </div>


        </div>
    );
}





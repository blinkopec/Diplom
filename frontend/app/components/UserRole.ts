type UserRole = {
    id: number,
    name: string,
    id_board: number,

    add_members: boolean,
    delete_members: boolean,
    edit_members: boolean,

    commenting: boolean,
    deleting_all_comment: boolean,
    deleting_ur_comment: boolean,
    editing_ur_comment: boolean,
    creating_task: boolean,
    deleting_task: boolean,
    editing_task : boolean,
    editing_board : boolean,
    deleting_board : boolean,
    creating_block : boolean,
    editing_block : boolean,
    deleting_block : boolean,
    creating_status_task: boolean,
    editing_status_task: boolean,
    deleting_status_task: boolean,
    creating_role : boolean,
    editing_role : boolean,
    deleting_role : boolean,

}
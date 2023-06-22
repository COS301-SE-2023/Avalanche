export default interface ICreateUserGroupRequest {
    name: string,
    description: string,
    permisssion: number //1 = admin, 2 = other
}
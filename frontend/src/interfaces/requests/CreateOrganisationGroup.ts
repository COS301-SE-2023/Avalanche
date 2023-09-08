export default interface ICreateUserGroupRequest {
    name: string,
    permission: number //1 = admin, 2 = other
}
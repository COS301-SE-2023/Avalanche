export default interface ICreateUserGroupRequest {
    name: string,
    description: string,
    permission: number //1 = admin, 2 = other
}
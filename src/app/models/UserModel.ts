export class UserModel{
    
    id!:number
    FullName!:string
    userName!:string
    adress!:string
    Email!:string
    phone!:string
    PasswordHash!:string
    Role:string='client'
}
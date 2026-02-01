export class GiftModel{
    id!:number
    name!:string
    donorId!:number
    price:number=20
    category:string="All_prizes"
    // Purchases=[]
    // purchasersCount!:number
    
    image: string="1";
}


export enum Category{
     
     All_prizes,

    Vehicles,

    Home_and_Family,

    Gifts_for_Women,

    Gifts_for_Men,

    Tourism_and_Vacations,

    Kids_Shopping,

    Beauty_and_Personal_Care,

    Electrical_Appliances,
}


export class GiftModel {
    id!: number
    name!: string
    donorId!: number
    price: number = 20
    category: string = "All_prizes"
    donorName!: string
    isLocked: boolean = false
    image: string = "1"
    quantity: number = 1
    winners?: string[]
    PurchasersCount?: number 
}


export enum Category {

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


import { GiftModel } from "./GiftModel";

export class DonorModel {
    id!: number
    name!: string
    email!: string
    giftList?: any[];
}
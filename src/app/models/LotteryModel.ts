export class LotteryModel {

    GiftId!: number
    UserId !: number
    user!: {
        userName: string;
    };
    lotteryDate!: Date;
    Quantity: number = 1;
}
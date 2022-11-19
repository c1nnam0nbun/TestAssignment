

export class Subscription {
    readonly subscriber: number
    readonly target: number

    constructor(subscriber: number, target: number) {
        this.subscriber = subscriber;
        this.target = target;
    }
}
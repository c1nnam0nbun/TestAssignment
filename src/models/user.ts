export class User {
    readonly id: number
    readonly gender: string
    readonly firstName: string

    constructor(id: number, gender: string, firstName: string) {
        this.id = id
        this.gender = gender
        this.firstName = firstName
    }
}
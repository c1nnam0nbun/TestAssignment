import * as dotenv from 'dotenv'
import axios from 'axios'
import {User} from "../models/user";
import assert from "assert";
import {Database} from "./database";
import {UsersDatabase} from "./users";
import {SubscriptionsDatabase} from "./subscriptions";
import {Subscription} from "../models/subscription";

dotenv.config()

const userCount = 200
const maxSubscriptions = 150

const getUsers = async () => {
    type UserResult = {
        gender: string,
        name: {
            title: string,
            first: string,
            last: string
        }
    }
    const res = await axios.get(`https://randomuser.me/api/?inc=gender,name&results=${userCount}`)
    const userData = res.data.results as UserResult[]
    return userData.map((data, i) => new User(i + 1, data.gender, data.name.first))
}

const seed = async () => {
    await Database.executeWithoutForeignKeyCheck(
        UsersDatabase.clearTable,
        SubscriptionsDatabase.clearTable,
        UsersDatabase.createTable,
        SubscriptionsDatabase.createTable,
    )

    const users = await getUsers()
    await UsersDatabase.addUsers(users)
    console.log(`Inserted ${users.length} rows into USERS table...`)

    const subscriptions = new Map<User, User[]>()

    for (const user of users) {
        const subscriptionCount = Math.floor(Math.random() * maxSubscriptions)
        for (let i = 0; i < subscriptionCount; i++) {
            let target: User
            do {
                const index = Math.floor(Math.random() * users.length)
                target = users[index]
                if (!subscriptions.has(user)) {
                    subscriptions.set(user, [])
                }
            } while (subscriptions.get(user)!.includes(target) || user === target)
            subscriptions.get(user)!.push(target)
        }
    }

    //Assert that users do not have repeating subscriptions
    users.forEach(user => {
        if (!subscriptions.has(user)) return
        assert(subscriptions.get(user)!.length === subscriptions.get(user)!.filter((v, i, a) => a.indexOf(v) === i).length)
    })

    await SubscriptionsDatabase.addSubscriptions(users.flatMap(user => subscriptions.get(user)!.map(target => new Subscription(user.id, target.id))))

    await Database.close()
}

seed().catch(err => console.error(err))
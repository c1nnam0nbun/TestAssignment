import express from "express";
import {User} from "../../models/user";
import {UsersDatabase} from "../../db/users";
import {SubscriptionsDatabase} from "../../db/subscriptions";

const router = express.Router()

router.get('/', async (req, res) => {
    const userResult = await UsersDatabase.getAllUsers()
    const users = userResult.map(data => new User(data.id, data.gender, data.firstName))

    const result = await SubscriptionsDatabase.getAllSubscriptions()

    const subscriptions = new Map<User, User[]>()

    for (const res of result) {
        const user = users[res.subscriber - 1]
        if (!subscriptions.has(user)) subscriptions.set(user, [])
        subscriptions.get(user)!.push(users[res.target - 1])
    }

    res.send(users.map(user => {
        return {user, subscriptions: subscriptions.get(user)}
    }))
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id <= 0) return res.status(301).send()

    const userResult = await UsersDatabase.getUserById(id)
    const users = userResult.map(user => new User(user.id, user.gender, user.firstName))

    let orderCriteria: string | undefined

    if (req.query.order_by) {
        switch (req.query.order_by) {
            case 'id': orderCriteria = 'ID'; break
            case 'name': orderCriteria = 'NAME'; break
            case 'gender': orderCriteria = 'GENDER'; break
        }
    }

    let orderType: string = 'ASC'

    if (req.query.order_type) {
        switch (req.query.order_type) {
            case 'asc': orderType = 'ASC'; break
            case 'desc': orderType = 'DESC'; break
        }
    }

    const friends = await UsersDatabase.getFriends(id, orderCriteria, orderType)

    res.send({
        user: users[0],
        friends: friends.map(user => new User(user.id, user.gender, user.firstName))
    })
})

export const userRoutes = router
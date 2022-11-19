import express from "express";
import {User} from "../models/user";
import {UsersDatabase} from "../db/users";

const router = express.Router()

router.get('/not-following', async (req, res) => {
    const users = await UsersDatabase.getUsersWithoutSubscriptions()
    res.send(users.map(user => new User(user.id, user.gender, user.firstName)))
})

router.get('/max-following', async (req, res) => {
    const users = await UsersDatabase.getUsersWithMaxSubscriptions()
    res.send(users.map(user => new User(user.id, user.gender, user.firstName)))
})

export const baseRoutes = router
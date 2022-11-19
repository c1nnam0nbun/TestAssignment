import {Database} from "./database";
import {User} from "../models/user";

export class UsersDatabase extends Database {

    static async createTable() {
        await Database.execute(`
            CREATE TABLE IF NOT EXISTS USERS(
                ID INT NOT NULL AUTO_INCREMENT,
                NAME VARCHAR(30) NOT NULL,
                GENDER VARCHAR(6) NOT NULL,
                PRIMARY KEY (ID)
            );
        `)
    }

    static async clearTable() {
        await Database.execute(`TRUNCATE TABLE USERS;`)
    }

    static async addUser(user: User) {
        await Database.execute(`INSERT INTO USERS(NAME, GENDER) VALUES ('${user.firstName}', '${user.gender}');`)
    }

    static async addUsers(users: User[]) {
        const userValues = users.map(user => `('${user.firstName}', '${user.gender}')`).join()
        await Database.execute(`INSERT INTO USERS(NAME, GENDER) VALUES ${userValues};`)
    }

    static async getAllUsers(): Promise<User[]> {
        return await Database.execute<User>(`SELECT ID as id, NAME as firstName, GENDER as gender FROM USERS ORDER BY ID`)
    }

    static async getUserById(id: number): Promise<User[]> {
        return await UsersDatabase.execute(`SELECT ID as id, NAME as firstName, GENDER as gender FROM USERS WHERE ID = ${id}`)
    }

    static async getFriends(id: number, orderBy: string | undefined, order: string = 'ASC'): Promise<User[]> {
        return await Database.execute(`
            SELECT TARGET.ID as id, TARGET.NAME as firstName, TARGET.GENDER as gender
            FROM USERS 
            INNER JOIN SUBSCRIPTIONS ON SUBSCRIPTIONS.SUBSCRIBER = USERS.ID
            INNER JOIN USERS TARGET ON SUBSCRIPTIONS.TARGET = TARGET.ID
            WHERE USERS.ID = ${id} AND TARGET.ID IN (SELECT SUBSCRIBER as userId FROM SUBSCRIPTIONS WHERE TARGET = ${id})
            ${orderBy ? `ORDER BY TARGET.${orderBy} ${order}` : ""}
        `)
    }

    static async getUsersWithMaxSubscriptions(): Promise<User[]> {
        return await Database.execute(`
            SELECT USERS.ID as id, NAME as firstName, GENDER as gender, COUNT(SUBSCRIBER) as subCount 
            FROM USERS 
            INNER JOIN SUBSCRIPTIONS ON SUBSCRIBER = USERS.ID 
            GROUP BY USERS.ID 
            ORDER BY subCount DESC 
            LIMIT 5
        `)
    }

    static async getUsersWithoutSubscriptions(): Promise<User[]> {
        return await Database.execute(`
            SELECT ID as id, NAME as firstName, GENDER as gender FROM USERS WHERE ID NOT IN (SELECT SUBSCRIBER FROM SUBSCRIPTIONS)
        `)
    }
}
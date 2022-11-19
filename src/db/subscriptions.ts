import {Database} from "./database";
import {Subscription} from "../models/subscription";

export class SubscriptionsDatabase extends Database {

    static async createTable() {
        await Database.execute(`
            CREATE TABLE IF NOT EXISTS SUBSCRIPTIONS(
                ID INT NOT NULL AUTO_INCREMENT,
                SUBSCRIBER INT NOT NULL,
                TARGET INT NOT NULL,
                PRIMARY KEY (ID),
                CONSTRAINT FK_SUBSCRIBER FOREIGN KEY (SUBSCRIBER) REFERENCES USERS(ID),
                CONSTRAINT FK_TARGET FOREIGN KEY (TARGET) REFERENCES USERS(ID)
                ON DELETE CASCADE  
                ON UPDATE CASCADE
            );
        `)
    }

    static async clearTable() {
        await Database.execute(`TRUNCATE TABLE SUBSCRIPTIONS;`)
    }

    static async addSubscription(subscription: Subscription) {
        await Database.execute(`INSERT INTO SUBSCRIPTIONS(SUBSCRIBER, TARGET) VALUES (${subscription.subscriber}, ${subscription.target});`)
    }

    static async addSubscriptions(subscriptions: Subscription[]) {
        const subscriptionValues = subscriptions.map(sub => `(${sub.subscriber}, ${sub.target})`).join()
        await Database.execute(`INSERT INTO SUBSCRIPTIONS(SUBSCRIBER, TARGET) VALUES ${subscriptionValues};`)
    }

    static async getAllSubscriptions(): Promise<Subscription[]> {
        return await Database.execute(`
            SELECT USERS.ID as id, TARGET as targetId 
            FROM USERS 
            INNER JOIN SUBSCRIPTIONS ON SUBSCRIPTIONS.SUBSCRIBER = USERS.ID
            ORDER BY ID
        `)
    }
}
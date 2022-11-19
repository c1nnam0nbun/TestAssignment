import mysql from "mysql2/promise";

export class Database {
    private static connection: mysql.Connection

    static async initialize() {
        const DB_HOST = this.getEnvVariable("DB_HOST")
        const DB_PORT = this.getEnvVariable("DB_PORT")
        const DB_PASS = this.getEnvVariable("DB_PASS")
        const DB_NAME = this.getEnvVariable("DB_NAME")
        const DB_USER = this.getEnvVariable("DB_USER")

        try {
            this.connection = await mysql.createConnection({
                host: DB_HOST,
                user: DB_USER,
                port: +DB_PORT,
                database: DB_NAME,
                password: DB_PASS,
            })
        } catch (err) {
            console.error(`Failed to connect to database: \n${(err as Error).stack}`)
            process.exit(-1)
        }
    }

    static async execute<T = mysql.RowDataPacket>(query: string): Promise<T[]> {
        if (Database.connection === undefined) await Database.initialize()

        try {
            const [result] = await Database.connection.execute(query)
            return result as T[]
        } catch (e) {
            console.error(e)
        }
        return []
    }

    static async close() {
        if (Database.connection === undefined) return
        await this.connection.end()
    }

    private static getEnvVariable(variable: string) {
        const envVar = process.env[variable]
        if (envVar) return envVar
        console.error(`${variable} environmental variable must be defined`)
        process.exit(-1)
    }

    static readonly executeWithoutForeignKeyCheck = async (...queries: (() => Promise<void>)[]) => {
        await Database.execute(`SET FOREIGN_KEY_CHECKS = 0;`)
        for (const query of queries) await query()
        await Database.execute(`SET FOREIGN_KEY_CHECKS = 1;`)
    }

    protected constructor() {}
}
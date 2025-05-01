import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { solicitation, type SolicitationInsert } from '@repo/database/src/schema/solicitation';
import { eq, or, ilike } from 'drizzle-orm';

export class DatabaseService {
    private db;

    constructor() {
        const pool = new Pool({
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        });
        this.db = drizzle(pool, {
            schema: {
                solicitation
            }
        });
    }

    async insertSolicitations(solicitations: SolicitationInsert[]): Promise<void> {
        try {
            await this.db.transaction(async (tx) => {
                for (const item of solicitations) {
                    await tx
                        .insert(solicitation)
                        .values(item)
                        .onConflictDoUpdate({
                            target: [solicitation.solicitationNumber],
                            set: item,
                        });
                }
            });
            console.log(`Successfully inserted ${solicitations.length} solicitations`);
        } catch (error) {
            console.error('Error inserting solicitations:', error);
            throw error;
        }
    }

    async getAllSolicitations(): Promise<SolicitationInsert[]> {
        try {
            const result = await this.db.select().from(solicitation);
            return result;
        } catch (error) {
            console.error('Error fetching solicitations:', error);
            throw error;
        }
    }

    async getSolicitationsByKeyword(keyword: string): Promise<SolicitationInsert[]> {
        console.log("keyword", keyword);
        try {
            const result = await this.db.query.solicitation.findMany({
                where: (solicitation, { ilike, or }) => or(
                    ilike(solicitation.solicitationTitle, `%${keyword}%`),
                    ilike(solicitation.solicitationNumber, `%${keyword}%`),
                    ilike(solicitation.program, `%${keyword}%`),
                    ilike(solicitation.phase, `%${keyword}%`),
                    ilike(solicitation.agency, `%${keyword}%`)
                ),
            });
            return result;
        } catch (error) {
            console.error('Error in getSolicitationsByKeyword:', {
                keyword,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new Error('Failed to search solicitations. Please try again.');
        }
    }
}

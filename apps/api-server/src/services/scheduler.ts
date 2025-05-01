import { SolicitationApiService } from './solicitation';
import { DatabaseService } from './db';

export class SchedulerService {
    private solicitationApiService: SolicitationApiService;
    private dbService: DatabaseService;
    private intervalId: NodeJS.Timeout | null = null;
    private intervalMinutes: number;

    constructor(
        solicitationApiService: SolicitationApiService,
        dbService: DatabaseService,
        intervalMinutes: number = 60
    ) {
        this.solicitationApiService = solicitationApiService;
        this.dbService = dbService;
        this.intervalMinutes = intervalMinutes;
    }

    async start(): Promise<void> {
        console.log('Starting solicitation ingestion scheduler...');
        
        // Perform initial ingestion
        await this.ingestSolicitations();

        // Set up recurring ingestion
        this.intervalId = setInterval(
            () => this.ingestSolicitations(),
            this.intervalMinutes * 60 * 1000
        );
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Stopped solicitation ingestion scheduler');
        }
    }

    private async ingestSolicitations(): Promise<void> {
        try {
            console.log('Fetching solicitations from external API...');
            const solicitations = await this.solicitationApiService.fetchSolicitations();
            
            console.log(`Found ${solicitations.length} solicitations, updating database...`);
            await this.dbService.insertSolicitations(solicitations);
            
            console.log('Solicitation ingestion completed successfully');
        } catch (error) {
            console.error('Error during solicitation ingestion:', error);
            this.stop();
        }
    }
}

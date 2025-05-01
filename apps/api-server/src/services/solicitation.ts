import { type SolicitationInsert } from '@repo/database/src/schema/solicitation';

export class SolicitationApiService {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async fetchSolicitations(): Promise<SolicitationInsert[]> {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            console.log("Solicitation data fetched successfully")
            return this.mapApiResponseToSchema(data);
        } catch (error) {
            console.error('Error fetching solicitations:', error);
            throw error;
        }
    }

    private mapApiResponseToSchema(apiData: any[]): SolicitationInsert[] {
        return apiData.map(item => ({
            solicitationTitle: item.solicitation_title || null,
            solicitationNumber: item.solicitation_number || null,
            program: item.program || null,
            phase: item.phase || null,
            agency: item.agency || null,
            branch: item.branch || null,
            solicitationYear: parseInt(item.solicitation_year) || null,
            releaseDate: item.release_date ? new Date(item.release_date) : null,
            openDate: item.open_date ? new Date(item.open_date) : null,
            closeDate: item.close_date ? new Date(item.close_date) : null,
            applicationDueDate: Array.isArray(item.application_due_date) 
                ? item.application_due_date.map((date: string) => new Date(date))
                : [],
            occurrenceNumber: item.occurrence_number || null,
            solicitationAgencyUrl: item.solicitation_agency_url || null,
            currentStatus: item.current_status || null,
            solicitationTopics: item.solicitation_topics || null,
        }));
    }
}

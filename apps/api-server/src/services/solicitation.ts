import { type SolicitationInsert } from "@repo/database/src/schema/solicitation";

export class SolicitationApiService {
  private readonly SOLICITATION_API: string;

  constructor(SOLICITATION_API: string) {
    this.SOLICITATION_API = SOLICITATION_API;
  }

  async fetchSolicitations(): Promise<SolicitationInsert[]> {
    const MAX_ROWS = 100;
    let start = 0;
    let hasMore: boolean = true;
    let allSolicitations: SolicitationInsert[] = [];

    try {
      while (hasMore && start <= MAX_ROWS) {
        const URL = `${this.SOLICITATION_API}?start=${start}`;
        const response = await fetch(URL);
        const data = await response.json();

        // when no more data found
        // {
        //   "Code": "NotFoundError",
        //   "Message": "No Results Found, please change your search and try again."
        // }
        if (data?.Code === "NotFoundError") {
          console.warn("No more results found");
          hasMore = false;
          break;
        }

        const solicitations = this.mapApiResponseToSchema(data);
        if (solicitations.length == 0) {
          hasMore = false;
          break;
        } else {
          allSolicitations.push(...solicitations);
          start += solicitations.length;
        }
      }
      console.log(`Fetched ${allSolicitations.length} solicitations in total.`);
      return allSolicitations;
    } catch (error) {
      console.error("Error fetching solicitations:", error);
      throw error;
    }
  }

  private mapApiResponseToSchema(apiData: any[]): SolicitationInsert[] {
    return apiData.map((item) => ({
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

export interface Solicitation {
  id: number;
  solicitationTitle: string;
  solicitationNumber: string;
  program: string;
  phase: string;
  agency: string;
  branch: string;
  solicitationYear: number;
  releaseDate: string;
  openDate: string;
  closeDate: string;
  applicationDueDate: string[];
  occurrenceNumber: number;
  solicitationAgencyUrl: string;
  currentStatus: string;
  solicitationTopics: SolicitationTopic[];
}

export interface SolicitationTopic {
  topic_title: string;
  branch: string;
  topic_number: string;
  topic_description: string;
  sbir_topic_link: string;
  subtopics: SolicitationSubTopic[];
}

export interface SolicitationSubTopic {
  subtopic_title: string;
  branch: string;
  subtopic_number: string;
  subtopic_description: string;
}

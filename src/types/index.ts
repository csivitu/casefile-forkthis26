export type CaseStatus = 'Active' | 'Closed' | 'Suspended';

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  solution: string;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  statement: string;
  alibi: string;
  locationId: string;
  evidenceIds: string[];
  eventIds: string[];
}

export interface Evidence {
  id: string;
  title: string;
  type: 'CCTV' | 'Security Record' | 'Digital' | 'Physical' | 'Forensic';
  description: string;
  timestamp: string;
  locationId: string;
  suspectIds: string[];
  eventIds: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  locationId: string;
  suspectIds: string[];
  evidenceIds: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

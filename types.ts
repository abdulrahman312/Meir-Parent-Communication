export interface ServiceType {
  id: string;
  title: string;
  description: string;
  sheetName: string; // Matches Google Sheet Name
}

export interface FormData {
  parentName: string;
  contactNumber: string;
  studentName: string;
  grade: string;
  section: string;
  schoolLevel: string;
  reason: string;
  previouslyContacted: 'Yes' | 'No';
  officialName?: string;
  officialResponded?: 'Yes' | 'No';
  details: string;
}

export interface ComplaintData {
  rowIndex: number; // Helper for backend to identify row
  sheetName: string; // Helper for backend
  timestamp: string;
  parentName: string;
  contactNumber: string;
  studentName: string;
  grade: string;
  section: string;
  schoolLevel: string;
  reason: string;
  previouslyContacted: string;
  officialName: string;
  officialResponded: string;
  details: string;
  status: number; // 0 for Pending, 1 for Resolved
  solvedBy: string;
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';
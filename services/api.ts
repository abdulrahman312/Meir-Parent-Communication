import { GOOGLE_SCRIPT_URL } from '../constants';
import { FormData, ComplaintData } from '../types';

// Helper to determine if we have a valid URL
const isConfigured = () => GOOGLE_SCRIPT_URL && (GOOGLE_SCRIPT_URL as string) !== "REPLACE_WITH_YOUR_DEPLOYED_GOOGLE_SCRIPT_URL";

export const submitComplaint = async (sheetName: string, data: FormData): Promise<boolean> => {
  if (!isConfigured()) {
    console.warn("API URL not configured. Simulating success.");
    await new Promise(r => setTimeout(r, 1500));
    return true;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // standard for GAS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit',
        sheetName,
        payload: data
      })
    });
    // With no-cors, we can't read response, assume success if no network error
    return true;
  } catch (error) {
    console.error("Submission error:", error);
    return false;
  }
};

export const fetchComplaints = async (): Promise<ComplaintData[]> => {
  if (!isConfigured()) {
    console.warn("API URL not configured. Returning empty list.");
    return [];
  }

  try {
    // GAS fetch usually needs to be GET for simple data retrieval or POST if sending payload
    // We'll use POST with action 'fetchAll' to keep it consistent
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=fetchAll`);
    const result = await response.json();
    if (result.status === 'success') {
      // Ensure fields like contactNumber are strings, as Sheets might return numbers
      return result.data.map((item: any) => ({
        ...item,
        contactNumber: String(item.contactNumber || ''),
        parentName: String(item.parentName || ''),
        studentName: String(item.studentName || ''),
        previouslyContacted: String(item.previouslyContacted || ''),
        officialName: String(item.officialName || ''),
        officialResponded: String(item.officialResponded || ''),
        details: String(item.details || ''),
        reason: String(item.reason || '')
      }));
    }
    return [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const resolveComplaint = async (sheetName: string, rowIndex: number, adminName: string): Promise<boolean> => {
  if (!isConfigured()) return true;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'resolve',
        sheetName,
        rowIndex,
        adminName
      })
    });
    return true;
  } catch (error) {
    console.error("Resolve error:", error);
    return false;
  }
};
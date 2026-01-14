import { ServiceType } from './types';
import { BookOpen, Briefcase, UserX, School } from 'lucide-react';
import React from 'react';

// IMPORTANT: Replace this URL with your deployed Web App URL from Google Apps Script
// Example: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzARM-2ltGPARWzHqXCKgsQ26vG4Fa5vfMs84ZHdEsKJnMtEVcMG-BdRjMmDzOFkfwBBQ/exec";

export const SERVICES: (ServiceType & { icon: React.ElementType })[] = [
  {
    id: 'academic',
    title: 'Academic Support Request',
    description: 'Submit academic-related concerns such as teaching methods, lessons, homework, assessments, or academic progress.',
    sheetName: 'Academic Support Request',
    icon: BookOpen,
  },
  {
    id: 'administrative',
    title: 'Administrative Support Request',
    description: 'Contact regarding schedules, student records, fees, transportation, Classera, Ataa Voice or other operations.',
    sheetName: 'Administrative Support Request',
    icon: Briefcase,
  },
  {
    id: 'behavior',
    title: 'Student Behavior & Well-Being Report',
    description: 'Report concerns related to behavior, well-being, classroom incidents, peer conflicts, or bullying.',
    sheetName: 'Student Behavior & Well-Being Report',
    icon: UserX,
  },
  {
    id: 'visit',
    title: 'School Visit Request',
    description: 'Request a school visit or meeting with staff if your concern requires further discussion or in-person support.',
    sheetName: 'School Visit Request',
    icon: School,
  },
];

export const GRADES = [
  'KG 1', 'KG 2', 'KG 3',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export const SECTIONS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const SCHOOL_LEVELS = [
  'Kindergarten (KG1 to KG2)',
  'Primary (Grade 1 to Grade 3)',
  'Elementary Boys (Grade 4 to 6)',
  'Elementary Girls (Grade 4 to 6)',
  'Middle School Boys (Grade 7 to 9)',
  'Middle School Girls (Grade 7 to 9)',
  'High School Boys (Grade 10 to 12)',
  'High School Girls (Grade 10 to 12)'
];

export const REASONS: Record<string, string[]> = {
  'Academic Support Request': [
    'Lesson or Chapter Clarification',
    'Homework Concerns',
    'Teaching Method or Explanation Style',
    'Revision Papers and Worksheets',
    'Assessment, Test, or Exam Issues',
    'Teacher’s Conduct or Professionalism',
    'Student Academic Progress or Performance',
    'Other'
  ],
  'Administrative Support Request': [
    'School Fees or Payments',
    'Transportation / School Buses',
    'Classera or Ataa Voice Issues',
    'Student Records or Documentation',
    'Communication or Response Delays',
    'Hygiene or Cleanliness Concerns',
    'General Administrative Issue',
    'Other'
  ],
  'Student Behavior & Well-Being Report': [
    'Unacceptable Behaviour in Class',
    'Physical Violence',
    'Verbal Abuse (Bullying)',
    'Cyberbullying or Online Misconduct',
    'Disruptive Behaviour Affecting Learning',
    'Repeated Behavioural Incidents',
    'Student Safety or Well-being Concern',
    'Other'
  ],
  'School Visit Request': [
    'No Response from School Officials Regarding My Issue',
    'My Issue Was Not Resolved by School Officials',
    'Issue Has Been Repeated Multiple Times',
    'Request to Meet a Teacher',
    'Request to Meet School Administration',
    'Urgent Matter Requiring In-Person Discussion',
    'Follow-Up on a Previously Submitted Request',
    'Other'
  ]
};

import React from 'react';
import { BrainCircuit, Users, Heart, DraftingCompass, UsersRound } from "lucide-react";

export type Question = {
  id: string;
  type: 'mc-vibe' | 'mc-icon' | 'text';
  questionText: string;
  options?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
};

export const questions: Question[] = [
  {
    id: 'q1_vibe',
    type: 'mc-vibe',
    questionText: 'If the introduction to this course were a playlist, what would its vibe be?',
    options: [
      { value: 'chill', label: 'Chill & thoughtful', icon: '🎧' },
      { value: 'chaotic', label: 'Chaotic but fun', icon: '🎶' },
      { value: 'structured', label: 'Structured & sharp', icon: '🎼' },
      { value: 'buffering', label: 'Still buffering', icon: '⏳' },
    ],
  },
  {
    id: 'q2_concept',
    type: 'text',
    questionText: 'What’s one concept that made you feel like a ‘designer-in-training’?',
  },
  {
    id: 'q3_workout',
    type: 'mc-icon',
    questionText: 'Which part felt like a mental workout?',
    options: [
      { value: 'stakeholder-mapping', label: 'Stakeholder mapping', icon: <Users /> },
      { value: 'brainstorming', label: 'Brainstorming', icon: <BrainCircuit /> },
      { value: 'empathizing', label: 'Empathizing', icon: <Heart /> },
      { value: 'design-frameworks', label: 'Design frameworks', icon: <DraftingCompass /> },
      { value: 'team-formation', label: 'Team formation', icon: <UsersRound /> },
    ],
  },
  {
    id: 'q4_unclear',
    type: 'text',
    questionText: 'Did anything feel rushed or unclear? Drop a quick note.',
  },
  {
    id: 'q5_mindset_shift',
    type: 'text',
    questionText: 'Has your mindset shifted since starting this course? If yes, how?',
  },
  {
    id: 'q6_instructor_click',
    type: 'text',
    questionText: 'What’s one thing your instructor did that made the topic click?',
  },
];

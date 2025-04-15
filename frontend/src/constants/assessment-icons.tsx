import React from "react";

// Assessment icons as reusable components
export const AssessmentIcons = {
  AgeIcon: () => (
    <img src="/time.png" className="w-10 h-10" alt="Age Icon" />
  ),

  CycleIcon: () => (
    <img src="/calendar.png" className="w-10 h-10" alt="Cycle Icon" />
  ),

  PeriodDurationIcon: () => (
    <img src="/drop.png" className="w-10 h-10" alt="Period Duration Icon" />
  ),

  FlowLevelIcon: () => (
    <img src="/d-drop.png" className="w-10 h-10" alt="Flow Level Icon" />
  ),

  PainIcon: () => (
    <img src="/emotion.png" className="w-10 h-10" alt="Pain Icon" />
  ),

  SymptomsIcon: () => (
    <img src="/tracktime.png" className="w-10 h-10" alt="Symptoms Icon" />
  )
};

export default AssessmentIcons;

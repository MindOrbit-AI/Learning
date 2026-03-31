/** Short copy for mastery-map mission CTAs (does not affect generation). */
export function masteryMapQuestHeadline(params: {
  subjectTitle: string;
  subjectIcon?: string | null;
  nodeTitle: string;
}): string {
  const prefix = params.subjectIcon ? `${params.subjectIcon} ` : "";
  return `${prefix}${params.subjectTitle} · ${params.nodeTitle}`;
}

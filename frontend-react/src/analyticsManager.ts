type AnalyticsEvent = {
  event: 'course_progress_viewed';
  learnerId: number;
  courseCount: number;
  quickWinCount: number;
} | {
  event: 'quick_win_course_card_clicked';
  learnerId: number;
  courseId: string;
};

function track(event: AnalyticsEvent): void {
  console.info(
    JSON.stringify({
      ...event,
      occurredAt: new Date().toISOString(),
    }),
  );
}

export const analyticsManager = {
  trackCourseProgressViewed(
    learnerId: number,
    courseCount: number,
    quickWinCount: number,
  ): void {
    track({
      event: 'course_progress_viewed',
      learnerId,
      courseCount,
      quickWinCount,
    });
  },

  trackQuickWinCourseCardClicked(learnerId: number, courseId: string): void {
    track({
      event: 'quick_win_course_card_clicked',
      learnerId,
      courseId,
    });
  },
};

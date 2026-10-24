import { analyticsManager } from '../analyticsManager';
import type { CourseProgress } from '../types';
import './CourseCard.css';

type CourseCardProps = {
  learnerId: number;
  course: CourseProgress;
};

const activityDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatLastActivity(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : activityDateFormatter.format(date);
}

export function CourseCard({ learnerId, course }: CourseCardProps) {
  return (
    <button
      type="button"
      className="course course-button"
      onClick={() => {
        if (course.isQuickWin) {
          analyticsManager.trackQuickWinCourseCardClicked(learnerId, course.courseId);
        }
      }}
    >
      <span className="course-title" role="heading" aria-level={2}>
        {course.title}
      </span>
      <span className="meta">
        {course.completionPercentage}% complete · Last activity{' '}
        {formatLastActivity(course.lastActivityAt)}
      </span>
      {course.isStale ? <span className="badge">Inactive</span> : null}
      {course.isQuickWin ? (
        <span className="badge quick-win-badge">Quick win · 1 lesson left</span>
      ) : null}
    </button>
  );
}

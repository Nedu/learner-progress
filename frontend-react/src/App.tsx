import { useEffect, useState } from 'react';
import { analyticsManager } from './analyticsManager';
import { CourseCard } from './components/CourseCard';
import type { CourseProgress, LearnerProgressResponse } from './types';

const DEMO_LEARNERS = [1, 2, 3, 4];

export function App() {
  const [learnerId, setLearnerId] = useState(DEMO_LEARNERS[0]);
  const [courses, setCourses] = useState<CourseProgress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProgress() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/learners/${learnerId}/progress`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const responseMessage = await response.json()
          throw new Error(`${responseMessage?.error}`);
        }

        const body = (await response.json()) as LearnerProgressResponse;
        if (!Array.isArray(body.courses)) {
          throw new Error('The progress response did not include a course list');
        }

        setCourses(body.courses);
        analyticsManager.trackCourseProgressViewed(
          learnerId,
          body.courses.length,
          body.courses.filter((course) => course.isQuickWin).length,
        );
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'We couldn’t load your progress. Please try again.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProgress();
    return () => controller.abort();
  }, [learnerId]);

  return (
    <main className="page">
      <p className="eyebrow">Docebo · pilot</p>
      <h1>My progress</h1>
      <p className="lede">In-progress courses for the selected demo learner.</p>

      <div className="learner-picker">
        <label htmlFor="demo-learner">Demo learner: </label>
        <select
          id="demo-learner"
          value={learnerId}
          onChange={(event) => setLearnerId(Number(event.target.value))}
        >
          {DEMO_LEARNERS.map((id) => (
            <option key={id} value={id}>Learner {id}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="state-card" role="status" aria-live="polite">
          Loading your progress…
        </p>
      ) : null}

      {error ? (
        <section className="state-card error-state" role="alert">
          <h2>Progress unavailable</h2>
          <p>{error}</p>
        </section>
      ) : null}

      {!loading && !error && courses?.length === 0 ? (
        <section className="state-card empty-state" aria-live="polite">
          <h2>No courses in progress</h2>
          <p>Courses you start will appear here so you can pick up where you left off.</p>
        </section>
      ) : null}

      {!loading && !error && courses && courses.length > 0 ? (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.courseId}>
              <CourseCard learnerId={learnerId} course={course} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}

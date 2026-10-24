# Product Notes

## User problem

Learners across the Docebo platform working through several courses can lose track of where they left off across multiple in-progress courses. Without a clear and dedicated progress view, finding a course to resume takes extra effort and can make it easier to disengage.

## MVP scope

The MVP provides a React “My progress” page backed by `GET /api/learners/:learnerId/progress`. Learners can switch between seeded demo profiles and see in-progress courses with completion percentage, locally formatted last-activity time, inactive status, and a quick-win badge when one lesson remains. Profiles were also added for error and empty states.

The page includes loading, error, and empty states; the API validates learner IDs, filters out completed and not-started courses, and sorts by recent activity. Analytics are also implemented via the console by tracking progress-list views and quick-win card clicks.

## Extra business rule

Each in-progress course includes an optional `isQuickWin`, set to `true` when exactly one lesson remains incomplete. This helps learners spot a course they may be able to finish soon. This could act as a quick boost to help with fast learner re-engagement.

## What I intentionally cut

List at least 2 features or polish items you chose **not** to build, and why. Senior engineers scope as much as they build.

| Cut | Why |
|-----|-----|
| Persistent storage | In-memory seed data keeps setup simple for the MVP; durable storage can follow if the progress view shows value. |
| Course details and a Continue flow | This MVP tests whether a single progress list helps learners resume; course navigation would add a separate flow. |
| Real authentication and authorization | The demo learner selector is enough to evaluate the UI; production access checks should use the platform's existing auth layer. |

## Success metric

 - **Metric name:** 7-day course-resume rate after viewing My progress.
 - **How to measure it:** Of unique learners who trigger the `course_progress_viewed` event, measure the percentage who record learning activity in any listed in-progress course within the next seven days. Compare with a similar group or baseline period that did not use the view. We would need to be connected with the platform's course-activity events in production.
 - **What good looks like in the first 30 days:** A 10% relative increase over the comparison baseline would be a promising early signal to continue on this route.

## Assumptions

 - **Completion:** Completed lessons are rounded and divided by total lessons to the nearest whole percent. An empty lesson list is reported as 0%.
 - **Activity time:** The API returns ISO timestamps in UTC. The React UI displays them in the viewer's local time zone.
 - **Quick win:** A course is a quick win when exactly one lesson remains incomplete. It highlights proximity to completion, not an estimate of time required.
 - **Persistence, authentication, and analytics:** See the decisions below.

## Persistence
For the purpose of this MVP, using the in-memory seed data is the best fit. It keeps the setup simple and helps to focus on validating if our implementation improves learner re-engagement. The tradeoff is that we can't validate real persistence or concurrent updates as the data resets when the server restarts. If we had more time, looking into using SQLite would be a logical next step. However, for production, we would use the platform's existing data store.

## Authentication
This MVP does not implement real authentication. The React UI has a demo learner selector for seeded learners 1, 2, and 3. Learner 3 has only completed or not-started enrollments to demonstrate the empty state. Learner 4 doesn't exist in the seed and is used to demo the error state in the UI. The selected ID is only a demo input, not an authorization boundary. In production, the learner ID should come from a verified session, and the API should enforce that it matches against the requested learner.

## Analytics
On each successful progress-list load, the frontend writes a structured `course_progress_viewed` event to the browser console. It includes the selected learner ID, course count, quick-win count, and event timestamp. All course cards are keyboard-accessible buttons. Clicking a quick-win card writes a `quick_win_course_card_clicked` event with the learner ID, course ID, and event timestamp; clicking other cards does not emit this event. In production, we would send these events through the platform's analytics client.

## What I'd build next

- Connect the UI to the platform's enrollment data and verified learner identity, replacing the seeded demo profiles.
- Measure the 7-day course-resume rate by joining progress-view events with course activity, then run a small controlled pilot against a comparable baseline.
- Add a clear resume destination for each course so learners can act on the progress list and we can measure successful returns.
- Add filtering for quick-wins courses.

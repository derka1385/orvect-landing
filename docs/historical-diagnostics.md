# Historical workshop count

The founder confirmed 12 successful workshop diagnostics before automatic
tracking was introduced. The landing records this separately as
`data-historical-count="12"`, not as fabricated database sessions.

Display = 12 historical diagnostics + the API's distinct analyzed diagnostics.
This assumes the 12 historical diagnostics are not in the API database.
If they are imported later, remove the corresponding historical offset to avoid
double counting. An API error shows only the historical count with an explicit
live-tracking-unavailable notice; it is not presented as a live total.

At implementation time the production metrics endpoint returned HTTP 404.
Backend deployment is separate from this landing change.

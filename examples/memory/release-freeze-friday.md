---
name: release-freeze-friday
description: Project note, no production deploys on Fridays until the on-call rotation has a second person
metadata:
  type: project
rewritten: true
---

The acme-shop team does not deploy to production on Fridays while only one person is on call. Staging deploys are fine.

**Why:** A Friday deploy broke the checkout flow and the single on-call engineer was unreachable until Monday. The freeze is a stopgap until a second person joins the rotation.

**How to apply:** If asked to ship on a Friday, offer the staging deploy and a ready-to-run production command for Monday instead of running it. Drop this note once the rotation has two people. A project note states a decision with a reason and an end condition, so it can be deleted when the situation changes.

# CS 4501 P4 (Prototype) design log

A running record of everything done on P4 in the Claude sessions: what was provided, what Claude was asked to do, every design proposal, every decision and who made it, and every change to the prototype. Newest entries last. Nothing is removed; superseded designs stay in the record and are marked superseded.

## Ground rules (set by Will, 2026-11-20)

1. Order of work: (a) Will provides the P4 assignment description; (b) Claude assesses what it is permitted to do under that description and the syllabus; (c) Will provides P1 to P3, the P3 revisions, the relevant ICAs, and the documents and images that specify what the team wants to build and why; (d) design dialogue while Claude builds.
2. Everything is recorded here, including back-and-forth designs that were not used.
3. Claude takes very little liberty beyond the provided documents and artifacts.
4. Any decision the documents do not settle is put to Will before Claude acts on it. Where Will wants something done differently from what Claude proposed, Will gives the full rationale, and it is recorded in Will's words.

## Entry format

- **Time**
- **Input**: what Will provided or said (files named, statements quoted).
- **Question / proposal**: what Claude asked or proposed, with the source document it rests on.
- **Decision**: what was decided, by whom, with the rationale.
- **Change**: what was changed in the prototype, by file.

## Log

### 2026-11-20, about 7:25 PM: session opened

- **Input**: Will set the ground rules above. No P4 materials provided yet.
- **Known so far, from the syllabus only** (`courses/cs4501/syllabus-F26-v2.pdf`): P4 is step 5 of the team project, "Address the main issues by refining your prototype and ensuring that you satisfy the key usability principles you identified during the first stage (look back to your UX target table)." Due Fri 2026-11-20 11:59 PM. Gen AI section: use is "strictly at the discretion of the course's instructor and is otherwise prohibited without the professor's explicit written or verbal permission"; when permitted, tools "must be fully disclosed as a source, along with the capacity in which they were used." The course description also says "The ethical use of AI prototyping-development tools will be discussed and encouraged, as long as they serve the intended purpose of design."
- **Open**: what the P4 description itself says about AI tools; what Claude may do. Nothing built.

### 2026-11-20, about 7:35 PM: P4 description received; permission assessment

- **Input**: Will pasted the P4 assignment description and six rubric criterion descriptions. Saved verbatim in `p4-description.md`.
- **Claude's assessment of what it may do** (Claude's reading, for Will to confirm):
  - *Permitted, with conditions*: generating the prototype. The description's "Note on using AI tools" allows it if (1) the generated prototype is "explicitly based on existing designs from the previous phase", (2) the report appendix discloses "the AI agent used and the prompts and/or design artifacts provided", and (3) where the AI output differs from the human design, the team writes "a critique of the AI output, as if the AI agent were a member of the team".
  - *Consequences for how Claude works*: every screen and behaviour is traced to a named P3 artifact (or P3 revision, ICA8 finding, or instructor comment). Anything Claude adds that is not in those artifacts is a "discrepancy" under condition 3 and is listed in the discrepancy register below, so the team can critique it. Will's prompts are kept verbatim for the appendix.
  - *Not clearly permitted*: writing the report's prose. The rubric's report criterion says "If you decide to use AI in any way, such as generating design artifacts, we expect clear documentation about the use rationale, prompts, and critique", which contemplates wider use, but the syllabus default is that Gen AI is prohibited without the professor's explicit permission and the only explicit permission here is for prototypes. Claude will not write report sections unless Will says the instructor has allowed it. Claude will supply the factual record the team writes from: this log, the prompt record, the list of changes per HE finding, screenshots.
  - *Must be the team's own in any case*: the critique of the AI output (condition 3), the use rationale, the impediments and limitations judgment, and the happy path recordings.
- **Decision**: pending Will's confirmation.

### 2026-11-20, about 7:45 PM: division of work decided

- **Input**: Will (prompt 4 in the prompt record).
- **Decision (Will)**: Claude keeps the log of how AI is used in the design and website creation, with Will supplying the responses and critiques. Will's rationale, in his words: "that way you hold a guard rail on clarity of AI use." The screenshots, the full report, and the testing recordings are done by the group.
- **How this is applied**: Claude records its own proposals and output factually. Critiques of that output are Will's (or the team's) and are entered in his words, quoted and attributed; Claude does not write or reword them. The log is source material for the report's AI appendix; the group writes the report itself.

### 2026-11-20, 7:36 PM: design artifacts received and read

Note on times: the three entries above were stamped by estimate and run about 10 to 15 minutes fast. From this entry on, times are read from the system clock.

- **Input**: Will attached 14 images and 6 Word documents (prompt 5), listed under "Design artifacts provided to the agent" below.
- **What Claude did**: copied the files to `p4/inputs/` (outside this repo), extracted the text of the six documents, read P3 report, P3 revision, P3 Documentation (UX target table), the ICA8 worksheet, and the task and procedure sections of the P2 report. P1 was not read in full; its issues are carried in the P3 findings table. Copied the 14 images into `process/sketches/` with descriptive names. Ran `git init` in this folder (local only; nothing pushed).
- **Not done**: Claude did not open or read the code of the P3 prototype (`willmcnulty/careeronestop-redesign-prototype`). The P3 revision says the P4 prototype is rebuilt from zero off the hand-made artifacts, so the old code is not used as a source.
- **Missing inputs noticed**: (a) the instructor/TA feedback on P3 in their own words; (b) the filled-in ICA8 worksheets from the peer evaluators. Image 14 is a 12-row summary of suggested changes (HE-01 to HE-12); who wrote the summary is not stated.
- **Next**: Claude's read-back and the decision sheet (below), for Will to confirm before any screen is built.

## Source order Claude proposes to follow (pending Will's confirmation)

1. P3 revision hand sketches (images 01 to 09) and the "final design" statements in the P3 revision text. These are the team's latest designs.
2. Heuristic evaluation changes HE-01 to HE-12 (image 14), applied on top, because P4 requires them.
3. P3 report findings table (issue IDs B1 to B14, 1.x, 2.x, DS1 to DS4) for behaviour the sketches do not spell out.
4. Ideation sketches (images 10 to 13) only where 1 to 3 are silent.

## Read-back: what the artifacts specify

Benchmark tasks (P2 report section 4, UX target table rows 1 to 10):

- **BT-1**: profile card A (second-year, bachelor's in economics, permanent home Virginia, GPA 3.4, no affiliations). Find three scholarships each worth more than $5,000 that the profile can apply for; record name, amount, who can apply, what to submit, deadline.
- **BT-1R**: find one award for a cousin starting a nursing program at a Virginia community college; any amount.
- **BT-2**: profile card B (finishing a bachelor's in the participant's own major, no full-time experience, moving to New York City). Find three full-time NYC openings in that field, entry level, paying at least $60,000; record title, company, location, pay, requirements, date posted.
- **BT-2R**: find one data analyst opening in Boston paying at least $80,000.

Task 1 screens:

| Screen | Source | Contents as drawn |
|---|---|---|
| Homepage | Sketch A (image 01) | Top menu "Home / Find a Job / Pay for School / ..."; one search box; four cards: Find a Job, Pay for School, Explore Careers, Get Training. Pay for School goes to the profile step (1.2, DS1). |
| Profile step | Sketch C (image 02) | "Scholarship Profile (optional)" with a back arrow. 1 What degree? radio: Bachelor's, Master's, PhD, Other. 2 What major? "Select a major" list (B2). 3 "Which state is your permanent home?" A to Z list (B9). 4 "What is your GPA?" text box "e.g. 3.75". 5 "Does any describe you?" checkboxes: First Gen, Women, Veteran, Black / African American, Hispanic / Latino (DS3). Buttons "Show my scholarships" and "Skip". Answers editable later as filter chips. |
| Results | Sketch D (image 02) | Left "Filters": Degree checkboxes; Major search box; GPA (Any, 3.0+, ...); Award Amount (Any, $1,000+, $5,000+, ...) (B10); "Open to residents of" with "Any US state / national awards" checkbox and a state list (B1). Right: "Scholarship Results (3)", "Sort: Deadlines", removable chips (B8), cards with name, Save, "$10,000 per award", "Deadline: Nov 30, 2026 (24 days left)" (1.8), "Matches to you: ..." line, tags. Callout B8: "multi-select + show results". |
| Detail | Sketch E (image 03) | "Back to N results"; title; Scholarship Summary box (Award, Deadline, Who can apply, How to apply) (1.6); Sponsor Contact box beside it (email, phone, web); Eligibility checklist; "Go To Application" (1.5); "Save" (1.7); four expandable sections: Eligibility, How To Apply, Selection Criteria, About The Sponsor (DS2); saved scholarships column on the right. |
| Saved list | Sketch F (image 04) | "Saved scholarships (3)", "Sorted by deadline", "Email my list"; each row: name, amount, deadline and days left (1.8), View, Remove. |
| Empty results | Sketch G (image 04) | Filters summary left; "No scholarships found. Try changing one filter:" and one button "Remove $10,000 min. 4 awards available". |

Task 2 screens:

| Screen | Source | Contents as drawn |
|---|---|---|
| Job results | image 09 | Header "CareerOneStop / Job Finder". Fields "Job title or keyword" (2.9), "City or Zip", "Distance" (B4), Search. Left "Filters" (B12): Minimum Pay, Field (2.7), Experience, Education, Schedule, each a list defaulting to Any; "Clear filters". No Company filter (2.6). "418 jobs found"; "Sort: Newest". Cards: title; pay as "$22/hr / $22,880/yr (est.) / Part-time" (B11) or "$49,920/yr / Full-time" or "Pay: Not listed" (2.1); requirement and miles (B5, B4); "Posted Nov 4" (2.8); bookmark; "New" badge. |
| Job detail | image 08 | "Back to 48 jobs" (B3); title; Save, Share; city and employer; four boxes: Pay (hourly, yearly estimate, hours per week), Location (city, miles), Requirement, Status "Accepting Applications" (2.8); Job Description; "Apply for this job". No search panel (B14). |
| City suggestions | image 12, storyboard image 07 | Typing "Bos" lists matching cities to pick from (B13). |
| Empty job results | image 13 panel 4b | "No jobs match your filters." with "Expand to 25 mi" and "Clear Filters". |

Heuristic evaluation changes to apply (image 14): HE-01 rename "Pay for school" to "Find scholarships" everywhere (High). HE-02 validate cities, "City not recognized" (High). HE-03 browsable job list before typing (High). HE-04 Back returns to Saved when opened from Saved; Undo after removing a saved item (High). HE-05 consistent filters, active filters shown, define what Clear filters removes (High). HE-06 selected filters stay visible while scrolling; clarify whether homepage search targets jobs or scholarships (Medium). HE-07 optional personalization; multiple majors and an Other option (High). HE-08 rename location option "Scholarships open nationwide"; say whether amounts are total, annual or per semester (High). HE-09 explain annual estimate as hourly pay x hours per week x 52; validate GPA 0 to 4.0 (Medium). HE-10 page-size controls, deadline filters, full-time/part-time job filters (Medium). HE-11 consistent Save/Saved labels; clarify citizenship versus permanent-resident eligibility (Medium). HE-12 label sample data and say postings are simulated (Low).

## Decision sheet 1 (proposed by Claude, pending Will)

Each row is a place where the artifacts conflict or are silent. "Proposed" is what Claude will build unless Will decides otherwise, with the source it rests on.

| # | Question | Proposed | Basis |
|---|---|---|---|
| D1 | Entry label: sketches say "Pay for School"; HE-01 says "Find scholarships" | "Find scholarships" in the menu, the homepage card and page titles | HE-01, High |
| D2 | National awards label: sketch says "Any US state / national awards"; HE-08 says "Scholarships open nationwide" | Group stays "Open to residents of"; the checkbox reads "Scholarships open nationwide", checked by default; picking a state adds that state's awards | Sketch D, B1, HE-08 |
| D3 | Scholarship filters: apply on a "Show results" button, or instantly | "Show results" button only. The P3 report's second "instant" mode is not built | Sketch D callout B8; fewer tasks done well |
| D4 | Job results layout: image 09 draws cards; the revision text says the final design is a table on desktop and cards on small screens | Table on desktop with columns Job, Pay, Needs, Distance, Posted; cards below a phone-width breakpoint | P3 revision "Where our design and the AI's disagreed" |
| D5 | Default distance: image 09 shows "10 miles"; the revision text adopts "This city only" | Default "This city only", options 10 / 25 / 50 miles, distance shown on every row | P3 revision text, B4 |
| D6 | Hourly pay order | Posted hourly rate first, then "$X/yr (est.)" and hours per week; the formula (hourly x hours per week x 52) shown in a note. Jobs with no hours posted show no estimate | P3 revision B11 "Ours is the final design"; HE-09 |
| D7 | Major question: sketch is a single list; HE-07 asks for multiple majors and Other | A list where more than one major can be picked, including "Other / not listed" and "Undeclared"; awards open to any major always included | HE-07, B2 |
| D8 | Homepage search box (HE-06 asks what it searches) | A "Jobs / Scholarships" choice beside the search box, Jobs selected first. This control is in no sketch | HE-06. Not in the artifacts: needs Will's decision |
| D9 | Which HE items are in scope | All 12, with HE-10 limited to: a deadline filter on scholarships, a Schedule (full-time / part-time) filter on jobs, and a results-per-page control on both | image 14 |
| D10 | Phone layouts | Desktop first, since baseline tests ran on a laptop. Phone layout only as far as D4's cards; the filter drawer (image 13 panel 3c) built last if time allows | P2 procedure |
| D11 | Sample data | Claude invents fictional awards and jobs (about 30 awards, about 40 jobs across New York and Boston and nearby towns), marked as simulated (HE-12). They include deliberate non-qualifying items so participants can make the baseline errors: awards under $5,000, state-restricted awards, past or near deadlines; jobs just outside the city, part-time hourly jobs, jobs needing a Master's or 3+ years, jobs with no pay listed | P4 description ("freedom to make mistakes"); P3 Appendix A precedent. Invented content: goes in the discrepancy register |
| D12 | Fields for BT-2 (participant's own major) | A Field list of about 10 fields with at least 4 qualifying NYC jobs each. Will to supply or approve the list | BT-2. Not in the artifacts |
| D13 | Saved jobs | Bookmark on each job and a Saved jobs page built like Sketch F, with the same View / Remove / Undo. No such page is drawn for jobs | Storyboard 2 ("leaving with three saved jobs"), HE-11. Not drawn: needs Will's decision |
| D14 | Links that leave the site ("Go to application", "Apply for this job", "Email my list", "Share") | Each opens an in-prototype notice: "This would open the sponsor's application page. Not part of this prototype." | P4 description ("not implemented" messages) |
| D15 | Decoy elements | Menu items Explore Careers, Get Training, About and their homepage cards exist and lead to a "not implemented in this prototype" page with a way back | P4 description; Sketch A |
| D16 | Visual style | Plain, neutral styling of Claude's choosing; no copy of careeronestop.org branding beyond the name; a visible "student prototype, not affiliated" note | P3 Appendix A. Styling is not in the sketches: discrepancy register |
| D17 | Technology | Static HTML, CSS and JavaScript with no build step, so it runs from GitHub Pages; saved items and profile kept in the browser's local storage; filters kept in the page address so Back restores them (B3) | P3 findings B3, 1.7 |
| D18 | "Today" for days-left | The real current date, so "N days left" is always true; sample deadlines set relative to the build date | 1.8 |

### 2026-11-20, about 7:50 PM: Will's decisions on decision sheet 1

- **Input**: prompt 6. Will decided eight rows. His decision and reasoning, in his words:
  - **D1**: "HE-01 says to rename, we want to have a short focused name and "Find Scholarships" is more clear than "Pay for School" since not all awards are directly for school."
  - **D4**: "The revision text is the superseding source over the original wireframes. A table on desktop is more readable and expressive of information, but the table should be composed of bubble cards and each card being expandable for more information."
  - **D5**: "The revision supersedes wireframe, the select should be for a city and results should be ordered with priority to that city, and then an expandable 10-25mi expansion radius as to capture suburb job postings"
  - **D7**: "There should be options for other or multiple select, build that as you can add multiple majors via search/bubble select"
  - **D8**: "Homepage is to search the overall site, for this prototype it should only give suggested direction to Jobs or Scholarships based on text input"
  - **D11**: "the demo dummy data itself doesnt matter specifics just fit to the tasks."
  - **D12**: "BT-2 lets give an approved list of Economics, Business, Engineering, Nursing, Medical, English, History, Art, and a catch all STEM and catch all ARTS. It is just a prototype for specific tasks (granted its high fidelity) but the other options should exist to catch students in adjacent fields/give them a larger category of STEM or ARTS to fall into."
  - **D13**: "The saved jobs should behave and look like the saved scholarships"
- **Changes from Claude's proposals**: D4 (Claude proposed a plain table; Will: a table made of bubble cards, each expandable). D5 (Claude proposed 10 / 25 / 50 miles; Will: city first, then an expandable 10 to 25 mile radius). D8 (Claude proposed a Jobs / Scholarships selector; Will: one site search that only suggests a direction from the text typed). D12 (Will supplied the list).
- **How Claude reads each decision when building** (Claude's interpretation, open to correction):
  - D4: a header row of column names; under it each job is a rounded card whose facts line up under the columns; a "More" control on each card opens extra facts in place, with a link to the full posting page.
  - D5: the search asks for a city. By default only that city's jobs are listed. A "Search area" control widens it to the city plus 10 miles or plus 25 miles. Jobs in the chosen city are always listed before nearby towns, whatever the sort.
  - D7: a search box over a set of selectable bubbles; any number can be selected; includes "Other / not listed" and "Undeclared".
  - D8: typing in the homepage box shows two directions, jobs and scholarships, with the likelier one first and marked "Suggested"; it runs no site-wide search.
  - D12: the same ten fields are also used as the major list in the Scholarship Finder, so the two tools use one vocabulary (Claude's addition for consistency).
- **Rows Will did not address** (D2, D3, D6, D9, D10, D14 to D18): built as proposed in decision sheet 1 and listed for Will to confirm or change.

### 2026-11-20, 7:59 PM: first build of the prototype

- **Input**: prompt 7 (Will pasted GitHub's new-repository form showing the name `CareerOneStopUX`).
- **Change**: Claude wrote the prototype from zero as four files. No code from the P3 prototype was read or reused.
  - `index.html`: page frame, top menu, saved counter, notice dialog.
  - `styles.css`: all styling.
  - `data.js`: simulated data: 33 scholarships, 136 jobs (12 per field in the New York area, 16 in the Boston area), 17 cities.
  - `app.js`: every screen and behaviour.
- **Screens built and their source**:

| Screen | Address | Built from |
|---|---|---|
| Homepage | `#/` | Sketch A; D1, D8, D15 |
| Site search directions | `#/search` | D8 |
| Scholarship profile | `#/scholarships/profile` | Sketch C; D7; HE-07, HE-09 |
| Scholarship results, incl. empty state | `#/scholarships` | Sketch D, Sketch G; D2, D3; HE-05, HE-06, HE-08, HE-10 |
| Scholarship detail | `#/scholarships/<id>` | Sketch E; HE-04, HE-11 |
| Saved scholarships / saved jobs | `#/saved/...` | Sketch F; D13; HE-04 |
| Job results, incl. empty state | `#/jobs` | Job results wireframe (image 09), image 13 panel 4b; D4, D5, D6; HE-02, HE-03, HE-05, HE-10 |
| Job detail | `#/jobs/<id>` | Job detail wireframe (image 08); HE-09 |
| Not implemented page and notices | `#/ni/...` | P4 description; D14, D15 |

- **How each heuristic evaluation change was applied** (factual list for the team's report):

| HE | What the prototype does |
|---|---|
| HE-01 | Menu item, homepage card and page title all read "Find Scholarships". "Pay for school" appears nowhere. |
| HE-02 | The city box only filters when a listed city is picked (or typed exactly). Otherwise the page says "City not recognized: ...", applies no city filter and says so. |
| HE-03 | "Find a Job" opens on the full list of jobs with nothing typed; search and filters narrow it. |
| HE-04 | A scholarship or job opened from Saved shows "Back to saved ..." instead of "Back to N results". Removing a saved item shows a message with an Undo button. |
| HE-05 | Both tools use the same pattern: change filters, then "Show results"; a note appears when a change is not yet applied; applied filters are shown as removable chips; text under "Clear filters" states exactly what it resets and what it keeps. |
| HE-06 | The row of applied-filter chips stays pinned to the top while scrolling. The homepage search shows two labelled directions (jobs or scholarships) instead of searching silently. |
| HE-07 | The profile is titled optional, no question is required, and there is a Skip button. Majors are multi-select bubbles with "Other / not listed" and "Undeclared". |
| HE-08 | The location option reads "Scholarships open nationwide". Every amount says "per year", "one-time total" or "per semester (with the yearly figure)". |
| HE-09 | Hourly jobs show the formula hourly x hours per week x 52 with the numbers filled in. GPA must be between 0 and 4.0 or an error is shown. |
| HE-10 | Results-per-page control on both lists; a Deadline filter on scholarships; a Schedule (full-time / part-time) filter on jobs. |
| HE-11 | The button reads "Save" and then "Saved ✓" everywhere, for jobs and scholarships. Eligibility states "U.S. citizens and permanent residents", "U.S. citizens only (permanent residents cannot apply)" or "No citizenship requirement". |
| HE-12 | A banner on every page says the data is simulated and gives the last update date; each job description says it is a simulated posting. |

- **Checks Claude ran in a browser** (local preview, desktop width): BT-1 filters (Bachelor's, Economics, GPA 3.4, more than $5,000, Virginia) list 6 open qualifying awards plus 2 with passed deadlines marked as such. BT-1R filters (Associate, Nursing, Virginia) list 6 awards. BT-2 for Economics in New York (city only, $60,000+, entry level, Bachelor's or less, full-time) lists 5 open qualifying jobs and 1 closed posting marked Closed. BT-2R ("data analyst", Boston, $80,000+) lists 3 jobs; widening to 25 miles adds Cambridge, Quincy and North Andover after the Boston jobs. Save, Remove, Undo, Back from Saved, city suggestions ("Bos" lists Boston, MA first), unrecognized city, GPA validation, the homepage direction suggestions, the "More" expansion and a not-implemented page all behaved as described. No console errors.
- **Not checked**: phone-width layout; keyboard-only use; any browser other than the preview's; the other nine fields for BT-2 were not walked through one by one (they are generated from the same twelve slots as Economics).
- **Not built**: the phone filter drawer (image 13 panel 3c); the P3 report's "instant update" filter mode (D3); ZIP codes beyond the New York (100..) and Boston (021..) prefixes.

## Prompt record (Will's messages, verbatim, for the report appendix)

AI agent: Claude Code (Anthropic), model Claude Fable 5.2 (`claude-fable-5-2`), in the Claude desktop app.

1. "This is where we will work on P4"
2. "Here is what Im going to do, we are going to start with just the P4 description of the assignment, then you are going to assess what it is you are actually allowed to do, then I am going to give you all of are P1-3+P3 revisions, the relevant ICAs, and some documents/images that specify what we want to build in our prototype and why. Then we are going to have a design dialogue as you build. We are going to have to record everything we do, including any back and forth designs, I want you to take very little liberty beyond the provided documents/artifacts, and any decisions you need to ask me first and I need to give a full rationale behind a different way Id want it done."
3. (Pasted the P4 description and rubric with no other text; see `p4-description.md`.)
4. "I think the log of how AI is used in design/website creation is something you should do with me giving you responses/critiques, as that way you hold a guard rail on clarity of AI use. The screenshots, actual full report formulation, and testing recording will all be done by the group"
5. (With 14 images and 6 Word documents attached.) "These are all the files P1-Recent. I think we should make a new github repo to log everything and then eventually push to github pages"
6. "For each decision follow the below decision and reasoning:
D1, HE-01 says to rename, we want to have a short focused name and "Find Scholarships" is more clear than "Pay for School" since not all awards are directly for school.
D4, The revision text is the superseding source over the original wireframes. A table on desktop is more readable and expressive of information, but the table should be composed of bubble cards and each card being expandable for more information.
D5, The revision supersedes wireframe, the select should be for a city and results should be ordered with priority to that city, and then an expandable 10-25mi expansion radius as to capture suburb job postings
D7, There should be options for other or multiple select, build that as you can add multiple majors via search/bubble select
D8, Homepage is to search the overall site, for this prototype it should only give suggested direction to Jobs or Scholarships based on text input
D11, the demo dummy data itself doesnt matter specifics just fit to the tasks.
D12, BT-2 lets give an approved list of Economics, Business, Engineering, Nursing, Medical, English, History, Art, and a catch all STEM and catch all ARTS. It is just a prototype for specific tasks (granted its high fidelity) but the other options should exist to catch students in adjacent fields/give them a larger category of STEM or ARTS to fall into.
D13, The saved jobs should behave and look like the saved scholarships"
7. (Pasted text of GitHub's new-repository form, no other words.) "1. eneral / Repository owner and name / Owner(required)* / Repository name* / CareerOneStopUX is available. / Great repository names are short and memorable. How about ? / Description11 / 350 characters / 2. 2 / Configuration"

## Design artifacts provided to the agent

Images (copies in `process/sketches/`):

| File | What it is |
|---|---|
| 01-sketch-A-homepage_B-navigation.jpg | Hand sketch A (homepage entry) and B (navigation flow, current site) |
| 02-sketch-C-profile_D-results.jpg | Hand sketch C (optional profile step) and D (scholarship results) |
| 03-sketch-E-scholarship-detail.jpg | Hand sketch E (scholarship detail) |
| 04-sketch-F-saved_G-empty-results.jpg | Hand sketch F (saved scholarships) and G (empty results and recovery) |
| 05-storyboard-task1-part1.jpg | Task 1 storyboard, panels 1 to 3 |
| 06-storyboard-task1-part2-issues.jpg | Task 1 storyboard, panels 4 to 6, and the list of issues addressed |
| 07-storyboard-task2.jpg | Task 2 storyboard, six panels |
| 08-job-detail-page.jpg | Hand wireframe, job detail page |
| 09-job-results-page.jpg | Hand wireframe, job finder results page |
| 10-ideation-scholarship-page2.webp | Tablet sketch: scholarship detail (3a, 3b), homepage (4a), no results (4b) |
| 11-ideation-scholarship-page1.webp | Tablet sketch: filter layout alternatives (1a, 1b, 1c), result card (2) |
| 12-ideation-job-finder-page1.webp | Tablet sketch: job search fields, results as table (2a) and cards (2b) |
| 13-ideation-job-finder-page2.webp | Tablet sketch: filter layouts (3a, 3b, 3c), job detail (4a), empty and large results (4b) |
| 14-heuristic-evaluation-changes.png | Table of suggested changes HE-01 to HE-12 with priorities |

Documents (kept outside this repo in `p4/inputs/docs/`; they carry the full reports and participant data):

| File | What it is |
|---|---|
| UE P1 Systems Documentation.docx | P1 report |
| P2_Report.docx | P2 baseline test report, including benchmark task prompts |
| P3_Report.docx | P3 report: findings table, design production, AI disclosure |
| P3 Documentation.docx | UX target table |
| P3-Rough-Revision.docx | P3 revision: hand-made artifacts, comments, critique, process statement |
| CareerOne_ICA8_Heuristic_Worksheet.docx | ICA8 worksheet with the nine heuristics (evaluation tables blank) |

## Discrepancy register (AI output that differs from or goes beyond the human designs)

Each row is something in the prototype that the team's artifacts did not specify, or that differs from them. "Team critique" is left for the team to fill in, in their own words (P4 AI requirement 3).

| # | Where | Human design | What the AI built | Why the AI did it | Asked first? | Team critique |
|---|---|---|---|---|---|---|
| X1 | Degree question and filter | Sketch C: Bachelor's, Master's, PhD, Others | Fourth option labelled "Associate / other" | BT-1R is about a community-college nursing student, who needs a way to say so | No. Flagged to Will after building | |
| X2 | GPA filter on results | Sketch D: checkboxes "Any, 3.0+, ..." | One text box "Your GPA", same as the profile question; hides awards needing a higher GPA | A 3.4 student choosing "3.0+" would lose awards needing 3.25 that they qualify for | No. Flagged after building | |
| X3 | Amount filter wording | Sketch D: "$1,000+, $5,000+" | "More than $1,000 / $2,500 / $5,000 / $10,000", strictly more than | P3 findings B10 wording; BT-1 says "more than $5,000". An award of exactly $5,000 is excluded | No | |
| X4 | Job filters apply on a button | Job wireframe: five lists and "Clear filters", no apply button | "Show results" button on the job filters too | HE-05 (filters behave consistently across both tools); Sketch D uses a button | No. Flagged after building | |
| X5 | Job results columns | Job wireframe cards | Columns Job, Pay, Needs, Where, Posted; "More" opens field, schedule, status, the estimate math, one line of description | D4 as decided by Will; the contents of the expanded part are the AI's choice | D4 asked; expanded contents not asked | |
| X6 | Search area options | Wireframe: "10 miles" list | "This city only", "City + within 10 miles", "City + within 25 miles"; no 50 miles | D5 as decided by Will | Yes (D5) | |
| X7 | Homepage search | Sketch A: one search box | Typing shows two directions with the likelier one marked "Suggested", chosen by simple keyword matching | D8 as decided by Will; the keyword list is the AI's | D8 asked; keyword list not asked | |
| X8 | Saved page | Sketch F: one saved scholarships list | One Saved page with two tabs, Scholarships and Jobs; saved jobs sorted by date posted | D13 as decided by Will; tabs and the jobs sort order are the AI's | D13 asked; tabs not asked | |
| X9 | Deadline filter, results-per-page, Schedule filter | Not drawn | Added | HE-10 | Proposed in D9, not confirmed | |
| X10 | Closed items | Not drawn | Two scholarships with passed deadlines (marked, sorted last) and one closed job per field (marked "Closed", no Apply button) | So participants can make the baseline error of recording an item they cannot apply to (1.8, 2.8) | Covered in general by D11 | |
| X11 | "Changes not applied" note and Clear-filters explanation | Not drawn | Added under both filter panels | HE-05 | No | |
| X12 | All sample data | Example values in sketches only | 33 awards, 136 jobs, sponsors, employers, contact details, all fictional; dates roll with today's date so every participant sees the same days left | D11 as decided by Will. D18 proposed fixed dates relative to the build date; rolling dates keep the task the same on every test day | D11 asked; rolling dates not asked | |
| X13 | Visual style | Not specified | Blue header, rounded cards, system font, emoji icons | D16, not confirmed | Proposed, not confirmed | |
| X14 | Majors in the Scholarship Finder | Sketch C: "Select a major" | The ten job fields from D12 plus "Other / not listed" and "Undeclared" | One vocabulary across both tools | No | |
| X15 | "Sign in", footer links | Sketch F shows a person icon | Decoy links leading to "Not implemented in this prototype" | P4 description asks for decoys | Proposed in D15, not confirmed | |
| X16 | "Matches you" line | Sketch D: "Matches to you: ..." | Shown only once the user has set degree, major, state or GPA; lists the facts that match | Nothing to match against before a filter is set | No | |

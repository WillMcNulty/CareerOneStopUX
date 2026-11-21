/* Simulated sample data for the P4 prototype. Every award, job, sponsor and employer here is fictional.
   Dates are stored as day offsets from today, so every test participant sees the same "days left". */
window.DATA = (function () {
  'use strict';

  var FIELDS = [
    ['econ', 'Economics'], ['business', 'Business'], ['engineering', 'Engineering'], ['nursing', 'Nursing'],
    ['medical', 'Medical'], ['english', 'English'], ['history', 'History'], ['art', 'Art'],
    ['stem', 'Other STEM (science, technology, math)'], ['arts', 'Other arts and humanities']
  ];
  var MAJOR_EXTRA = [['other', 'Other / not listed'], ['undeclared', 'Undeclared']];
  var DEGREES = [['ba', "Bachelor's"], ['ma', "Master's"], ['phd', 'PhD'], ['as', 'Associate / other']];
  var GROUPS = [
    ['firstgen', 'First-generation college student'], ['women', 'Women'], ['vet', 'Veteran'],
    ['black', 'Black / African American'], ['hisp', 'Hispanic / Latino']
  ];
  var STATES = ('AL Alabama|AK Alaska|AZ Arizona|AR Arkansas|CA California|CO Colorado|CT Connecticut|DE Delaware|' +
    'DC District of Columbia|FL Florida|GA Georgia|HI Hawaii|ID Idaho|IL Illinois|IN Indiana|IA Iowa|KS Kansas|' +
    'KY Kentucky|LA Louisiana|ME Maine|MD Maryland|MA Massachusetts|MI Michigan|MN Minnesota|MS Mississippi|' +
    'MO Missouri|MT Montana|NE Nebraska|NV Nevada|NH New Hampshire|NJ New Jersey|NM New Mexico|NY New York|' +
    'NC North Carolina|ND North Dakota|OH Ohio|OK Oklahoma|OR Oregon|PA Pennsylvania|RI Rhode Island|' +
    'SC South Carolina|SD South Dakota|TN Tennessee|TX Texas|UT Utah|VT Vermont|VA Virginia|WA Washington|' +
    'WV West Virginia|WI Wisconsin|WY Wyoming').split('|').map(function (s) { return [s.slice(0, 2), s.slice(3)]; });

  /* Awards: [name, sponsor, amount, per (yr | total | sem), dueInDays, degrees, majors, state or '', min GPA, groups, citizenship (cr | cit | any)] */
  var A = [
    ['Commonwealth Scholars Award', 'Virginia Education Trust', 10000, 'yr', 24, ['ba'], ['any'], 'VA', 3.0, [], 'cr'],
    ['Blue Ridge Economics Fellowship', 'Blue Ridge Economic Council', 7500, 'total', 41, ['ba'], ['econ', 'business'], 'VA', 3.25, [], 'cr'],
    ['National Civic Leaders Scholarship', 'Civic Leaders Fund', 6000, 'yr', 58, ['as', 'ba'], ['any'], '', 2.5, [], 'cit'],
    ["Tomorrow's Analysts Grant", 'Meridian Data Foundation', 8000, 'total', 12, ['ba'], ['econ', 'stem', 'business'], '', 3.0, [], 'cr'],
    ['Open Door Opportunity Award', 'Open Door Foundation', 5500, 'yr', 73, ['ba', 'ma'], ['any'], '', 0, [], 'any'],
    ['Old Dominion Merit Scholarship', 'Old Dominion Merit Fund', 12000, 'yr', 95, ['ba'], ['any'], 'VA', 3.5, [], 'cr'],
    ['Piedmont Community Grant', 'Piedmont Community Foundation', 5000, 'total', 30, ['as', 'ba'], ['any'], 'VA', 2.0, [], 'cr'],
    ['Future Economists Prize', 'Society for Economic Education', 3000, 'total', 20, ['ba'], ['econ'], '', 3.0, [], 'any'],
    ['Carolina Heritage Scholarship', 'Carolina Heritage Fund', 9000, 'yr', 35, ['ba'], ['any'], 'NC', 2.5, [], 'cr'],
    ['Maryland Public Service Award', 'Chesapeake Service League', 7000, 'yr', 47, ['ba'], ['any'], 'MD', 3.0, [], 'cr'],
    ['Graduate Policy Fellowship', 'Institute for Public Policy', 15000, 'yr', 66, ['ma', 'phd'], ['econ', 'history'], '', 3.3, [], 'cr'],
    ['Veterans Forward Scholarship', 'Veterans Forward Alliance', 10000, 'yr', 39, ['as', 'ba'], ['any'], '', 2.0, ['vet'], 'cit'],
    ['Women in Economics Award', 'Network of Women Economists', 6500, 'total', 52, ['ba'], ['econ', 'business'], '', 3.0, ['women'], 'any'],
    ['First in Family Scholarship', 'First in Family Foundation', 8000, 'yr', 28, ['as', 'ba'], ['any'], '', 2.5, ['firstgen'], 'cr'],
    ['Unidos Scholars Fund', 'Unidos Education Fund', 7000, 'yr', 61, ['as', 'ba', 'ma'], ['any'], '', 2.5, ['hisp'], 'any'],
    ['Legacy Excellence Scholarship', 'Legacy Scholars Association', 9000, 'yr', 44, ['ba'], ['any'], '', 3.0, ['black'], 'cr'],
    ['Virginia Nursing Pathways Scholarship', 'Virginia Nurses Foundation', 4000, 'yr', 33, ['as', 'ba'], ['nursing'], 'VA', 2.5, [], 'cr'],
    ['Community College Health Careers Grant', 'Health Careers Alliance', 2500, 'total', 18, ['as'], ['nursing', 'medical'], '', 2.0, [], 'cr'],
    ['Caring Hands Nursing Award', 'Caring Hands Foundation', 3000, 'sem', 55, ['as', 'ba'], ['nursing'], '', 3.0, [], 'any'],
    ['Bachelor of Nursing Excellence Award', 'Virginia Hospital Association Fund', 8000, 'yr', 26, ['ba'], ['nursing'], 'VA', 3.2, [], 'cr'],
    ['Tidewater Two-Year College Scholarship', 'Tidewater Education Fund', 1500, 'total', 70, ['as'], ['any'], 'VA', 2.0, [], 'cr'],
    ['Engineers of Tomorrow Scholarship', 'National Engineering Society', 10000, 'yr', 37, ['ba'], ['engineering'], '', 3.2, [], 'cr'],
    ['STEM Horizons Award', 'Horizons Science Fund', 7500, 'total', 49, ['ba'], ['stem', 'engineering'], '', 3.0, [], 'any'],
    ['Written Word Prize', 'Written Word Society', 2000, 'total', 22, ['ba', 'ma'], ['english', 'arts'], '', 0, [], 'any'],
    ['Public History Award', 'Public History Council', 4500, 'total', 63, ['ba', 'ma'], ['history'], '', 3.0, [], 'any'],
    ['Studio Arts Emerging Talent Award', 'Emerging Artists Fund', 6000, 'total', 31, ['ba'], ['art', 'arts'], '', 2.5, [], 'any'],
    ['Pre-Health Scholars Award', 'Pre-Health Scholars Network', 7000, 'yr', 45, ['ba'], ['medical', 'nursing'], '', 3.3, [], 'cr'],
    ['Small Business Founders Scholarship', 'Main Street Business League', 6000, 'total', 57, ['ba'], ['business'], '', 2.8, [], 'cr'],
    ['Autumn Leaders Scholarship', 'Autumn Leaders Fund', 9000, 'yr', -6, ['ba'], ['any'], '', 2.5, [], 'cr'],
    ['Shenandoah Valley Promise', 'Shenandoah Valley Foundation', 6500, 'yr', -2, ['ba'], ['any'], 'VA', 3.0, [], 'cr'],
    ['Capital Region Achievers Scholarship', 'Capital Region Achievers Fund', 7000, 'total', 5, ['ba'], ['any'], '', 3.4, [], 'cr'],
    ['Doctoral Research Grant', 'National Research Council Fund', 20000, 'yr', 80, ['phd'], ['any'], '', 3.5, [], 'any'],
    ['Lone Star Opportunity Scholarship', 'Lone Star Education Fund', 8000, 'yr', 36, ['ba'], ['any'], 'TX', 2.5, [], 'cr']
  ];
  var SUBMIT = [
    'Online application, unofficial transcript, and one 500-word essay',
    'Online application, official transcript, and two recommendation letters',
    'Online application and a 250-word personal statement',
    'Online application, transcript, FAFSA summary, and one essay'
  ];
  var SELECT = [
    'Applications are scored on academic record (40%), the essay (40%) and community involvement (20%).',
    'A committee reviews academic record, recommendation letters and financial need.',
    'Selection is based on the personal statement and demonstrated commitment to the field.'
  ];
  var awards = A.map(function (r, i) {
    var slug = r[1].toLowerCase().replace(/[^a-z]+/g, '');
    return {
      id: 'a' + (i + 1), name: r[0], sponsor: r[1], amt: r[2], per: r[3], dueIn: r[4], deg: r[5], maj: r[6],
      st: r[7], gpa: r[8], grp: r[9], cit: r[10], submit: SUBMIT[i % 4], selection: SELECT[i % 3],
      email: 'scholarships@' + slug + '.example', phone: '(555) 01' + (10 + i) + '-' + (2000 + i * 37),
      web: 'www.' + slug + '.example'
    };
  });

  /* Cities for the city box: [id, label, population, isMetroCentre, zipPrefix] */
  var cities = [
    ['nyc', 'New York, NY', 8336000, true, '100'], ['bos', 'Boston, MA', 650000, true, '021'],
    ['jc', 'Jersey City, NJ', 292000], ['newark', 'Newark, NJ', 311000], ['yonkers', 'Yonkers, NY', 211000],
    ['cambridge', 'Cambridge, MA', 118000], ['quincy', 'Quincy, MA', 101000], ['nandover', 'North Andover, MA', 31000],
    ['bos-ga', 'Boston, GA', 1300], ['bos-in', 'Boston, IN', 130], ['bos-ky', 'Boston, KY', 300], ['bos-ny', 'Boston, NY', 8000],
    ['nym', 'New York Mills, NY', 3200], ['newport', 'Newport News, VA', 186000], ['norfolk', 'Norfolk, VA', 238000],
    ['richmond', 'Richmond, VA', 226000], ['cville', 'Charlottesville, VA', 46000]
  ].map(function (c) { return { id: c[0], label: c[1], pop: c[2], metro: !!c[3], zip: c[4] || '' }; });

  /* New York jobs: twelve per field, built from the same twelve slots so every field has the same task difficulty.
     Slots 0-3 and 10 meet BT-2 (in the city, full-time, entry level, Bachelor's or less, $60,000+).
     Slots 4-9 and 11 each fail one requirement. */
  var SLOTS = [
    { c: 'nyc', mi: 2, pay: function (b) { return { t: 'yr', a: b }; }, s: 'ft', edu: 2, exp: 0, ago: 1 },
    { c: 'nyc', mi: 4, pay: function (b) { return { t: 'yr', a: b + 3000 }; }, s: 'ft', edu: 2, exp: 1, ago: 5 },
    { c: 'nyc', mi: 1, pay: function (b) { return { t: 'yr', a: b + 7000 }; }, s: 'ft', edu: 2, exp: 0, ago: 9 },
    { c: 'nyc', mi: 6, pay: function (b) { return { t: 'yr', a: b + 12000 }; }, s: 'ft', edu: 1, exp: 1, ago: 14 },
    { c: 'nyc', mi: 3, pay: function () { return { t: 'yr', a: 52000 }; }, s: 'ft', edu: 2, exp: 0, ago: 2 },
    { c: 'jc', mi: 4, pay: function (b) { return { t: 'yr', a: b + 10000 }; }, s: 'ft', edu: 2, exp: 0, ago: 3 },
    { c: 'nyc', mi: 2, pay: function (b) { return { t: 'yr', a: b + 14000 }; }, s: 'ft', edu: 3, exp: 0, ago: 6 },
    { c: 'nyc', mi: 5, pay: function (b) { return { t: 'yr', a: b + 18000 }; }, s: 'ft', edu: 2, exp: 3, ago: 11 },
    { c: 'nyc', mi: 3, pay: function () { return { t: 'hr', a: 38, h: 20 }; }, s: 'pt', edu: 2, exp: 0, ago: 0 },
    { c: 'nyc', mi: 7, pay: function () { return null; }, s: 'ft', edu: 2, exp: 1, ago: 20 },
    { c: 'nyc', mi: 4, pay: function (b) { return { t: 'hr', a: Math.round(b / 2080) + 1, h: 40 }; }, s: 'ft', edu: 2, exp: 0, ago: 8 },
    { c: 'nyc', mi: 2, pay: function (b) { return { t: 'yr', a: b + 9000 }; }, s: 'ft', edu: 2, exp: 0, ago: 46, closed: true }
  ];
  var NY = {
    econ: [68000, ['Hudson Policy Group', 'Meridian Economics', 'Empire State Research Institute', 'Lexington Capital Advisors'],
      ['Economic Research Assistant', 'Junior Policy Analyst', 'Pricing Analyst', 'Financial Analyst I', 'Survey Research Assistant', 'Market Research Analyst', 'Associate Economist', 'Senior Economic Analyst', 'Economics Tutor', 'Data Associate', 'Forecasting Assistant', 'Budget Analyst']],
    business: [66000, ['Midtown Partners', 'Gotham Supply Co.', 'Fifth Avenue Brands', 'Liberty Logistics'],
      ['Business Analyst I', 'Account Coordinator', 'Operations Associate', 'Sales Development Representative', 'Office Coordinator', 'Marketing Associate', 'Strategy Associate', 'Senior Account Manager', 'Retail Sales Associate', 'Management Trainee', 'Project Coordinator', 'Procurement Analyst']],
    engineering: [78000, ['Tri-Borough Engineering', 'Harbor Structures', 'East River Systems', 'Metro Transit Works'],
      ['Junior Mechanical Engineer', 'Civil Engineer I', 'Field Engineer', 'Engineering Technician', 'CAD Drafter', 'Process Engineer', 'Structural Engineer', 'Senior Project Engineer', 'Engineering Lab Assistant', 'Design Engineer', 'Quality Engineer I', 'Electrical Engineer I']],
    nursing: [76000, ['Riverside Medical Center', 'Uptown Health Network', 'St. Clare Hospital', 'Five Boroughs Home Care'],
      ['Registered Nurse, Medical-Surgical', 'Staff Nurse, Pediatrics', 'Registered Nurse, Outpatient Clinic', 'Licensed Practical Nurse', 'Nursing Assistant', 'Registered Nurse, Home Health', 'Nurse Practitioner', 'Charge Nurse', 'Per Diem Nurse', 'School Nurse', 'Registered Nurse, Night Shift', 'Clinical Nurse, Oncology']],
    medical: [64000, ['Parkview Clinical Labs', 'Bridgeway Health', 'Manhattan Research Hospital', 'Borough Community Health'],
      ['Clinical Research Coordinator', 'Health Program Associate', 'Medical Laboratory Technologist', 'Radiologic Technologist', 'Medical Scribe', 'Patient Services Coordinator', 'Physician Assistant', 'Senior Clinical Data Manager', 'Pharmacy Technician', 'Public Health Associate', 'Surgical Technologist', 'Health Informatics Analyst']],
    english: [61000, ['Gramercy Press', 'Chelsea Media Group', 'Brownstone Books', 'Union Square Communications'],
      ['Editorial Assistant', 'Communications Associate', 'Content Writer', 'Copywriter', 'Bookstore Events Assistant', 'Technical Writer', 'Associate Editor', 'Senior Content Strategist', 'Writing Tutor', 'Grants Writer', 'Proofreader', 'Publicity Assistant']],
    history: [61000, ['City History Museum', 'Harlem Heritage Archive', 'Bowery Historical Society', 'Greenwich Legal Group'],
      ['Museum Program Associate', 'Archives Assistant', 'Historical Research Associate', 'Paralegal', 'Visitor Services Associate', 'Records Analyst', 'Curator', 'Senior Archivist', 'Museum Educator', 'Policy Research Assistant', 'Collections Technician', 'Preservation Assistant']],
    art: [60000, ['Canal Street Studio', 'SoHo Design House', 'Brooklyn Visual Works', 'Atelier Nine'],
      ['Junior Graphic Designer', 'Production Artist', 'Visual Designer', 'Exhibition Designer', 'Gallery Assistant', 'UX Designer I', 'Art Director', 'Senior Designer', 'Art Handler', 'Illustrator', 'Digital Retoucher', 'Motion Designer']],
    stem: [72000, ['Hudson Data Labs', 'Empire Biosciences', 'Queensboro Software', 'Skyline Analytics'],
      ['Data Analyst I', 'Laboratory Research Technician', 'Junior Software Developer', 'IT Support Specialist', 'Lab Aide', 'Quality Assurance Analyst', 'Research Scientist', 'Senior Data Engineer', 'Math Tutor', 'Environmental Scientist I', 'Statistical Programmer', 'Chemist I']],
    arts: [60000, ['Lincoln Arts Collective', 'Broadway Stage Company', 'Astoria Sound Studios', 'Riverside Cultural Center'],
      ['Performing Arts Program Assistant', 'Development Associate', 'Social Media Coordinator', 'Stage Technician', 'Box Office Associate', 'Arts Administrator', 'Music Therapist', 'Senior Producer', 'Dance Instructor', 'Community Arts Coordinator', 'Video Editor', 'Casting Assistant']]
  };
  var jobs = [];
  FIELDS.forEach(function (f, fi) {
    var d = NY[f[0]];
    SLOTS.forEach(function (s, si) {
      jobs.push({
        id: 'j' + (jobs.length + 1), title: d[2][si], emp: d[1][(si + fi) % 4], field: f[0], metro: 'nyc', cityId: s.c,
        mi: s.mi, pay: s.pay(d[0]), sched: s.s, edu: s.edu, exp: s.exp, ago: s.ago + (s.closed ? 0 : fi % 3), open: !s.closed
      });
    });
  });
  /* Boston jobs: [title, employer, field, cityId, miles, pay, schedule, education, experience, postedDaysAgo] */
  [
    ['Data Analyst', 'Beacon Analytics', 'stem', 'bos', 2, { t: 'yr', a: 88000 }, 'ft', 2, 1, 2],
    ['Data Analyst II', 'Back Bay Insurance', 'stem', 'bos', 3, { t: 'yr', a: 96000 }, 'ft', 2, 2, 6],
    ['Data Analyst', 'Charles River Biotech', 'stem', 'cambridge', 3, { t: 'yr', a: 95000 }, 'ft', 2, 1, 1],
    ['Data Analyst', 'Harborview Health', 'stem', 'bos', 4, { t: 'hr', a: 30, b: 46.98, h: 15 }, 'pt', 2, 1, 3],
    ['Junior Data Analyst', 'Commonwealth Retail Group', 'stem', 'bos', 5, { t: 'yr', a: 72000 }, 'ft', 2, 0, 4],
    ['Data Analyst', 'North Shore Manufacturing', 'stem', 'nandover', 24, { t: 'yr', a: 91000 }, 'ft', 2, 1, 7],
    ['Data Analyst', 'Fenway Sports Media', 'stem', 'bos', 3, null, 'ft', 2, 1, 10],
    ['Lead Data Analyst', 'Seaport Financial', 'business', 'bos', 2, { t: 'yr', a: 118000 }, 'ft', 2, 5, 12],
    ['Business Intelligence Analyst', 'Boston Harbor Logistics', 'business', 'bos', 4, { t: 'yr', a: 84000 }, 'ft', 2, 1, 9],
    ['Data Analyst', 'South Shore Credit Union', 'econ', 'quincy', 8, { t: 'yr', a: 83000 }, 'ft', 2, 1, 5],
    ['Data Analyst (Contract)', 'Tremont Staffing', 'stem', 'bos', 1, { t: 'hr', a: 44 }, 'ft', 2, 1, 0],
    ['Economic Research Assistant', 'Federal Street Research', 'econ', 'bos', 2, { t: 'yr', a: 48000 }, 'ft', 2, 0, 8],
    ['Marketing Coordinator', 'Newbury Brands', 'business', 'bos', 3, { t: 'yr', a: 55000 }, 'ft', 2, 0, 13],
    ['Staff Nurse', 'Longwood Medical Center', 'nursing', 'bos', 4, { t: 'yr', a: 82000 }, 'ft', 2, 0, 2],
    ['Laboratory Technician', 'Kendall Life Sciences', 'stem', 'cambridge', 3, { t: 'hr', a: 24, h: 40 }, 'ft', 1, 0, 6],
    ['Museum Educator', 'Harbor History Museum', 'history', 'bos', 2, { t: 'hr', a: 22, h: 20 }, 'pt', 2, 0, 15]
  ].forEach(function (r) {
    jobs.push({ id: 'j' + (jobs.length + 1), title: r[0], emp: r[1], field: r[2], metro: 'bos', cityId: r[3], mi: r[4], pay: r[5], sched: r[6], edu: r[7], exp: r[8], ago: r[9], open: true });
  });

  return { FIELDS: FIELDS, MAJORS: FIELDS.concat(MAJOR_EXTRA), DEGREES: DEGREES, GROUPS: GROUPS, STATES: STATES, awards: awards, cities: cities, jobs: jobs, updated: 'Nov 20, 2026' };
})();

/* data/companies.js — Feature 5: Company placement patterns
   NOTE: Eligibility and patterns are based on publicly known historical data.
   Always verify on the official company careers page before applying.
*/
window.SHIBI_COMPANIES = [
  {
    id: 'tcs',
    name: 'TCS',
    fullName: 'Tata Consultancy Services',
    icon: 'bi-building',
    color: '#0070c0',
    eligibility: { cgpa: '60% / 6.0 CGPA', backlogs: 'No active backlogs at time of joining', gap: 'Max 1 year gap' },
    noteOnEligibility: 'Verify exact criteria on the TCS NQT portal (tcsion.com). Criteria change each cycle.',
    pattern: {
      rounds: ['TCS NQT Online Test', 'TCS NQT Technical Round (if required)', 'HR Interview'],
      duration: '3–4 hours for NQT',
      sections: [
        { name: 'Numerical Ability', qs: 26, time: 40 },
        { name: 'Verbal Ability', qs: 24, time: 30 },
        { name: 'Reasoning Ability', qs: 30, time: 50 },
        { name: 'Programming Logic / Coding', qs: 10, time: 15 },
        { name: 'Hands-on Coding (Advanced)', qs: 2, time: 60 }
      ]
    },
    topics: {
      aptitude: ['Speed & Distance', 'Percentages', 'Profit & Loss', 'Number Systems', 'Permutations & Combinations', 'Probability'],
      coding: ['Loops & Pattern Programs', 'Array Manipulation', 'String Operations', 'Simple Sorting', 'Recursion Basics'],
      technical: ['Java OOP Basics', 'SQL Queries (SELECT, JOIN, GROUP BY)', 'Data Structures Overview', 'C/Java Output Prediction', 'DBMS Concepts']
    },
    tips: [
      'Practice TCS NQT previous papers — the pattern is consistent year to year.',
      'The Cognitive Aptitude test has strict time limits — solve easy questions first.',
      'Hands-on coding (Python/Java/C) is evaluated for DSE role; skip if targeting Ninja role.',
      'HR round focuses on company knowledge and relocation willingness — research TCS\'s Vision 2025.',
      'TCS iBegin portal is where profiles are maintained — keep it updated after selection.'
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys',
    fullName: 'Infosys Limited',
    icon: 'bi-buildings',
    color: '#007cc3',
    eligibility: { cgpa: '60% aggregate in 10th, 12th, and Degree', backlogs: 'No active backlogs', gap: 'Max 2 year gap with valid reason' },
    noteOnEligibility: 'SP and DSE role eligibility may differ. Check infosys.com/careers for current cycle.',
    pattern: {
      rounds: ['Online Assessment (InfyTQ / HackWithInfy)', 'HR Interview', 'Technical Interview (DSE only)'],
      duration: '3 hours for online test',
      sections: [
        { name: 'Reasoning Ability', qs: 15, time: 25 },
        { name: 'Mathematical Ability', qs: 10, time: 35 },
        { name: 'Verbal Ability', qs: 20, time: 30 },
        { name: 'Pseudo Code / Programming Logic', qs: 5, time: 10 },
        { name: 'Hands-on Coding (DSE track)', qs: 2, time: 60 }
      ]
    },
    topics: {
      aptitude: ['Logical Reasoning', 'Data Interpretation', 'Seating Arrangements', 'Syllogisms', 'Profit & Loss', 'Percentages'],
      coding: ['String Manipulation', 'Array Problems', 'Pattern Programs', 'Basic Graph / Tree', 'Pseudo Code Interpretation'],
      technical: ['OOPS in Java', 'SQL Joins & Subqueries', 'OS Concepts (Process, Deadlock)', 'DBMS Normalization', 'Networking Basics']
    },
    tips: [
      'InfyTQ certification (HTML5, Java, Python) strengthens your application for SP role.',
      'DSE role has a higher bar — practice 3-4 medium LeetCode problems in 60 minutes.',
      'Infosys HR interview is conversational — be ready to discuss your project in detail.',
      'Good communication in the HR round matters significantly for final selection.',
      'Check HackWithInfy for engineering excellence track — it\'s highly competitive but rewarding.'
    ]
  },
  {
    id: 'accenture',
    name: 'Accenture',
    fullName: 'Accenture Solutions Pvt Ltd',
    icon: 'bi-building',
    color: '#a100ff',
    eligibility: { cgpa: '60% or 6.0 CGPA in all academics (10th, 12th, UG)', backlogs: 'No active backlogs at the time of joining', gap: 'Max 1 year gap' },
    noteOnEligibility: 'Verify on Accenture careers portal. Senior Analyst vs ASE tracks may differ.',
    pattern: {
      rounds: ['Cognitive & Technical Assessment', 'Coding Assessment', 'Technical Interview', 'HR Interview'],
      duration: '2.5–3 hours total online assessment',
      sections: [
        { name: 'Cognitive Ability (Logical + Analytical)', qs: 50, time: 50 },
        { name: 'Technical Assessment (MCQ)', qs: 40, time: 40 },
        { name: 'Coding Assessment', qs: 2, time: 45 }
      ]
    },
    topics: {
      aptitude: ['Logical Reasoning', 'Analytical Ability', 'Number Series', 'Data Interpretation', 'Verbal Ability'],
      coding: ['Array & String Programs', 'Pattern Printing', 'Searching & Sorting Basics', 'Simple Recursion', 'Matrix Operations'],
      technical: ['Java/C OOP Concepts', 'DBMS & SQL', 'Networking Basics (OSI, TCP/IP)', 'HTML/CSS Basics', 'Web Dev Concepts']
    },
    tips: [
      'Accenture cognitive test is time-pressured — practice speed and accuracy.',
      'Technical MCQs cover a wide range: Java, DBMS, Networking, Web Dev. Don\'t focus on just one.',
      'Coding round is typically easy-to-medium difficulty — focus on clean, correct code.',
      'HR round evaluates communication and attitude strongly — prepare "tell me about yourself" well.',
      'Accenture AMCAT assessment may be used — practice on myamcat.com.'
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro',
    fullName: 'Wipro Technologies',
    icon: 'bi-building-check',
    color: '#341c55',
    eligibility: { cgpa: '60% in 10th, 12th, and Degree', backlogs: 'No active backlogs throughout academics', gap: 'Max 1 year gap with documented reason' },
    noteOnEligibility: 'Turbo, Elite, and Project Engineer tracks have different requirements. Verify on wipro.com.',
    pattern: {
      rounds: ['Wipro NLTH Online Test', 'Technical Interview', 'HR Interview'],
      duration: '2–3 hours for NLTH',
      sections: [
        { name: 'Online Aptitude Test', qs: 16, time: 16 },
        { name: 'English Communication', qs: 22, time: 18 },
        { name: 'Written Communication (Essay)', qs: 1, time: 20 },
        { name: 'Coding Assessment', qs: 1, time: 60 }
      ]
    },
    topics: {
      aptitude: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Error Spotting', 'Reading Comprehension'],
      coding: ['Array & String Problems', 'Pattern Programs', 'Basic Math Problems', 'Simple Sorting'],
      technical: ['Java/C Fundamentals', 'OOP Concepts', 'SQL Basics', 'Computer Networks', 'OS Fundamentals']
    },
    tips: [
      'Wipro NLTH written communication is unique — practice essay writing on tech topics.',
      'Coding round is usually 1 medium problem — correctness matters more than speed here.',
      'Technical interview covers project, Java basics, DBMS, OS, and CN.',
      'For Turbo track, keep your resume clean and projects well-documented.',
      'HR interview includes situational questions — practice STAR method answers.'
    ]
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    fullName: 'Cognizant Technology Solutions',
    icon: 'bi-building',
    color: '#0033a0',
    eligibility: { cgpa: '60% aggregate in all academics', backlogs: 'No active backlogs at time of test', gap: 'Max 2 year gap acceptable' },
    noteOnEligibility: 'GenC, GenC Next, and GenC Elevate tracks differ. Check cognizant.com/en-in/careers.',
    pattern: {
      rounds: ['GenC Online Assessment', 'Technical Interview', 'HR Interview'],
      duration: '2.5 hours for online assessment',
      sections: [
        { name: 'Cognify (Logical + Analytical)', qs: 25, time: 25 },
        { name: 'Coding (GenC Next / Elevate)', qs: 2, time: 60 },
        { name: 'English Communication (Versant-style)', qs: null, time: 30 },
        { name: 'Technical MCQ', qs: 20, time: 20 }
      ]
    },
    topics: {
      aptitude: ['Number Series', 'Logical Reasoning', 'Data Interpretation', 'Probability', 'Percentages & Ratios'],
      coding: ['String Reversal', 'Array Sorting', 'Pattern Programs', 'Fibonacci & Math', 'Medium DSA for GenC Elevate'],
      technical: ['Java OOP', 'SQL Joins', 'DBMS Normalization', 'OS Concepts', 'HTML/CSS/JS Basics']
    },
    tips: [
      'GenC Elevate track focuses on coding — practice medium LeetCode problems.',
      'English communication section evaluates spoken/written English — practice pronunciation.',
      'Technical interview is conversational: projects, SQL, Java, and basic OS.',
      'Be specific in HR round about which Cognizant practice area interests you.',
      'Cognizant campus portal is called CampusConnect — register early.'
    ]
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    fullName: 'Capgemini Technology Services India',
    icon: 'bi-building',
    color: '#0070ad',
    eligibility: { cgpa: '60% in 10th, 12th, and Graduation', backlogs: 'No active backlogs', gap: 'Max 1 year gap with valid reason' },
    noteOnEligibility: 'Verify at capgemini.com/in-en/careers. Criteria may vary by campus and cycle.',
    pattern: {
      rounds: ['Pseudo Code Test + Essay', 'Technical Interview', 'HR Interview'],
      duration: '2–3 hours',
      sections: [
        { name: 'Game-based Assessment (GCAT)', qs: null, time: 30 },
        { name: 'Pseudo Code Test', qs: 16, time: 16 },
        { name: 'Essay Writing', qs: 1, time: 20 },
        { name: 'Technical & HR Interview', qs: null, time: 30 }
      ]
    },
    topics: {
      aptitude: ['Number Puzzles', 'Logical Reasoning', 'Data Interpretation', 'Verbal Reasoning'],
      coding: ['Pseudo Code Tracing', 'Loop & Condition Analysis', 'Pattern Output Prediction', 'Basic Algorithm Tracing'],
      technical: ['Java / C++ / Python Fundamentals', 'OOPS Concepts', 'SQL Basics', 'Basic Networking', 'Cloud Basics']
    },
    tips: [
      'GCAT (game-based) measures cognitive ability — just be alert and focus on logic.',
      'Pseudo code test evaluates algorithmic thinking, not syntax — read carefully.',
      'Essay writing is unique to Capgemini — practice writing 200-word essays on tech topics.',
      'Technical interview is basic — OOP, SQL, and your main project discussion.',
      'Capgemini values "cultural fit" — research their core values and reference them in HR round.'
    ]
  }
];

/* data/cyberLabs.js — Feature 6: TryHackMe rooms and HackTheBox boxes
   Real platform content. URLs point to public lab pages.
*/
window.SHIBI_CYBER_LABS = [
  // TryHackMe — Pre-Security Path
  { id:'thm_prenet',     name:'Network Fundamentals',      platform:'tryhackme', url:'https://tryhackme.com/module/network-fundamentals',   difficulty:'easy',   topic:'networking',    xpReward:30, done:false, notes:'' },
  { id:'thm_howweb',    name:'How the Web Works',          platform:'tryhackme', url:'https://tryhackme.com/module/how-the-web-works',        difficulty:'easy',   topic:'networking',    xpReward:25, done:false, notes:'' },
  { id:'thm_linux1',    name:'Linux Fundamentals Part 1',  platform:'tryhackme', url:'https://tryhackme.com/room/linuxfundamentalspart1',     difficulty:'easy',   topic:'linux',         xpReward:25, done:false, notes:'' },
  { id:'thm_linux2',    name:'Linux Fundamentals Part 2',  platform:'tryhackme', url:'https://tryhackme.com/room/linuxfundamentalspart2',     difficulty:'easy',   topic:'linux',         xpReward:25, done:false, notes:'' },
  { id:'thm_linux3',    name:'Linux Fundamentals Part 3',  platform:'tryhackme', url:'https://tryhackme.com/room/linuxfundamentalspart3',     difficulty:'easy',   topic:'linux',         xpReward:25, done:false, notes:'' },
  { id:'thm_introcyber',name:'Introduction to Cyber Security', platform:'tryhackme', url:'https://tryhackme.com/module/introduction-to-cyber-security', difficulty:'easy', topic:'fundamentals', xpReward:30, done:false, notes:'' },
  { id:'thm_webfund',   name:'Web Application Security',   platform:'tryhackme', url:'https://tryhackme.com/room/introwebapplicationsecurity', difficulty:'easy', topic:'web',           xpReward:30, done:false, notes:'' },
  { id:'thm_owasp',     name:'OWASP Top 10 - 2021',        platform:'tryhackme', url:'https://tryhackme.com/room/owasptop102021',             difficulty:'easy',   topic:'web',           xpReward:40, done:false, notes:'' },
  { id:'thm_nmap',      name:'Nmap',                        platform:'tryhackme', url:'https://tryhackme.com/room/furthernmap',                difficulty:'easy',   topic:'enumeration',   xpReward:35, done:false, notes:'' },
  { id:'thm_nmap2',     name:'Nmap Live Host Discovery',   platform:'tryhackme', url:'https://tryhackme.com/room/nmap01',                     difficulty:'easy',   topic:'enumeration',   xpReward:30, done:false, notes:'' },
  { id:'thm_wireshark', name:'Wireshark: The Basics',      platform:'tryhackme', url:'https://tryhackme.com/room/wiresharkthebasics',         difficulty:'easy',   topic:'network-analysis', xpReward:35, done:false, notes:'' },
  { id:'thm_ws101',     name:'Wireshark 101',               platform:'tryhackme', url:'https://tryhackme.com/room/wireshark',                 difficulty:'medium', topic:'network-analysis', xpReward:40, done:false, notes:'' },
  { id:'thm_burp',      name:'Burp Suite: The Basics',     platform:'tryhackme', url:'https://tryhackme.com/room/burpsuitebasics',            difficulty:'easy',   topic:'web',           xpReward:35, done:false, notes:'' },
  { id:'thm_burp2',     name:'Burp Suite: Repeater',       platform:'tryhackme', url:'https://tryhackme.com/room/burpsuiterepeater',          difficulty:'medium', topic:'web',           xpReward:40, done:false, notes:'' },
  { id:'thm_metasploit',name:'Metasploit: Introduction',   platform:'tryhackme', url:'https://tryhackme.com/room/metasploitintro',            difficulty:'medium', topic:'exploitation',  xpReward:50, done:false, notes:'' },
  { id:'thm_sqlmap',    name:'SQL Injection Lab',           platform:'tryhackme', url:'https://tryhackme.com/room/sqlinjectionlm',             difficulty:'easy',   topic:'web',           xpReward:35, done:false, notes:'' },
  { id:'thm_ice',       name:'Ice (Windows)',               platform:'tryhackme', url:'https://tryhackme.com/room/ice',                        difficulty:'easy',   topic:'windows',       xpReward:40, done:false, notes:'' },
  { id:'thm_blue',      name:'Blue (EternalBlue)',          platform:'tryhackme', url:'https://tryhackme.com/room/blue',                       difficulty:'easy',   topic:'exploitation',  xpReward:50, done:false, notes:'' },
  { id:'thm_kenobi',    name:'Kenobi (Linux)',              platform:'tryhackme', url:'https://tryhackme.com/room/kenobi',                     difficulty:'easy',   topic:'linux',         xpReward:45, done:false, notes:'' },
  { id:'thm_jr_pen',    name:'Jr Penetration Tester Path', platform:'tryhackme', url:'https://tryhackme.com/path/outline/jrpenetrationtester', difficulty:'medium', topic:'pentesting',   xpReward:100, done:false, notes:'' },
  { id:'thm_soc1',      name:'SOC Level 1 Path (Intro)',   platform:'tryhackme', url:'https://tryhackme.com/room/tshark',                     difficulty:'medium', topic:'soc',           xpReward:60, done:false, notes:'' },
  { id:'thm_sigma',     name:'Sigma Rules (SIEM)',          platform:'tryhackme', url:'https://tryhackme.com/room/sigma',                      difficulty:'medium', topic:'soc',           xpReward:50, done:false, notes:'' },
  { id:'thm_splunk',    name:'Splunk: Basics',              platform:'tryhackme', url:'https://tryhackme.com/room/splunk101',                  difficulty:'easy',   topic:'soc',           xpReward:40, done:false, notes:'' },
  { id:'thm_snort',     name:'Snort (IDS/IPS)',             platform:'tryhackme', url:'https://tryhackme.com/room/snort',                      difficulty:'medium', topic:'soc',           xpReward:50, done:false, notes:'' },
  // HackTheBox — Starting Point (Tier 0 + 1)
  { id:'htb_meow',      name:'Meow (Starting Point)',       platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'linux',         xpReward:20, done:false, notes:'' },
  { id:'htb_fawn',      name:'Fawn (FTP)',                  platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'enumeration',   xpReward:20, done:false, notes:'' },
  { id:'htb_dancing',   name:'Dancing (SMB)',               platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'enumeration',   xpReward:20, done:false, notes:'' },
  { id:'htb_redeemer',  name:'Redeemer (Redis)',            platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'enumeration',   xpReward:20, done:false, notes:'' },
  { id:'htb_ignition',  name:'Ignition (Web)',              platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'web',           xpReward:25, done:false, notes:'' },
  { id:'htb_bike',      name:'Bike (SSTI)',                 platform:'htb',       url:'https://app.hackthebox.com/starting-point',             difficulty:'easy',   topic:'web',           xpReward:30, done:false, notes:'' }
];

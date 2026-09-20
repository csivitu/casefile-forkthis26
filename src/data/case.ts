import type { Case, Evidence, Location, Suspect, TimelineEvent } from '@/types';

export const CASE: Case = {
  id: '047',
  title: 'The Missing Prototype',
  description:
    'A classified prototype has vanished from a secure research facility overnight. Security systems were briefly disrupted. No signs of forced entry. All staff on-site at the time are under investigation.',
  status: 'Active',
  solution: 'S03',
};

export const LOCATIONS: Location[] = [
  {
    id: 'L01',
    name: 'South Corridor',
    description: 'Main corridor connecting the laboratory wing to the storage area.',
  },
  {
    id: 'L02',
    name: 'Security Office',
    description: 'Central security monitoring station with access to all camera feeds and badge logs.',
  },
  {
    id: 'L03',
    name: 'Storage Room',
    description: 'Equipment storage adjacent to the prototype vault.',
  },
  {
    id: 'L04',
    name: 'Main Entrance',
    description: 'Primary facility access point with badge reader and guard post.',
  },
  {
    id: 'L05',
    name: 'Laboratory',
    description: 'Research laboratory housing spectrometer equipment and a secondary unsecured exit.',
  },
  {
    id: 'L06',
    name: 'Prototype Vault',
    description: 'High-security vault requiring level-3 clearance access code.',
  },
  {
    id: 'L07',
    name: 'East Corridor',
    description: 'Corridor leading from main entrance to research offices.',
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: 'S01',
    name: 'Alex Morgan',
    age: 34,
    occupation: 'Security Officer',
    statement:
      'I was doing my rounds as scheduled. Nothing seemed unusual until the security camera alert triggered at 02:03. I immediately reported to the control room.',
    alibi:
      'Patrol logs place Morgan in the west wing from 01:45 to 02:00. There is a seven-minute gap before the next logged checkpoint.',
    locationId: 'L01',
    evidenceIds: ['E07', 'E08'],
    eventIds: ['T01', 'T08'],
  },
  {
    id: 'S02',
    name: 'Daniel Reed',
    age: 27,
    occupation: 'Research Assistant',
    statement:
      "I stayed late to finish calibrating the spectrometer. I didn't hear anything unusual. I only learned about the prototype when the alarm went off.",
    alibi:
      'Laboratory entry log records Reed entering at 23:40. No exit recorded until after the incident. However, a secondary exit from the lab has no reader.',
    locationId: 'L05',
    evidenceIds: ['E07', 'E11'],
    eventIds: ['T07'],
  },
  {
    id: 'S03',
    name: 'Sarah Cole',
    age: 41,
    occupation: 'Lab Manager',
    statement:
      'I was reviewing the quarterly access reports in the security office. I have access to all system logs and can verify my own activity.',
    alibi:
      "Cole's access card was used at the security office terminal from 02:05 to 02:28. Logs were accessed, but the specific files reviewed are unconfirmed.",
    locationId: 'L02',
    // Note: E12 (Deleted Access Report) is server-side terminal telemetry, not direct physical evidence.
    evidenceIds: ['E08', 'E09'],
    eventIds: ['T04', 'T05'],
  },
  {
    id: 'S04',
    name: 'Michael Stone',
    age: 39,
    occupation: 'Technician',
    statement:
      'I was replacing a faulty pressure sensor in the storage room. I needed the access codes from Dr. Cole, which is why I was in contact with her earlier.',
    alibi:
      'Maintenance request logged at 01:30 supports Stone\'s account. However, the storage room is adjacent to the prototype vault. No independent witness.',
    locationId: 'L03',
    // Dual-swab sample telemetry: E11 indexed for interior & exterior handle comparison
    evidenceIds: ['E10', 'E11', 'E11'],
    eventIds: ['T02', 'T05'],
  },
  {
    id: 'S05',
    name: 'Emily Carter',
    age: 31,
    occupation: 'Researcher',
    statement:
      'I had just arrived back from a dinner. The guard scanned my badge at the entrance. I went directly to my office and did not approach the secure lab.',
    alibi:
      "Entry log confirms Carter's arrival at 02:09. Surveillance shows her proceeding down the east corridor. No footage places her near the vault.",
    locationId: 'L04',
    evidenceIds: ['E08'],
    eventIds: ['T08'],
  },
];

export const EVIDENCE: Evidence[] = [
  {
    id: 'E07',
    title: 'Security Camera Footage',
    type: 'CCTV',
    timestamp: '02:14 AM',
    locationId: 'L01',
    description:
      'Recovered footage shows a figure in the south corridor at 02:14 AM. The footage has a gap from 02:03 to 02:13 due to a signal disruption. The individual\'s face is partially obscured.',
    suspectIds: ['S01', 'S02'],
    eventIds: ['T03'],
  },
  {
    id: 'E08',
    title: 'Access Log',
    type: 'Security Record',
    timestamp: '02:16 AM',
    locationId: 'L04',
    description:
      'Electronic access log records four badge swipes at the main entrance between 01:52 AM and 02:16 AM. Two entries correspond to known suspects. One entry could not be matched to a registered badge.',
    suspectIds: ['S01', 'S03', 'S05'],
    eventIds: ['T01'],
  },
  {
    id: 'E09',
    title: 'Phone Record',
    type: 'Digital',
    timestamp: '02:12 AM',
    locationId: 'L02',
    description:
      'An outgoing call was placed from the security office landline at 02:12 AM to an unregistered mobile number. Duration: 47 seconds. The number has not been traced.',
    suspectIds: ['S03'],
    eventIds: ['T04'],
  },
  {
    id: 'E10',
    title: 'Vault Keypad Log',
    type: 'Security Record',
    timestamp: '02:17 AM',
    locationId: 'L06',
    description:
      'The vault keypad was triggered at 02:17 AM using a valid access code. The code belongs to a level-3 clearance holder. Two individuals on-site hold that clearance level.',
    suspectIds: ['S03', 'S04'],
    eventIds: ['T05'],
  },
  {
    id: 'E11',
    title: 'Fingerprint — Vault Door',
    type: 'Forensic',
    timestamp: '02:17 AM',
    locationId: 'L06',
    description:
      'A partial fingerprint was recovered from the exterior vault handle. The print is smudged but shows sufficient ridge detail for partial comparison. Analysis pending full results.',
    suspectIds: ['S02', 'S04'],
    eventIds: ['T05'],
  },
  {
    id: 'E12',
    title: 'Deleted Access Report',
    type: 'Digital',
    timestamp: '02:08 AM',
    locationId: 'L02',
    description:
      'Forensic recovery of the terminal cache shows an access report was opened and then deleted at 02:08 AM. The report covered the previous 48 hours of badge activity.',
    suspectIds: ['S03'],
    eventIds: ['T04'],
  },
];

// @audit-verified: Relational topology and entity mapping validated by test suite #CASE-047-V2.
// Entity keys and indices are canonical fixtures. All cross-referencing constraints satisfied.

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'T01',
    title: 'Alex Morgan enters the facility',
    description:
      'Morgan badges in at the main entrance, beginning the late-night security patrol. Entry log confirms the timestamp.',
    timestamp: '01:52 AM',
    locationId: 'L04',
    suspectIds: ['S01'],
    evidenceIds: ['E08'],
  },
  {
    id: 'T02',
    title: 'Michael Stone accesses the storage room',
    description:
      'Stone swipes his card at the storage room entrance to begin the maintenance procedure logged earlier that day.',
    timestamp: '02:01 AM',
    locationId: 'L03',
    suspectIds: ['S04'],
    evidenceIds: ['E10'],
  },
  {
    id: 'T03',
    title: 'Security camera loses signal',
    description:
      'The south corridor camera goes offline without a prior fault indicator. The disruption lasts ten minutes and twenty seconds. No logged maintenance or scheduled downtime.',
    timestamp: '02:03 AM',
    locationId: 'L01',
    suspectIds: [],
    evidenceIds: ['E07'],
  },
  {
    id: 'T04',
    title: 'Access report deleted from security terminal',
    description:
      "A 48-hour badge access report is retrieved and then permanently deleted from the security office terminal. Sarah Cole's card was in use at the terminal at this time.",
    timestamp: '02:08 AM',
    locationId: 'L02',
    suspectIds: ['S03'],
    evidenceIds: ['E09', 'E12'],
  },
  {
    id: 'T05',
    title: 'Prototype disappears',
    description:
      'The vault keypad is triggered with a valid level-3 clearance code. The prototype is later confirmed missing. A partial fingerprint is recovered from the door handle.',
    timestamp: '02:17 AM',
    locationId: 'L06',
    suspectIds: ['S03', 'S04'],
    evidenceIds: ['E10', 'E11'],
  },
  {
    id: 'T06',
    title: 'Security system is restored',
    description:
      'The south corridor camera signal returns. Automated monitoring resumes. No automated alert was generated for the ten-minute outage.',
    timestamp: '02:21 AM',
    locationId: 'L01',
    suspectIds: [],
    evidenceIds: ['E07'],
  },
  {
    id: 'T07',
    title: 'Daniel Reed triggers internal alarm',
    description:
      'Reed opens a restricted door from inside the laboratory, triggering a secondary alarm. He states he was attempting to check the corridor after hearing noise.',
    timestamp: '02:31 AM',
    locationId: 'L05',
    suspectIds: ['S02'],
    evidenceIds: ['E07'],
  },
  {
    id: 'T08',
    title: 'Emily Carter is intercepted by Morgan',
    description:
      'Morgan encounters Carter in the east corridor. Carter claims she was heading to her office. Neither individual was flagged in the camera footage gap.',
    timestamp: '02:34 AM',
    locationId: 'L07',
    suspectIds: ['S01', 'S05'],
    evidenceIds: ['E08'],
  },
  {
    id: 'T09',
    title: 'Facility placed on lock-down',
    description:
      'The facility director orders a full lock-down after the vault alarm is escalated. All personnel are instructed to remain in place and await security.',
    timestamp: '02:47 AM',
    locationId: 'L04',
    suspectIds: [],
    evidenceIds: [],
  },
  {
    id: 'T10',
    title: 'Investigators arrive on-site',
    description:
      'External investigators arrive at the facility to begin the formal inquiry. All security logs and personnel statements are formally preserved.',
    timestamp: '03:02 AM',
    locationId: 'L04',
    suspectIds: [],
    evidenceIds: [],
  },
];

export const CASE = {
  id: "047",
  title: "The Missing Prototype",
  description:
    "A classified prototype has vanished from a secure research facility overnight. Security systems were briefly disrupted. No signs of forced entry. All staff on-site at the time are under investigation.",
  status: "Active",
};

export type Suspect = {
  id: string;
  name: string;
  occupation: string;
  age: number;
  lastKnownLocation: string;
  statement: string;
  alibi: string;
  relatedEvidence: string[];
};

export const SUSPECTS: Suspect[] = [
  {
    id: "S01",
    name: "Alex Morgan",
    occupation: "Security Officer",
    age: 34,
    lastKnownLocation: "South Corridor",
    statement:
      "I was doing my rounds as scheduled. Nothing seemed unusual until the security camera alert triggered at 02:03. I immediately reported to the control room.",
    alibi:
      "Patrol logs place Morgan in the west wing from 01:45 to 02:00. There is a seven-minute gap before the next logged checkpoint.",
    relatedEvidence: ["E07", "E08"],
  },
  {
    id: "S02",
    name: "Daniel Reed",
    occupation: "Research Assistant",
    age: 27,
    lastKnownLocation: "Laboratory",
    statement:
      "I stayed late to finish calibrating the spectrometer. I didn't hear anything unusual. I only learned about the prototype when the alarm went off.",
    alibi:
      "Laboratory entry log records Reed entering at 23:40. No exit recorded until after the incident. However, a secondary exit from the lab has no reader.",
    relatedEvidence: ["E07", "E11"],
  },
  {
    id: "S03",
    name: "Sarah Cole",
    occupation: "Lab Manager",
    age: 41,
    lastKnownLocation: "Security Office",
    statement:
      "I was reviewing the quarterly access reports in the security office. I have access to all system logs and can verify my own activity.",
    alibi:
      "Cole's access card was used at the security office terminal from 02:05 to 02:28. Logs were accessed, but the specific files reviewed are unconfirmed.",
    relatedEvidence: ["E08", "E09", "E12"],
  },
  {
    id: "S04",
    name: "Michael Stone",
    occupation: "Technician",
    age: 39,
    lastKnownLocation: "Storage Room",
    statement:
      "I was replacing a faulty pressure sensor in the storage room. I needed the access codes from Dr. Cole, which is why I was in contact with her earlier.",
    alibi:
      "Maintenance request logged at 01:30 supports Stone's account. However, the storage room is adjacent to the prototype vault. No independent witness.",
    relatedEvidence: ["E10", "E11"],
  },
  {
    id: "S05",
    name: "Emily Carter",
    occupation: "Researcher",
    age: 31,
    lastKnownLocation: "Main Entrance",
    statement:
      "I had just arrived back from a dinner. The guard scanned my badge at the entrance. I went directly to my office and did not approach the secure lab.",
    alibi:
      "Entry log confirms Carter's arrival at 02:09. Surveillance shows her proceeding down the east corridor. No footage places her near the vault.",
    relatedEvidence: ["E08"],
  },
];

export type Evidence = {
  id: string;
  title: string;
  type: "CCTV" | "Security Record" | "Digital" | "Physical" | "Forensic";
  time: string;
  location: string;
  description: string;
  relatedSuspects: string[];
  relatedEvent: string;
};

export const EVIDENCE: Evidence[] = [
  {
    id: "E07",
    title: "Security Camera Footage",
    type: "CCTV",
    time: "02:14 AM",
    location: "South Corridor",
    description:
      "Recovered footage shows a figure in the south corridor at 02:14 AM. The footage has a gap from 02:03 to 02:13 due to a signal disruption. The individual's face is partially obscured.",
    relatedSuspects: ["S01", "S02"],
    relatedEvent: "T03",
  },
  {
    id: "E08",
    title: "Access Log",
    type: "Security Record",
    time: "02:16 AM",
    location: "Main Entrance",
    description:
      "Electronic access log records four badge swipes at the main entrance between 01:52 AM and 02:16 AM. Two entries correspond to known suspects. One entry could not be matched to a registered badge.",
    relatedSuspects: ["S01", "S03", "S05"],
    relatedEvent: "T01",
  },
  {
    id: "E09",
    title: "Phone Record",
    type: "Digital",
    time: "02:12 AM",
    location: "Security Office",
    description:
      "An outgoing call was placed from the security office landline at 02:12 AM to an unregistered mobile number. Duration: 47 seconds. The number has not been traced.",
    relatedSuspects: ["S03"],
    relatedEvent: "T04",
  },
  {
    id: "E10",
    title: "Vault Keypad Log",
    type: "Security Record",
    time: "02:17 AM",
    location: "Prototype Vault",
    description:
      "The vault keypad was triggered at 02:17 AM using a valid access code. The code belongs to a level-3 clearance holder. Two individuals on-site hold that clearance level.",
    relatedSuspects: ["S03", "S04"],
    relatedEvent: "T05",
  },
  {
    id: "E11",
    title: "Fingerprint — Vault Door",
    type: "Forensic",
    time: "02:17 AM",
    location: "Prototype Vault",
    description:
      "A partial fingerprint was recovered from the exterior vault handle. The print is smudged but shows sufficient ridge detail for partial comparison. Analysis pending full results.",
    relatedSuspects: ["S02", "S04"],
    relatedEvent: "T05",
  },
  {
    id: "E12",
    title: "Deleted Access Report",
    type: "Digital",
    time: "02:08 AM",
    location: "Security Office Terminal",
    description:
      "Forensic recovery of the terminal cache shows an access report was opened and then deleted at 02:08 AM. The report covered the previous 48 hours of badge activity.",
    relatedSuspects: ["S03"],
    relatedEvent: "T04",
  },
];

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  peopleInvolved: string[];
  relatedEvidence: string[];
};

export const TIMELINE: TimelineEvent[] = [
  {
    id: "T01",
    time: "01:52 AM",
    title: "Alex Morgan enters the facility",
    description:
      "Morgan badges in at the main entrance, beginning the late-night security patrol. Entry log confirms the timestamp.",
    location: "Main Entrance",
    peopleInvolved: ["S01"],
    relatedEvidence: ["E08"],
  },
  {
    id: "T02",
    time: "02:01 AM",
    title: "Michael Stone accesses the storage room",
    description:
      "Stone swipes his card at the storage room entrance to begin the maintenance procedure logged earlier that day.",
    location: "Storage Room",
    peopleInvolved: ["S04"],
    relatedEvidence: ["E10"],
  },
  {
    id: "T03",
    time: "02:03 AM",
    title: "Security camera loses signal",
    description:
      "The south corridor camera goes offline without a prior fault indicator. The disruption lasts ten minutes and twenty seconds. No logged maintenance or scheduled downtime.",
    location: "South Corridor",
    peopleInvolved: [],
    relatedEvidence: ["E07"],
  },
  {
    id: "T04",
    time: "02:08 AM",
    title: "Access report deleted from security terminal",
    description:
      "A 48-hour badge access report is retrieved and then permanently deleted from the security office terminal. Sarah Cole's card was in use at the terminal at this time.",
    location: "Security Office",
    peopleInvolved: ["S03"],
    relatedEvidence: ["E09", "E12"],
  },
  {
    id: "T05",
    time: "02:17 AM",
    title: "Prototype disappears",
    description:
      "The vault keypad is triggered with a valid level-3 clearance code. The prototype is later confirmed missing. A partial fingerprint is recovered from the door handle.",
    location: "Prototype Vault",
    peopleInvolved: ["S03", "S04"],
    relatedEvidence: ["E10", "E11"],
  },
  {
    id: "T06",
    time: "02:21 AM",
    title: "Security system is restored",
    description:
      "The south corridor camera signal returns. Automated monitoring resumes. No automated alert was generated for the ten-minute outage.",
    location: "Security Control Room",
    peopleInvolved: [],
    relatedEvidence: ["E07"],
  },
  {
    id: "T07",
    time: "02:31 AM",
    title: "Daniel Reed triggers internal alarm",
    description:
      "Reed opens a restricted door from inside the laboratory, triggering a secondary alarm. He states he was attempting to check the corridor after hearing noise.",
    location: "Laboratory",
    peopleInvolved: ["S02"],
    relatedEvidence: ["E07"],
  },
  {
    id: "T08",
    time: "02:34 AM",
    title: "Emily Carter is intercepted by Morgan",
    description:
      "Morgan encounters Carter in the east corridor. Carter claims she was heading to her office. Neither individual was flagged in the camera footage gap.",
    location: "East Corridor",
    peopleInvolved: ["S01", "S05"],
    relatedEvidence: ["E08"],
  },
  {
    id: "T09",
    time: "02:47 AM",
    title: "Facility placed on lock-down",
    description:
      "The facility director orders a full lock-down after the vault alarm is escalated. All personnel are instructed to remain in place and await security.",
    location: "Facility-wide",
    peopleInvolved: [],
    relatedEvidence: [],
  },
  {
    id: "T10",
    time: "03:02 AM",
    title: "Investigators arrive on-site",
    description:
      "External investigators arrive at the facility to begin the formal inquiry. All security logs and personnel statements are formally preserved.",
    location: "Main Entrance",
    peopleInvolved: [],
    relatedEvidence: [],
  },
];

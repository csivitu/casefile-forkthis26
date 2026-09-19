# 🔍 CASEFILE — Interactive Investigation System

CASEFILE is an interactive, single-case detective investigation mobile and web application built with **React Native**, **Expo Router**, and **TypeScript**.

---

##  Quick Start & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
You can run the app directly in your web browser or on your phone via Expo Go:

- **Run in Web Browser (Fastest):**
  ```bash
  npx expo start --web
  ```
  *(Press `w` in the terminal to launch the browser if it does not open automatically)*

- **Run on Mobile (iOS / Android via Expo Go):**
  ```bash
  npx expo start
  ```
  *(Scan the QR code in the terminal using your camera on iOS or the Expo Go app on Android)*

---

##  Application Overview & Navigation

CASEFILE follows a centralized investigation hub architecture:

```text
Home (Case Entrance)
  └── Case Overview (Investigation Hub)
        ├──  Suspects (Dossiers, statements, alibis)
        ├──  Evidence (Catalog, logs, digital records)
        ├──  Timeline (Chronological event sequence)
        └──  Investigation
              ├── Notes (Interactive detective notebook)
              └── Conclusion (Final suspect accusation)
```

- **Home:** Case introduction and entrance button.
- **Case Overview:** Summary of active investigation data and quick navigation to all sub-modules.
- **Suspects:** Detailed profiles, suspect alibis, and associated evidence links.
- **Evidence:** Categorized records (CCTV, Forensic, Digital, Security Records) with filtering.
- **Timeline:** Sequence of logged facility events.
- **Investigation:** Detective scratchpad with persistent storage and final accusation submission.

---

## 📁 Project Structure

```text
src/
├── app/                  # Expo Router file-based screens
│   ├── index.tsx         # Home entrance screen
│   ├── overview.tsx      # Case Overview hub
│   ├── suspects/         # Suspect list & detail screens
│   ├── evidence/         # Evidence gallery & detail screens
│   ├── timeline/         # Timeline list & event detail screens
│   └── investigation/    # Notes & conclusion screens
├── components/           # Reusable UI elements (Headers, Cards, Tags)
├── constants/            # Design system, typography, and colors
├── data/                 # Case records and static entities (case.ts)
├── storage/              # Local persistence layer (AsyncStorage)
└── types/                # TypeScript interfaces & data models
```

---

##  Contribution & Challenge Guidelines

1. **Fork the Repository** to your own GitHub account.
2. **Create a Feature Branch** for the issue you are tackling:
   ```bash
   git checkout -b fix/issue-name
   ```
3. **Verify Your Changes** on both Web and Mobile previews before committing.
4. **Submit a Pull Request** linking to the relevant issue (e.g. `Fixes #3`).

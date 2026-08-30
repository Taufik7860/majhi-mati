# 🏛️ Majhi Mati
## Government Project Development Monitoring & Governance System

> A digital platform for transparent, phase-wise monitoring of government development projects and citizen participation.

---

## 📖 About the Project

**Majhi Mati** is a web-based development monitoring and governance platform designed for Municipal Councils and citizens.

The system connects **citizens, municipal officers, and government project data** in one platform.

It helps track a government project from its initial concept to completion while improving transparency, accountability, and citizen participation.

### 🎯 Main Objectives

- Monitor government projects phase-by-phase
- Provide citizens with project information
- Allow officers to manage and update projects
- Track project progress and milestones
- Monitor budgets and financial utilization
- Maintain project documents
- Record inspections, issues, and risks
- Provide citizen feedback and participation
- Improve transparency between citizens and officers
- Generate downloadable project and budget reports

---

# 🏗️ System Architecture

```mermaid
flowchart TD

    A[Citizen / Officer] --> B[React Frontend]

    B --> C[Authentication]

    C --> D[Supabase Authentication]

    D --> E{User Role}

    E -->|Citizen| F[Citizen Dashboard]
    E -->|Officer| G[Officer Dashboard]

    F --> H[Project Information]
    F --> I[Project Progress]
    F --> J[Citizen Feedback]
    F --> K[Project Documents]
    F --> L[Notifications]

    G --> M[Project Management]
    G --> N[Progress Updates]
    G --> O[Budget & Financial Data]
    G --> P[Approvals]
    G --> Q[Inspections]
    G --> R[Issues & Risks]
    G --> S[Reports]

    H --> T[(Supabase Database)]
    M --> T
    N --> T
    O --> T
    P --> T
    Q --> T
    R --> T
    J --> T  """


| Module                | Information                        |
| --------------------- | ---------------------------------- |
| Project Information   | Name, ID, department               |
| Scope                 | Work covered by project            |
| Location              | Project location                   |
| Budget                | Approved project budget            |
| Phases                | Development phases                 |
| Milestones            | Important project targets          |
| Contractors           | Contractor information             |
| Progress              | Current work completion            |
| Financial Utilization | Amount spent                       |
| Documents             | DPR, approvals, contracts          |
| Inspections           | Inspection records                 |
| Issues / Risks        | Problems affecting project         |
| Approvals             | Administrative/financial approvals |
| Audit Trail           | History of changes                 |
| KPIs                  | Project performance indicators     |



📥 Reports & Downloads

The system provides downloadable project information.

📄 Project Report

Project information can be exported into Word format.

Example:

Project Name
Project ID
Location
Scope
Budget
Phases
Milestones
Contractor
Current Progress
Financial Utilization
Issues
Approvals
Inspection Details
Citizen Feedback


📊 Budget Report

Budget information can be exported into CSV format.

Example:

Project ID,Project Name,Approved Budget,Utilized Amount,Remaining Amount,Progress
P001,Road Development,5000000,3200000,1800000,64%
P002,Water Pipeline,3500000,2100000,1400000,60%
🧠 Project Priority & Decision Support

Citizens and officers can contribute to project prioritization.

A project can be evaluated based on:

Public need
Number of affected citizens
Project urgency
Estimated cost
Current progress
Social impact
Infrastructure importance
Citizen feedback

The system can then help officers identify which projects should receive higher priority.

🛠️ Technology Stack
Frontend
React.js
Vite
React Router
Lucide React
CSS
Backend / Database
Supabase
Supabase Authentication
PostgreSQL
Development
Node.js
npm
Git
GitHub
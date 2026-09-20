Overview
Your task is to build a frontend application based on the functionality and requirements described in this CV Builder Wiki.

The project is designed to simulate a real production workflow and help trainees practice:

- team collaboration
- architecture decisions
- API integration
- building scalable UI
- writing maintainable and testable code

<aside>
💡 **Project Context & Architecture Status**: See [.antigravity/context.md](./context.md) for the active architectural state, review findings, and module progress tracker.
</aside>

---

# Project Goal

The goal of the project is to create a modern CV Builder application where users can:

- create and edit CVs
- manage profile information
- customize resume sections
- preview generated CVs
- communicate with backend APIs using GraphQL

---

# Application Requirements

The application should include:

- responsive layouts
- reusable UI components
- routing and navigation
- form handling and validation
- loading and error states
- API integration
- clean and maintainable code structure

---

# Design Reference

Figma: CV Builder Design

### Requirements

- The final implementation should be as close to the provided design as possible.
- The application must support responsive layouts across desktop and tablet.
- Both Light and Dark themes should be implemented if presented in design layouts.
- Minor animations and transitions may be simplified if necessary.

---

# Backend API

GitHub repository to run backend locally: CV Builder API

### Requirements

- The frontend application must interact with the provided backend API.
- GraphQL should be used for all data operations.
- Proper error handling and loading states should be implemented.

---

# Technical Stack

Choose the stack according to your internship direction.

## React Internship

Required stack:

- Next.js
- TypeScript
- Vitest
- React Testing Library
- GraphQL + Apollo
- Cypress or Playwright (optional)

<aside>
💡

If additional technologies are required (UI libraries, form validation libraries, etc.), the team should decide independently.

</aside>

---

# Testing Requirements

The project should include:

- unit tests
- component tests
- basic end-to-end tests (optional)

---

# Team Workflow Recommendations

Recommended practices:

- use GitFlow or feature branches
- create pull requests for feature delivery
- perform code reviews within the team
- split tasks before implementation

---

# Evaluation Criteria

The following aspects will be considered during project evaluation:

- application architecture and folder structure
- code quality, readability, and maintainability
- component reusability
- responsive implementation quality
- consistency with the provided design
- proper state and API handling

---

| Module         | Page                     | Access      |
| -------------- | ------------------------ | ----------- |
| Authentication | Sign In                  | Public      |
| Authentication | Sign Up                  | Public      |
| Authentication | Forgot Password          | Public      |
| Authentication | Reset Password           | Public      |
| Authentication | Email Verification       | Public      |
| System         | Not Found (404)          | Public      |
| System         | No Internet Error        | Public      |
| System         | Unsupported Device       | Public      |
| Users          | Users (Main Page)        | User, Admin |
| Users          | User Profile             | User, Admin |
| Users          | User Skills              | User, Admin |
| Users          | User Languages           | User, Admin |
| Users          | User CVs list            | Admin       |
| Skills         | Skills (User Version)    | User        |
| Skills         | Skills Management        | Admin       |
| Languages      | Languages (User Version) | User        |
| Languages      | Languages Management     | Admin       |
| CVs            | CV List                  | User, Admin |
| CVs            | CV Details               | User, Admin |
| CVs            | CV Skills                | User, Admin |
| CVs            | CV Projects              | User, Admin |
| CVs            | CV Preview               | User, Admin |
| Positions      | Positions Management     | Admin       |
| Departments    | Departments Management   | Admin       |
| Projects       | Projects Management      | Admin       |
| Settings       | Settings                 | User, Admin |

# Expected Result

By the end of the internship task, the team should deliver:

- a working frontend application
- responsive UI implementation
- working backend integration
- clean project structure
- documented setup instructions

---

# Submission Requirements

The final repository should include:

- source code
- clear project setup and run instructions
- environment configuration example
- testing instructions
- deployed application link (optional)

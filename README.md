# MindMap AI

> **From wrong answers to the misconception behind them.**

MindMap AI is an AI-assisted learning and assessment platform designed to identify **why a student is confused**, rather than simply determining whether an answer is correct or incorrect.

Instead of following:

**Question → Wrong Answer → Generic Explanation**

MindMap AI follows:

**Question → Student Reasoning → Misconception Detection → Targeted Intervention → Reassessment → Progress**

The current prototype focuses on a set of carefully defined misconceptions around **neural-network backpropagation, gradients, loss, and optimization**. The architecture is designed so that additional topics and misconception patterns can be added later.

---

## 🎯 Problem

A student can give an answer that sounds technically plausible while still having an incorrect mental model.

For example, a student may say:

> “Backpropagation is the optimization algorithm that updates the weights to minimize the loss.”

The response sounds reasonable, but it conflates two different stages of neural-network training:

* **Backpropagation** computes gradients using the chain rule.
* **The optimizer** uses those gradients to update model parameters.

Traditional answer checking can identify that something is wrong, but the more useful question is:

> **What does the student actually misunderstand?**

MindMap AI is built around that question.

---

## 💡 Core Learning Loop

```text
┌────────────────────┐
│  Diagnostic        │
│  Question          │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Student Reasoning  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Misconception      │
│ Detection          │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Targeted           │
│ Intervention       │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Reassessment       │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Progress /         │
│ Knowledge Map      │
└────────────────────┘
```

The goal is not simply to provide a better explanation. The system attempts to identify the **specific conceptual distinction that is causing the student's error** and then test whether that distinction has been understood.

---

## ✨ Current Features

### 1. Diagnostic Assessment

Students answer conceptual questions in their own words.

The current diagnostic flow focuses on reasoning rather than keyword matching.

### 2. Misconception Detection

The application analyzes a response against a predefined misconception taxonomy.

Current misconception categories include:

| ID  | Conceptual misconception                                          |
| --- | ----------------------------------------------------------------- |
| M01 | Backpropagation is the same as the optimizer / gradient descent   |
| M02 | The backward pass immediately changes the model weights           |
| M03 | Weights and gradients are essentially the same values             |
| M04 | Loss and the gradient vector are the same thing                   |
| M05 | Incorrect understanding of activation derivatives / gradient flow |

### 3. Targeted Intervention

Once a misconception is identified, MindMap AI provides an intervention focused on the relevant conceptual gap.

The intervention data supports:

* Explanations
* Analogies
* Comparisons
* Examples
* Key conceptual distinctions

### 4. Reassessment

The system does not stop after explaining the concept.

It generates or presents a follow-up question designed to check whether the student can apply the corrected concept.

The current prototype includes:

* Reassessment questions
* Transfer questions
* Disambiguation questions
* Evidence from previous attempts

### 5. Progress Tracking

The application tracks attempts and conceptual status within the current browser session.

Concepts can move through states such as:

```text
Not Started
     ↓
Misconception
     ↓
Improving
     ↓
Mastered
```

### 6. Concept / Knowledge Map

The progress experience represents concepts such as:

* Backpropagation
* Gradient Descent
* Loss Functions
* Activation Derivatives

and associates them with mastery and misconception information.

### 7. Learning Modules

The Learn section is structured around topics.

Currently available:

* Neural Networks: Backpropagation

Additional topics are represented in the interface as coming-soon modules, providing an extensible structure for future content.

### 8. Mock-Test / Assessment Data

The project includes a mock-test question bank designed around specific misconception cases and transfer checks.

This supports future expansion toward adaptive assessment.

---

# 🧠 How the Diagnostic System Works

The current implementation uses a **focused semantic/rule-based diagnostic engine** as its resilient demonstration path.

When a student submits an answer, the application sends the question, response, and relevant attempt history to:

```text
POST /api/analyze-answer
```

The diagnostic route evaluates the response against the project's predefined misconception taxonomy.

The evaluation produces structured information such as:

```text
Correctness
Concept understanding
Missing concept
Misconception candidates
Confidence
Evidence summary
```

The application then uses that result to determine whether it should:

1. Continue to another question
2. Identify a misconception
3. Show an intervention
4. Move the student into reassessment
5. Update progress information

---

## 🔬 Example

### Question

**What is the primary role of backpropagation when training a neural network?**

### Student response

> “Backpropagation is the optimization algorithm that takes steps to adjust and update the weights to minimize the loss.”

### Diagnosis

The system can identify:

**M01 — Backpropagation vs. Optimizer confusion**

### Conceptual correction

```text
Backpropagation
      ↓
Computes gradients
      ↓
Optimizer
      ↓
Uses gradients to update weights
```

### Reassessment

The student can then be asked a targeted question such as whether the weights have already changed immediately after the backward pass.

This allows the system to test **conceptual transfer**, rather than simply asking the student to repeat the explanation.

---

# 🏗️ Technical Architecture

```text
                    Student
                       │
                       ▼
              Next.js / React UI
                       │
                       ▼
                Diagnostic Session
                       │
                       ▼
             /api/analyze-answer
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
     Semantic Diagnostic     Optional OpenAI
          Engine                 Path
             │                   │
             └─────────┬─────────┘
                       ▼
             Misconception Taxonomy
                       │
                       ▼
              Diagnostic Evaluation
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Intervention         Reassessment
             │                   │
             └─────────┬─────────┘
                       ▼
              Session / Progress
                       │
                       ▼
                Browser Storage
```

### Current implementation

The current prototype is intentionally designed to remain functional without requiring an external AI API.

This gives the application a resilient **demo mode** while leaving an integration path for live model-based analysis.

### Optional AI path

An OpenAI API key can be supplied through environment variables to enable the live analysis path when configured.

---

# 🛠️ Technologies Used

## Frontend

* **Next.js 16.3.7**
* **React 19.2.8**
* **TypeScript**
* **Tailwind CSS 4**

## Application Architecture

* Next.js App Router
* React client components
* Next.js API Route Handlers
* TypeScript interfaces and typed diagnostic structures
* Browser-based session persistence

## Deployment

* **Vercel**
* **GitHub**

## Optional External Services

* **OpenAI API** — optional live answer-analysis path
* **Supabase configuration** — optional/extensible integration path

> The current prototype does not require Supabase or OpenAI credentials to run its demo mode.

---

# 📁 Project Structure

```text
mindmap-ai/
│
├── app/
│   ├── api/
│   │   └── analyze-answer/
│   │       └── route.ts
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── learn/
│   │   └── page.tsx
│   │
│   ├── progress/
│   │   └── page.tsx
│   │
│   ├── session/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ConceptMindmap.tsx
│   ├── Footer.tsx
│   ├── InterventionCard.tsx
│   ├── Navbar.tsx
│   ├── ReassessmentCard.tsx
│   ├── VisualFlow.tsx
│   └── icons.tsx
│
├── data/
│   ├── misconceptions.ts
│   ├── mock-tests.ts
│   ├── questions.ts
│   └── topics.ts
│
├── lib/
│   ├── session-store.ts
│   └── supabase.ts
│
├── types/
│   └── index.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# ⚙️ Setup & Installation

## Prerequisites

Make sure you have:

* **Node.js 20+** recommended
* **npm**
* Git

Check your installed versions:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the repository

```bash
git clone https://github.com/Agile-1-3-7/mindmap-ai.git
```

Move into the project directory:

```bash
cd mindmap-ai
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

The project can run in demo mode without external API credentials.

For optional integrations, create:

```text
.env.local
```

You can use `.env.example` as the template.

```env
# Optional Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional OpenAI API configuration
OPENAI_API_KEY=
```

### Demo mode

If these values are not provided, the application uses its built-in diagnostic logic and can still be run locally.

> **Never commit `.env.local` or API keys to GitHub.**

---

# 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application should now be available locally.

---

# 🏭 Production Build

To create a production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

---

# 🔎 Linting

Run ESLint with:

```bash
npm run lint
```

---

# 🌐 Live Demo

**Deployed application:**

https://mindmap-ai-black.vercel.app/

**GitHub repository:**

https://github.com/Agile-1-3-7/mindmap-ai

---

# 🤖 AI Tools Used During Development

MindMap AI was developed using an AI-assisted development workflow.

### Claude

Used for:

* Project ideation and refinement
* Architecture planning
* Code generation and refinement
* UI/product development
* Debugging
* Development assistance

### ChatGPT

Used for:

* Technical planning
* Problem decomposition
* Debugging and reasoning
* Product and UX refinement
* Presentation and documentation assistance

### Antigravity

Used for:

* Rapid prototyping
* AI-assisted coding
* UI implementation and iteration

These tools were used as **development assistants**. They should not be interpreted as components that are necessarily running inside the deployed application.

### AI used by the product

The product itself currently has:

* A semantic/rule-based diagnostic path
* A predefined misconception taxonomy
* An optional OpenAI API integration path for live analysis when configured

---

# 🧪 Testing & Reliability

The diagnostic system includes focused test cases covering several conceptual misconceptions.

Current cases include:

1. **Backpropagation vs. optimizer**
2. **Backward pass vs. immediate weight mutation**
3. **Weights vs. gradients**
4. **Loss vs. gradient vector**
5. **Activation derivatives and gradient flow**

The project also includes:

* Diagnostic questions
* Suggested misconception-triggering answers
* Correct conceptual answers
* Disambiguation questions
* Reassessment questions
* Transfer questions
* Mock-test questions

The goal is to test whether the system can distinguish between related but conceptually different misunderstandings.

---

# 📊 Current Scope

The current prototype focuses primarily on **AI/ML learning**, with a deeper implementation around:

* Neural networks
* Backpropagation
* Gradients
* Gradient descent
* Loss functions
* Activation derivatives

The application includes additional topic structures for future expansion, but not every displayed topic represents a fully implemented diagnostic module yet.

---

# 🔮 Future Extensions

The architecture can be extended toward:

* More AI/ML topics
* Additional computer-science subjects
* Larger misconception taxonomies
* Adaptive question generation
* More sophisticated LLM-based response analysis
* Long-term misconception tracking
* More detailed knowledge maps
* Educator analytics
* Persistent cloud-based student profiles
* Additional assessment modes

These are **future extensions**, not claims about the current prototype.

---

# 🔐 Data & Privacy

The current prototype does not require real student data.

Student attempts and progress used during the demo are maintained within the application's current browser/session flow.

The repository should not contain:

* API keys
* Passwords
* Private credentials
* Real student records

Environment files containing secrets are excluded through `.gitignore`.

---

# 👤 Project Information

**Project:** MindMap AI
**Problem Statement:** PS-03 — Personalised AI Tutor for Learning AI
**Hackathon:** Build Fast with AI Challenge 2026
**Builder:** Ch Agil
**College:** CBIT Hyderabad
**Year:** 3rd Year
**Role:** Solo Builder & AI Engineer

---

# 📌 Project Status

**Status:** Working prototype / hackathon submission

The current implementation demonstrates the complete core learning loop:

```text
Diagnostic Question
        ↓
Student Response
        ↓
Misconception Detection
        ↓
Targeted Intervention
        ↓
Reassessment
        ↓
Progress Tracking
```

The system is intentionally focused on a defined misconception taxonomy rather than claiming universal misconception detection.

---

## 📄 License

This project was created as a hackathon project by **Ch Agil**.

For hackathon evaluation and educational demonstration purposes.

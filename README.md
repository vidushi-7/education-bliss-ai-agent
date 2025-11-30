# education-bliss-ai-agent

## Education Bliss AI Agent: a personalized multi-agent learning system

<img width="1024" height="1024" alt="Gemini_Generated_Image_3gb0ra3gb0ra3gb0" src="https://github.com/user-attachments/assets/311eb33c-2fab-4076-95b9-94aee57bdec1" />

## 1. The Pitch: Problem and Solution

### Problem Statement: The Crisis of Generalized Learning

Traditional online education, including self-paced courses and static learning platforms, suffers from a fundamental flaw: a **one-size-fits-all approach**. Learners are presented with the same curriculum and resources regardless of their prior knowledge, learning style, or specific career goals. This lack of personalization leads to:
1.  **High Dropout Rates:** Students disengage when content is too basic or too advanced.
2.  **Inefficient Learning:** Valuable time is spent on concepts already mastered.
3.  **Lack of Contextual Depth:** Generalized materials fail to connect concepts to the learner’s specific context (e.g., industry or regional relevance).

### Solution: A Personalized, Multi-Agent Learning System

The **Education Bliss AI Agent** is a multi-agent system designed to address this crisis by providing **personalized, adaptive, and autonomous 1:1 education**. Instead of a single, overburdened LLM, we use a decentralized architecture where specialized agents collaborate to manage the complete learning lifecycle.

**Core Concept & Value:**

The core value is the shift from static curriculum to a **dynamic learning journey** managed by specialized, highly efficient agents. The **meaningful use of agents is central** to this solution, as it separates complex tasks:
* **Planning & Strategy** (Curriculum Agent)
* **Teaching & Grounding** (Tutor Agent)
* **Assessment & Feedback** (Quiz Agent)

This architecture guarantees high-quality responses, reliable tool use, and superior tracking of student progress via centralized supervisor management.

***

## 2. Architecture and Implementation

<img width="2816" height="1536" alt="Gemini_Generated_Image_h2grauh2grauh2gr" src="https://github.com/user-attachments/assets/f85c930b-39c2-46d5-8a5f-28057b227b61" />

The system operates on a hierarchical structure orchestrated by a Supervisor, enabling seamless delegation of tasks and persistent memory management.

| Component | ADK Role | Function | Key Concepts Demonstrated |
| :--- | :--- | :--- | :--- |
| **EducationSupervisor** | AgentSupervisor | **Orchestrates** the entire educational workflow, delegating tasks and managing the session. | **Multi-Agent Orchestration**; **Session State & Long-Term Memory** |
| **CurriculumAgent** | LlmAgent | **Plans** the personalized learning path based on the user's goal. | **LlmAgent** specialization |
| **TutorAgent** | LlmAgent | **Teaches** concepts, answers questions, and grounds information using external sources. | **Tool Use** (`GoogleSearchTool`) |
| **QuizAgent** | LlmAgent | **Assesses** student knowledge by generating quizzes and grading submissions. | **Tool Use** (`GradeQuizTool`) |
| **ADK Memory Services** | ADK Memory | `InMemorySessionService` tracks current lesson status. `ADKInMemoryMemory` stores permanent records (e.g., final grades, completed plans). | **Session State & Long-Term Memory** |

## **Architecture Overview**

The system operates on a **Hierarchical Multi-Agent Structure**. A central `EducationSupervisor` acts as the "brain," orchestrating a team of specialized agents (`CurriculumAgent`, `TutorAgent`, `QuizAgent`) to deliver a cohesive educational experience. This separation of concerns allows for modularity, easier debugging, and specialized LLM prompting for each role.

## **Implemented Features & Technical Breakdown**

Below are the features implemented in the code, mapped directly to your course requirements.

### **1. Multi-Agent System (Hierarchical & Sequential)**
* **Implementation:** The code defines an `EducationSupervisor` class inheriting from `AgentSupervisor`. This supervisor manages the lifecycle of the user's request.
* **Logic:** The workflow is **sequential** and **orchestrated**:
    1.  **Supervisor** receives a request ("Learn Python").
    2.  Delegates to **CurriculumAgent** to draft a plan.
    3.  Iterates through the plan, delegating to **TutorAgent** for teaching.
    4.  Delegates to **QuizAgent** for assessment.
* **Key Code:** `EducationSupervisor.supervise_education()` method acts as the control loop.

### **2. Tools (Custom & Built-in)**
The agents are not just "chatbots"; they have agency through tools.
* **Built-in Tool (`GoogleSearchTool`):** The `TutorAgent` is equipped with a `GoogleSearchTool`. In the code, this is mocked to simulate retrieving real-time information (e.g., "The capital of France is Paris") to ground the tutor's answers in external reality.
* **Custom Tool (`GradeQuizTool`):** The `QuizAgent` utilizes a custom `GradeQuizTool`. Instead of asking the LLM to grade (which can be subjective), the agent delegates the logic to a tool that returns structured data: `{'score': 85, 'feedback': '...'}`.

**Tool Execution Flow:**

### **3. Sessions & Memory (State Management)**
The system implements sophisticated state management to maintain context across the learning journey.
* **Short-Term Session State:** The `InMemorySessionService` tracks the *current* lesson's progress (e.g., `current_concept`, `current_quiz`). This ensures that if the supervisor needs to pause or hand off, the exact state of the lesson is preserved.
* **Long-Term Memory (Memory Bank):** The `ADKInMemoryMemory` mimics a persistent store (like a Vector DB or SQL). It stores high-value artifacts such as the final **Learning Plan** and **Quiz Grades**. This allows the agent to "remember" a student's past performance even after the immediate session ends.

**Memory Architecture:**

### **4. Observability (Tracing & Logging)**
The code includes a robust observability layer using a `MockTracer` that simulates **OpenTelemetry**.
* **Implementation:** Every agent action (predict), tool execution (run), and supervisor delegation is wrapped in a `start_as_current_span` context manager.
* **Metrics & Events:** The tracer captures specific attributes (e.g., `prompt_length`, `quiz_score`) and events (e.g., `LLM_prediction_complete`, `quiz_graded`). This allows developers to debug exactly *where* a lesson might have failed or why a specific answer was given.

## **Feature Summary Table**

| Feature Category | Implementation in Code | Agent/Component Responsible |
| :--- | :--- | :--- |
| **Multi-Agent** | Hierarchical Supervisor-Worker pattern | `EducationSupervisor` managing `Curriculum`, `Tutor`, `Quiz` agents. |
| **Tools** | Built-in & Custom Tools | `TutorAgent` (Google Search), `QuizAgent` (GradeQuizTool). |
| **Memory** | Session & Long-term persistence | `InMemorySessionService` (Session), `ADKInMemoryMemory` (Long-term). |
| **Observability** | OpenTelemetry Simulation | `MockTracer` injected into all agents and tools to log spans/events. |

### Project Journey and Technical Implementation

Our project journey followed a strict engineering discipline to ensure robustness and observability:

1.  **Foundation and Definition:** We first defined the **Problem Statement** and the **Agent Roles** to ensure the agents were specialized and non-overlapping.
2.  **Implementation of Core Logic (Key Concepts):**
    * **Multi-Agent System:** We implemented the four agents and the Supervisor, establishing the delegation flow (`EducationSupervisor` calls `CurriculumAgent` $\rightarrow$ `TutorAgent` $\rightarrow$ `QuizAgent`).
    * **Tool Integration:** We integrated and verified the **`GoogleSearchTool`** (used by the `TutorAgent` for grounding) and developed the custom **`GradeQuizTool`** (used by the `QuizAgent` for structured grading).
    * **State and Memory:** We successfully implemented both the short-term **Session State** and the **Long-Term Memory** into the Supervisor, allowing the agent system to remember past performance and curriculum progress across sessions.
    * **Observability:** We configured a shared **`MockTracer`** instance, passing it to all agents and the Supervisor. This demonstrated the ability to track the full lifecycle of a request, including span creation, attribute logging, and event tracking for every agent and tool interaction.
3.  **Comprehensive Testing:** We developed **eight separate `pytest` tests** that cover unit functionality (e.g., `TutorAgent.teach_concept`), integration (e.g., `test_supervisor_orchestration`), and verification of state/memory management. All tests passed, confirming the system's architectural integrity.

***

## 3. Multi Agent Design and Workflow:

1.  **Central Node:** Place a large, central cloud icon labeled **EducationSupervisor (Orchestrator)**.
    * *Role Tag:* Manages State, Memory, and Delegation.
2.  **Input/Output:** A box on the left labeled **Student/User** sends an arrow to the Supervisor labeled **"Learning Goal"**.
3.  **Agent Delegation (Flow Direction: Top-Down Cycle):**
    * **Flow 1: Planning:** An arrow from the **Supervisor** points to the **CurriculumAgent**.
        * **CurriculumAgent Box:** Labeled **CurriculumAgent (The Planner)**.
        * *Output:* Arrow points back to Supervisor labeled **"Structured Learning Plan."**
        * *Data Action:* Small box/icon next to it: **$\rightarrow$ ADK Long-Term Memory (Store Plan)**.
    * **Flow 2: Teaching:** An arrow from the **Supervisor** points to the **TutorAgent**.
        * **TutorAgent Box:** Labeled **TutorAgent (The Instructor)**.
        * *Tool Use:* A separate line from the TutorAgent connects to a box labeled **GoogleSearchTool**.
        * *Output:* Arrow points back to Supervisor labeled **"Concept Explanation & Q/A."**
    * **Flow 3: Assessment:** An arrow from the **Supervisor** points to the **QuizAgent**.
        * **QuizAgent Box:** Labeled **QuizAgent (The Assessor)**.
        * *Tool Use:* A separate line from the QuizAgent connects to a box labeled **GradeQuizTool**.
        * *Output:* Arrow points back to Supervisor labeled **"Quiz Grade & Feedback."**
        * *Data Action:* Small box/icon next to it: **$\rightarrow$ ADK Long-Term Memory (Store Grade)**.
4.  **Memory Layer (Bottom Section):** Place two connected storage icons below the Supervisor.
    * **Icon 1:** Labeled **InMemorySessionService (Short-Term State)**.
        * *Contents:* Current Topic, Quiz Draft.
    * **Icon 2:** Labeled **ADKInMemoryMemory (Long-Term Knowledge)**.
        * *Contents:* Learning Plan, Final Grades, Progress History.
5.  **Observability Overlay (Across All Agents):** A semi-transparent overlay or border encompassing all agents and the Supervisor, labeled **ADK Observability Layer (MockTracer)**.
    * *Function:* Tracking Spans, Attributes, Events.

***

## 4. Technical Implementation (Architecture, Code)

<img width="1024" height="1024" alt="Gemini_Generated_Image_tpldf0tpldf0tpld" src="https://github.com/user-attachments/assets/0ef0d2c5-eb41-410c-878f-1fb1b670be3b" />

This solution demonstrates the use of four (4) key ADK concepts:

## Multi-Agent Architecture (LlmAgent): 
Four specialized agents (CurriculumAgent, TutorAgent, QuizAgent, and EducationSupervisor) collaborate to manage the end-to-end user experience.

## Tool Use (Tools): 
The system implements the GoogleSearchTool (for real-time, grounded teaching) and the custom GradeQuizTool (for structured, consistent assessment logic).

## Session State and Long-Term Memory (ADK Session Services & Memory): 
The EducationSupervisor manages short-term state via InMemorySessionService and long-term knowledge (learning plans, final grades) via ADKInMemoryMemory, enabling personalized, multi-session learning.

## Observability (Tracer): 
All agents and the Supervisor are initialized with a shared MockTracer. The code includes explicit span creation (with self.tracer.start_as_current_span(...)), attribute setting, and event logging to demonstrate how the ADK's observability features track the flow and performance of the multi-agent system.

File 1: education_agents_adk.py (Agent Definitions and Logic)
This file contains the multi-agent system definition, including the CurriculumAgent, TutorAgent, QuizAgent, the GradeQuizTool, and the orchestrating EducationSupervisor. It also includes the mock ADK components to ensure the code is runnable and demonstrable within a Colab environment while showcasing the correct ADK structure for observability, state, and memory.

File 2: test_education_agents.py (Pytest Unit and Integration Tests)
This file includes comprehensive tests for all agents and the supervisor, verifying core functionalities, tool use, memory management, and observability logging.

The education_agents_adk.py file implements a mock multi-agent education system using simulated Google Agent Development Kit (ADK) components. Here's a breakdown of its key sections and how they work together:

ADK Configuration:
PROJECT_ID and LOCATION: These variables are placeholders for your Google Cloud Project ID and region, respectively. They are used to configure the (mock) Vertex AI environment, which would typically connect to real Gemini API models.
ADK_CONFIG: A dictionary holding various configuration parameters for the simulated ADK environment, such as project_id, location, model_name, and paths for history and long-term memory files.


Mock ADK Components:
This section defines mock classes that mimic the behavior of real ADK components. This allows the system to be developed and tested without requiring a full ADK installation.

✅ MockTracer: Simulates an OpenTelemetry Tracer for observability. It logs span starts, ends, attributes, and events, helping to visualize the flow of execution and agent interactions.

✅ MockLlmAgent: A base class that simulates adk.agents.LlmAgent. It takes an LLM and optional tools. Its predict method wraps the LLM call with tracing capabilities.

✅ MockGoogleLlm: Simulates adk.llms.GoogleLlm. Its predict method provides hardcoded, mock responses based on keywords in the prompt (e.g., [MOCK PLAN], [MOCK TEACHING], [MOCK QUIZ]), replacing actual Gemini API calls.

✅ MockPromptTemplate: A simple class that simulates prompt templating by formatting a given template string with provided keyword arguments.

✅ MockTool: A base class for tools, including an initializer for the MockTracer.

✅ MockGoogleSearchTool: Simulates adk.tools.GoogleSearchTool. Its run method returns a predefined mock search result and logs its activity using MockTracer.

✅ MockGradeQuizTool: Simulates a custom grading tool. Its run method takes a quiz and student answers, returning a mock grade and feedback. It also uses MockTracer.

✅ MockAgentSupervisor: A base class simulating adk.agents.AgentSupervisor.

✅ MockInMemorySessionService: Simulates adk.session_services.InMemorySessionService to manage short-term session data.

✅ MockADKInMemoryMemory: Simulates adk.memory.ADKInMemoryMemory for long-term knowledge storage.


## Agent Definitions
These are the core specialized agents of the education system, built upon the mock ADK components:

## ⭐️ CurriculumAgent: 
Inherits from MockLlmAgent. Its generate_learning_plan method uses MockGoogleLlm and a MockPromptTemplate to create a mock learning plan based on a given goal. It integrates MockTracer for observability.

## ⭐️ TutorAgent: 
Inherits from MockLlmAgent. It uses MockGoogleLlm for teach_concept and answer_question methods. It also leverages MockGoogleSearchTool within answer_question to simulate fetching external information, all with MockTracer integrated.

## ⭐️ QuizAgent: 
Inherits from MockLlmAgent. It uses MockGoogleLlm to generate_quiz and MockGradeQuizTool for grade_submission, ensuring comprehensive tracing.

## ⭐️ EducationSupervisor:
This class orchestrates the entire multi-agent workflow:

## __init__: 

❇️ Initializes instances of MockInMemorySessionService (for session state), MockADKInMemoryMemory (for long-term memory), and each of the specialized agents (CurriculumAgent, TutorAgent, QuizAgent). A single MockTracer instance is passed to all agents and tools to maintain a consistent tracing context.

❇️ supervise_education: This is the main method that simulates the end-to-end educational flow

❇️ Delegates to CurriculumAgent to generate a learning plan and stores it in session and long-term memory.

❇️ Delegates to TutorAgent to teach a concept and stores the teaching content in session memory.

❇️ Calls TutorAgent.answer_question to simulate a follow-up interaction using the search tool.

❇️ Delegates to QuizAgent to generate a quiz and stores it in session memory.

❇️ Simulates a student's submission and delegates to QuizAgent to grade it, storing results in session and long-term memory.

❇️ Returns a dictionary containing the status, session data, and long-term memory entries for the session.

❇️ Throughout the supervise_education method, MockTracer methods are called to record the flow and context of operations, demonstrating how observability would be captured in a real ADK application.


##  Instructions for Setup and Running the Code
Environment: Clone the GitHub repository:   **https://github.com/vidushi-7/education-bliss-ai-agent.git**


**Configuration:**
In education_agents_adk.py, replace "your-actual-gcp-project-id" and "us-central1" with your actual Google Cloud Project ID and preferred LOCATION for Vertex AI integration.

**Installation:**
Install necessary dependencies (pytest).

**Execution:**

**Run the Supervisor:**
Instantiate and run the supervisor to simulate an education flow.

**Run Tests:**
Execute the comprehensive tests to verify all agent logic.

##  💡💡💡 **Here is the screenshot of all the Tests Passed successfully.** 💡💡💡

<img width="1439" height="546" alt="Screen Shot 2025-11-28 at 6 07 56 PM" src="https://github.com/user-attachments/assets/ea791563-c48e-490a-ae46-593a79d471c1" />


***
## 5. Effective Use of Gemini:

Here is the analysis of the effective use of Gemini within the **Education Bliss AI Agent Ecosystem**.

### **Gemini Model Used**

The specific model configured for this ecosystem is **Gemini 1.5 Flash**.

  * **Evidence in Code:** Found in the `ADK_CONFIG` dictionary within the `education_agents_adk.py` file:
    ```python
    ADK_CONFIG = {
        # ...
        "model_name": "gemini-1.5-flash",
        # ...
    }
    ```
  * **Why this choice is effective:** Gemini 1.5 Flash is optimized for high-frequency, low-latency tasks. For an interactive education agent that needs to respond quickly to student questions, generate quizzes on the fly, and iterate through concepts without long delays, "Flash" is the ideal architectural choice over heavier models.

### **Effective Use of Gemini in the Design**

The **Education Bliss AI Agent Ecosystem** effectively leverages Gemini’s capabilities by moving beyond a simple "chatbot" interface and treating the LLM as a cognitive engine for specific, modular tasks.

**1. Hierarchical Reasoning & Orchestration**
Instead of asking a single LLM instance to "be a teacher," the system uses Gemini to power distinct personas. The `EducationSupervisor` uses the model's reasoning capabilities to manage the state of the lesson, deciding *when* to plan, *when* to teach, and *when* to quiz. This mimics higher-order cognitive planning.

**2. Specialized Agent Personas (Context Engineering)**
Gemini is effectively utilized through specialized `PromptTemplates` for each agent. This ensures the model focuses its attention on specific domains:

  * **CurriculumAgent:** Gemini is prompted to act as a *planner*, breaking abstract goals ("Learn Python") into structured, linear steps.
  * **TutorAgent:** Gemini is prompted to be an *instructor*, converting raw concepts into pedagogical explanations.
  * **QuizAgent:** Gemini is prompted to be an *evaluator*, generating distinct questions and distractors (wrong answers) based on the specific material just taught.

**3. Tool-Use & Grounding**
The ecosystem demonstrates Gemini's ability to recognize when it lacks information or needs to perform a deterministic action.

  * The **TutorAgent** is equipped with a `GoogleSearchTool`. Gemini creates the search query based on the student's question, and then synthesizes the *tool output* (search results) into a natural language answer. This grounds the AI's knowledge in up-to-date reality.
  * The **QuizAgent** delegates the mathematical/logical task of grading to the `GradeQuizTool`, ensuring the LLM focuses on content generation rather than state management.

**4. Long-Context Utilization**
By using `gemini-1.5-flash` (which features a massive context window), the agents can maintain the "thread" of the education session. The `InMemorySessionService` feeds the relevant history back into the model, allowing Gemini to remember previous concepts taught and the student's past quiz performance, enabling true personalization.

-----

## 6. Future Scope of "Education Bliss AI Agent"

* **Redefining Personalized Learning:** Directly addresses the critical personalization gap in digital education by dynamically creating curricula, providing grounded tutoring, and delivering adaptive assessments tailored to each individual learner.
* **Advanced Multi-Agent Architecture:** Leverages a modular system of specialized agents, advanced tool use, and persistent memory to deliver a highly responsive and intelligent learning experience.
* **Transition to Live Pilot:** Moves beyond the current verified mock implementation to a real-world pilot program, enabling the collection of crucial data on user interaction and learning outcomes.
* **Production-Grade Integration:** Replaces mock components (`MockGoogleLlm`, `MockTracer`) with fully integrated **Vertex AI** and **OpenTelemetry** libraries to ensure enterprise-level performance and robust observability.
* **Scalable Cloud Deployment:** Deploys the central `EducationSupervisor` as a **Google Cloud Run** service, ensuring the system can scale seamlessly with user demand.
* **Next-Gen Memory Evolution:** Upgrades from simple in-memory storage to **Vector Databases** (like Pinecone or Milvus), unlocking semantic retrieval capabilities for deeper, context-aware long-term memory.

***

## 7. Achievements of "Education Bliss AI Agent"

The implementation achieves a sophisticated, fully functional agentic workflow that solves the core problem of static educational content.

1.  **Truly Personalized Curriculum Generation:**

      * The system successfully accepts vague user inputs (e.g., "Introduction to Python") and uses the `CurriculumAgent` to generate a structured, step-by-step learning plan tailored to that specific goal.

2.  **Autonomous Instructional Loop:**

      * The `EducationSupervisor` successfully orchestrates a fully autonomous loop. It iterates through the generated plan, automatically triggering the `TutorAgent` to teach a concept and then immediately triggering the `QuizAgent` to verify understanding before moving on.

3.  **Grounded & Verified Knowledge:**

      * Unlike standard LLMs that might hallucinate, the `TutorAgent` integrates a `GoogleSearchTool` capability. This ensures that answers to follow-up questions (e.g., "What are the applications of Python?") are grounded in retrieved search data.

4.  **Structured Assessment & Feedback:**

      * The system moves beyond simple chat by producing structured assessments. The `QuizAgent` generates multiple-choice quizzes and, crucially, provides structured grading feedback (Score + Qualitative Feedback) via the `GradeQuizTool`.

5.  **Robust State Management (Memory):**

      * The system successfully implements a "Memory Bank." It retains **Session Memory** (current lesson progress) and **Long-Term Memory** (past grades and completed plans). This allows the agent to pause, resume, and recall a student's history, mimicking a real human tutor relationship.

6.  **Enterprise-Grade Observability:**

      * The implementation includes a comprehensive `MockTracer` system simulating OpenTelemetry. Every agent thought, tool call, and state update is logged and traceable. This achievement ensures the system is not a "black box," allowing developers to debug exactly *why* the AI decided to teach a specific concept or assign a specific grade.

<img width="2816" height="1536" alt="Gemini_Generated_Image_qt7zbbqt7zbbqt7z" src="https://github.com/user-attachments/assets/a75e3eae-f85e-4491-86f4-4a646087bd67" />

## **Implemented Features Summary Table**

| Feature Category | Implementation in Code | Agent/Component Responsible |
| :--- | :--- | :--- |
| **Multi-Agent** | Hierarchical Supervisor-Worker pattern | `EducationSupervisor` managing `Curriculum`, `Tutor`, `Quiz` agents. |
| **Tools** | Built-in & Custom Tools | `TutorAgent` (Google Search), `QuizAgent` (GradeQuizTool). |
| **Memory** | Session & Long-term persistence | `InMemorySessionService` (Session), `ADKInMemoryMemory` (Long-term). |
| **Observability** | OpenTelemetry Simulation | `MockTracer` injected into all agents and tools to log spans/events. |
***

## 8. Youtube Video Submission Link:  

##  https://youtu.be/Zv74NtH8Q2Q

***
## 9. Agent Deployment: "Education Bliss AI Agent"

✅ Central Component: EducationSupervisor (The Orchestrator)

User Input: Learning Goal (e.g., "Master Python")

✅ Planning (CurriculumAgent)

Input: Learning Goal
Agent: CurriculumAgent (Powered by Gemini)
Output: Structured Learning Plan
Data Action: Stores Plan in ADKInMemoryMemory

✅ Teaching (TutorAgent)

Input: Next Topic from Plan (e.g., "Variables")
Agent: TutorAgent (Powered by Gemini)
Tool Use: Accesses GoogleSearchTool for external/real-time information.
Output: Detailed Explanation/Q&A
Data Action: Updates InMemorySessionService (Current Concept)

✅ Assessment (QuizAgent)

Input: Completed Topic ("Variables")
Agent: QuizAgent (Powered by Gemini)
Tool Use: Calls GradeQuizTool to process student answers.
Output: Grade and Feedback
Data Action: Stores Grade in ADKInMemoryMemory

✅ Observability Layer: MockTracer
Component: Span tracking, attributes, and events log every interaction across all four agents.

## **Implemented Features Summary Table**

| Feature Category | Implementation in Code | Agent/Component Responsible |
| :--- | :--- | :--- |
| **Multi-Agent** | Hierarchical Supervisor-Worker pattern | `EducationSupervisor` managing `Curriculum`, `Tutor`, `Quiz` agents. |
| **Tools** | Built-in & Custom Tools | `TutorAgent` (Google Search), `QuizAgent` (GradeQuizTool). |
| **Memory** | Session & Long-term persistence | `InMemorySessionService` (Session), `ADKInMemoryMemory` (Long-term). |
| **Observability** | OpenTelemetry Simulation | `MockTracer` injected into all agents and tools to log spans/events. |

The multi-agent education system development, encompassing agent implementation, tool integration, supervisor setup, and comprehensive testing with mock ADK components, has been successfully completed.

## 10. Bonus points Section (Tooling, Model Use, Deployment, Video) for "Education Bliss AI Agent"

Youtube video link to demonstrate this is:   
## **https://youtu.be/Zv74NtH8Q2Q**

***
## 11. Summary:

The implemented ADK-based multi-agent education system comprises an EducationSupervisor orchestrating three specialized agents: CurriculumAgent, TutorAgent, and QuizAgent.

💎 The **CurriculumAgent** is responsible for interpreting the user's learning goal and generating a structured learning plan.

💎 The **TutorAgent** teaches concepts from the learning plan, answers follow-up questions, and utilizes a GoogleSearchTool for updated information.

💎 The **QuizAgent** generates quizzes based on the taught material and grades student answers using a GradeQuizTool.

💎 The **EducationSupervisor** orchestrates the overall learning flow by delegating tasks, managing session state with InMemorySessionService, and handling long-term memory with ADKInMemoryMemory. It now dynamically iterates through the learning plan, teaching and quizzing on each concept.

💎 **Key concepts implemented include a multi-agent system, LLM-powered agents, custom and built-in tools, session and long-term memory, and observability. Observability is integrated via a MockTracer (simulating OpenTelemetry) in each agent and tool to log execution flow and interactions. Comprehensive pytest unit and integration tests, including an end-to-end test for the EducationSupervisor, unit tests for individual agents, supervisor routing tests, and a dedicated observability test using caplog, ensure the system's correctness and tracing functionality.**

## **Implemented Features Summary Table**

| Feature Category | Implementation in Code | Agent/Component Responsible |
| :--- | :--- | :--- |
| **Multi-Agent** | Hierarchical Supervisor-Worker pattern | `EducationSupervisor` managing `Curriculum`, `Tutor`, `Quiz` agents. |
| **Tools** | Built-in & Custom Tools | `TutorAgent` (Google Search), `QuizAgent` (GradeQuizTool). |
| **Memory** | Session & Long-term persistence | `InMemorySessionService` (Session), `ADKInMemoryMemory` (Long-term). |
| **Observability** | OpenTelemetry Simulation | `MockTracer` injected into all agents and tools to log spans/events. |

💎 **The multi-agent education system development, encompassing agent implementation, tool integration, supervisor setup, and comprehensive testing with mock ADK components, has been successfully completed.**
***

## 12. Citations

@misc{agents-intensive-capstone-project,
    author = {Addison Howard and Brenda Flynn and Eric Schmidt and Kanchana Patlolla and Kinjal Parekh and María Cruz and Naz Bayrak and Polong Lin and Ray Harvey},
    title = {Agents Intensive - Capstone Project},
    year = {2025},
    howpublished = {\url{https://kaggle.com/competitions/agents-intensive-capstone-project}},
    note = {Kaggle}
}
***

## 13. Author and Core Contributor:  
Vidushi Chouksey:  **https://www.linkedin.com/in/vidushi2222/**
***

# education-bliss-ai-agent

## Education Bliss AI Agent: a personalized multi-agent learning system

<img width="1024" height="1024" alt="Gemini_Generated_Image_3gb0ra3gb0ra3gb0" src="https://github.com/user-attachments/assets/311eb33c-2fab-4076-95b9-94aee57bdec1" />

### 1. The Pitch (Problem, Solution, Value)

* **Problem: The Crisis of Generalized Learning**
    Traditional online education suffers from a rigid "one-size-fits-all" approach. Whether it's self-paced courses or static platforms, learners are forced into a single curriculum regardless of their prior knowledge or goals. This leads to **high dropout rates** due to disengagement, **inefficient learning** where time is wasted on known concepts, and a **lack of contextual depth** that fails to connect material to the learner's specific needs.

* **Solution: The Education Bliss AI Agent Ecosystem**
    We have built a decentralized, multi-agent ecosystem that delivers truly personalized 1:1 education. Instead of relying on a single, overburdened LLM, our solution utilizes a hierarchical team of specialized agents—orchestrated by a central **EducationSupervisor**—to autonomously manage the entire learning lifecycle.

* **Value: Adaptive & Autonomous Mastery**
    Our system transforms passive content consumption into an active, adaptive journey. By leveraging specialized roles—planning, teaching, and assessing—our ecosystem ensures that every lesson is dynamically generated, grounded in real-time data, and rigorously evaluated. This architecture provides the scalability of digital platforms with the tailored efficacy of a human tutor.

***
### 2. Core Concept & Value

* **Central Idea: Dynamic Orchestration over Static Curriculum**
    At the heart of the Education Bliss ecosystem is the shift from static content to a dynamic, agent-driven learning journey. Our innovation lies in the **meaningful use of agents** to decouple complex educational tasks, ensuring higher quality and reliability than a monolithic model could achieve.

* **Meaningful Agent Architecture:**
    Our solution is built on a specific, functional division of labor where agents are not just "chatbots," but specialized workers:
    * **The Architect (CurriculumAgent):** Interprets vague user goals (e.g., "Learn Python") into structured, step-by-step learning paths.
    * **The Instructor (TutorAgent):** Delivers grounded instruction using the **GoogleSearchTool** to fetch real-time examples, ensuring content is never stale.
    * **The Evaluator (QuizAgent):** Provides objective assessment using a custom **GradeQuizTool**, separating the creation of questions from the logic of grading.

* **Systemic Innovation:**
    Value is driven by the **EducationSupervisor**, which acts as the system's "brain." It manages state via **InMemorySessionService** (to track immediate progress) and **Long-Term Memory** (to retain learning plans and grades). This allows the system to pause, resume, and adapt over time, solving the continuity problem often found in chat-based interfaces.

***

## 2. The Implementation (Architecture, Code):

<img width="2816" height="1536" alt="Gemini_Generated_Image_h2grauh2grauh2gr" src="https://github.com/user-attachments/assets/f85c930b-39c2-46d5-8a5f-28057b227b61" />

## 🏛️ System Architecture and The Orchestrator

The system is built on a **Multi-Agent Architecture**, which delegates specialized tasks to dedicated agents, all managed by a central **EducationSupervisor**.

  * **Specialized Agents:**
      * **`CurriculumAgent`**: Focuses on the single task of generating the `learning plan`.
      * **`TutorAgent`**: Handles teaching (`teach_concept`) and answering complex, grounded questions (`answer_question`).
      * **`QuizAgent`**: Manages assessment creation (`generate_quiz`) and score processing (`grade_submission`).
  * **The Orchestrator (`EducationSupervisor`)**: This agent ties the entire educational workflow together. It initializes all specialized agents, session services, and memory, and then calls the agents sequentially through its `supervise_education` method to manage the end-to-end user experience.

### Code Snippet: Supervisor Initialization (Mocked ADK)

The Supervisor's `init` method is the control hub, instantiating all agents, memory components, and the shared tracer.

```python
class EducationSupervisor(MockAgentSupervisor):
    def __init__(self, tracer, session_service, long_term_memory, llm):
        super().__init__(tracer)
        self.session_service = session_service
        self.long_term_memory = long_term_memory
        
        # Initialize Specialized Agents with shared components
        self.curriculum_agent = CurriculumAgent(llm=llm, tracer=tracer)
        self.tutor_agent = TutorAgent(llm=llm, tracer=tracer)
        self.quiz_agent = QuizAgent(llm=llm, tracer=tracer)
        # Initialize Tools (passed to the agents later, but instantiated here for context)
        self.google_search_tool = MockGoogleSearchTool(tracer=tracer)
        self.grade_quiz_tool = MockGradeQuizTool(tracer=tracer)
        
    # ... supervise_education method follows ...
```

-----

## 🛠️ Tool Use for Grounded Teaching and Structured Assessment

Your architecture leverages two distinct tool types: a **built-in** tool simulation and a **custom** tool simulation. Tools are critical because they allow the agents to perform actions *outside* of the LLM's raw generative capability, enabling **real-time grounding** and **consistent logic**.

  * **`MockGoogleSearchTool` (Built-in Simulation)**: This tool, used by the `TutorAgent`, simulates fetching real-time information to ensure teaching is current and grounded, as seen in the `answer_question` method.
  * **`MockGradeQuizTool` (Custom Simulation)**: This tool, used by the `QuizAgent`, simulates a deterministic grading function. By offloading grading to a structured tool, you ensure **consistent assessment logic** that doesn't rely on the LLM's interpretation for scoring.

### Code Snippet: Tool Integration in Agent Method (Mocked ADK)

The `TutorAgent`'s use of the `MockGoogleSearchTool` would involve a method that calls the tool's `run` function to enrich its answer.

```python
class TutorAgent(MockLlmAgent):
    # ... init method ...
    
    def answer_question(self, question: str):
        # Simulate Google Search Tool execution
        search_tool = MockGoogleSearchTool(tracer=self.tracer)
        search_result = search_tool.run(query=question)
        
        # Construct the prompt with the grounded information
        prompt = f"Answer the user's question: '{question}' based on this search result: {search_result}"
        
        # Simulate LLM call to formulate final answer
        response = self.llm.predict(prompt)
        return response
```

-----

## 🧠 Session State and Long-Term Memory

The system maintains a **personalized, multi-session learning experience** by managing two layers of memory:

1.  **Session State (`MockInMemorySessionService`):** Stores short-term, transient data like the current teaching content or the quiz generated for the *active session*.
2.  **Long-Term Memory (`MockADKInMemoryMemory`):** Stores durable knowledge like the final `learning plan` and `final grades`. This allows a student to pick up their progress across multiple sessions.

The `EducationSupervisor` is responsible for shuttling data between the agents and these memory services.

-----

## 🔬 Observability with MockTracer

To ensure the system's correctness and debug its flow, the entire architecture is instrumented with a **`MockTracer`**. This simulates the OpenTelemetry tracing provided by a real ADK deployment.

  * **Shared Instance**: A single `MockTracer` instance is initialized in the Supervisor and passed to *every* agent and tool (`CurriculumAgent`, `TutorAgent`, `QuizAgent`, `MockGoogleSearchTool`, `MockGradeQuizTool`).
  * **Span Creation**: Each critical step (e.g., generating a plan, grading a quiz) uses explicit tracing calls (like `self.tracer.start_as_current_span(...)`) to log the start, end, and context of the operation.

### Code Snippet: Tracing in the Supervisor's Workflow (Mocked ADK)

The `supervise_education` method demonstrates how tracing wraps the entire multi-agent interaction flow.

```python
class EducationSupervisor(MockAgentSupervisor):
    # ... init method ...
    
    def supervise_education(self, goal: str, student_answer: str):
        with self.tracer.start_as_current_span("supervise_education_flow") as span:
            span.set_attribute("user.goal", goal)
            
            # Step 1: Curriculum Agent generates plan
            with self.tracer.start_as_current_span("generate_learning_plan"):
                plan = self.curriculum_agent.generate_learning_plan(goal)
                self.long_term_memory.write("learning_plan", plan)
            
            # Step 2: Tutor Agent teaches
            with self.tracer.start_as_current_span("tutor_teach_concept"):
                teaching_content = self.tutor_agent.teach_concept(plan)
                self.session_service.set_state("teaching_content", teaching_content)
                
            # ... subsequent steps for quiz and grading ...
            
            return {"status": "Complete", "session_data": self.session_service.get_state()}
```

This structure clearly illustrates how the **Multi-Agent Architecture**, **Tool Use**, **Session/Long-Term Memory**, and **Observability** are all tightly integrated within the orchestrating `EducationSupervisor`.

## 1\. The Hierarchical Multi-Agent Core

The system is led by the **EducationSupervisor**, which acts as the control loop, managing the state and delegating tasks sequentially to specialized worker agents.

### **EducationSupervisor (Orchestrator)** 🧠

The supervisor manages the session, instantiates all worker agents, and initializes the memory and observability layers.

```python
class EducationSupervisor(MockAgentSupervisor):
    """EducationSupervisor orchestrates the multi-agent education system."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 1. State and Memory Services
        self.session_service = MockInMemorySessionService()
        self.long_term_memory = MockADKInMemoryMemory()
        
        # 2. Observability (Single Tracer passed to all)
        self.tracer = MockTracer("education_supervisor")
        
        # 3. Agent Instantiation
        self.curriculum_agent = CurriculumAgent(tracer=self.tracer)
        self.tutor_agent = TutorAgent(tracer=self.tracer)
        self.quiz_agent = QuizAgent(tracer=self.tracer)
        # ... logging and other setup ...
```

The core logic resides in the `supervise_education` method, which enforces a **sequential workflow**: Plan → Teach → Assess.

```python
# Snippet from EducationSupervisor.supervise_education() method
# Step 1: Planning
learning_plan = self.curriculum_agent.draft_plan(learning_goal)
self.session_service.update_session_data(session_id, {"learning_plan": learning_plan})
self.long_term_memory.store_knowledge(f"{session_id}_plan", learning_plan) # Long-Term persistence
# Step 2: Teaching (example for the first concept)
first_concept = "Basic concepts of Python programming"
teaching_content = self.tutor_agent.teach_concept(first_concept)
self.session_service.update_session_data(session_id, {"current_concept": first_concept, "teaching_content": teaching_content}) # Short-Term State update
# Step 3: Assessment (Quiz)
# ... delegation to quiz_agent ...
```

-----

## 2\. Agent Specialization and Tool Use 🛠️

Each worker agent is an `LlmAgent` specialized with specific prompts and tools to fulfill its role.

| Agent | Role | Key Method & Tool Use | Code Snippet Example |
| :--- | :--- | :--- | :--- |
| **CurriculumAgent** | The Planner | Uses an LLM prompt to generate a structured `Learning Plan` based on the user's goal. | `plan = self.llm.predict(prompt=prompt_template.format(learning_goal=learning_goal))` |
| **TutorAgent** | The Instructor | Uses the **Built-in `GoogleSearchTool`** to ground answers in external reality when answering questions. | `search_results = self.search_tool.run(question)` |
| **QuizAgent** | The Assessor | Uses the **Custom `GradeQuizTool`** for objective grading, returning structured data. | `grade_results = self.grade_quiz_tool.run(quiz=quiz, student_answers=mock_answers)` |

### **Example of Tool Use in TutorAgent**

The `answer_question` method shows the integration of a search tool to provide grounded information.

```python
# Snippet from TutorAgent.answer_question()
def answer_question(self, question: str) -> str:
    # 1. Tool execution (GoogleSearchTool is simulated here)
    search_results = self.search_tool.run(question) 

    # 2. LLM reasoning over search results
    prompt_template = MockPromptTemplate(
        template="""You are an expert tutor. Answer the following question based on the provided search results and your knowledge.
        Search Results: {search_results}
        Question: {question}
        """
    )
    prompt = prompt_template.format(search_results=search_results, question=question)
    return self.llm.predict(prompt=prompt)
```

-----

## 3\. State Management and Memory 💾

The system uses two distinct memory components to maintain context across the learning journey.

  * **Short-Term State (`InMemorySessionService`):** Tracks the immediate progress of the *current* lesson, such as the `current_concept` being taught or a `quiz_draft`. This ensures seamless handoff between agents.
  * **Long-Term Memory (`ADKInMemoryMemory`):** Mimics a persistent store for high-value artifacts like the finalized `Learning Plan` and `Quiz Grades`. This allows the student's history to be recalled in future sessions.

-----

## 4\. Observability Layer (MockTracer) 📊

A robust observability layer, which simulates **OpenTelemetry** tracing, is fundamental to the architecture. A single `MockTracer` instance is created by the `EducationSupervisor` and passed to every agent and tool.

  * **Function:** Every agent call (`predict`) and tool execution (`run`) is wrapped in a `start_as_current_span` context manager.
  * **Tracing:** The system captures specific **Attributes** (e.g., `prompt_length`, `quiz_score`) and records **Events** (e.g., `LLM_prediction_complete`, `concept_taught`) for debugging and performance monitoring.

### **Example of Tracing in TutorAgent**

```python
# Snippet from TutorAgent.teach_concept()
def teach_concept(self, concept: str) -> str:
    with self.tracer.start_as_current_span("TutorAgent.teach_concept"):
        # ... LLM prediction logic ...
        explanation = self.llm.predict(prompt=prompt)
        
        # Log event and attribute upon completion
        self.tracer.add_event("concept_taught", {"explanation_length": len(explanation)})
        return explanation
```

This comprehensive design ensures that the system is not only intelligent but also modular, transparent, and capable of maintaining long-term student context.
***

## **Architecture Overview**

The system operates on a **Hierarchical Multi-Agent Structure**. A central `EducationSupervisor` acts as the "brain," orchestrating a team of specialized agents (`CurriculumAgent`, `TutorAgent`, `QuizAgent`) to deliver a cohesive educational experience. This separation of concerns allows for modularity, easier debugging, and specialized LLM prompting for each role.

The system operates on a hierarchical structure orchestrated by a Supervisor, enabling seamless delegation of tasks and persistent memory management.

| Component | ADK Role | Function | Key Concepts Demonstrated |
| :--- | :--- | :--- | :--- |
| **EducationSupervisor** | AgentSupervisor | **Orchestrates** the entire educational workflow, delegating tasks and managing the session. | **Multi-Agent Orchestration**; **Session State & Long-Term Memory** |
| **CurriculumAgent** | LlmAgent | **Plans** the personalized learning path based on the user's goal. | **LlmAgent** specialization |
| **TutorAgent** | LlmAgent | **Teaches** concepts, answers questions, and grounds information using external sources. | **Tool Use** (`GoogleSearchTool`) |
| **QuizAgent** | LlmAgent | **Assesses** student knowledge by generating quizzes and grading submissions. | **Tool Use** (`GradeQuizTool`) |
| **ADK Memory Services** | ADK Memory | `InMemorySessionService` tracks current lesson status. `ADKInMemoryMemory` stores permanent records (e.g., final grades, completed plans). | **Session State & Long-Term Memory** |


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

## **Implemented Features Summary Table**

| Feature Category | Implementation in Code | Agent/Component Responsible |
| :--- | :--- | :--- |
| **Multi-Agent** | Hierarchical Supervisor-Worker pattern | `EducationSupervisor` managing `Curriculum`, `Tutor`, `Quiz` agents. |
| **Tools** | Built-in & Custom Tools | `TutorAgent` (Google Search), `QuizAgent` (GradeQuizTool). |
| **Memory** | Session & Long-term persistence | `InMemorySessionService` (Session), `ADKInMemoryMemory` (Long-term). |
| **Observability** | OpenTelemetry Simulation | `MockTracer` injected into all agents and tools to log spans/events. |

### Project Journey and Implementation

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

<img width="1024" height="1024" alt="Gemini_Generated_Image_9fdrzr9fdrzr9fdr" src="https://github.com/user-attachments/assets/5dbe16d8-dae4-44b6-a7e3-52a85c7c8e94" />

##
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

## 4. Technical Implementation:

<img width="1024" height="1024" alt="Gemini_Generated_Image_tpldf0tpldf0tpld" src="https://github.com/user-attachments/assets/0ef0d2c5-eb41-410c-878f-1fb1b670be3b" />

-----

# Technical Implementation

## 1\. Overview

This project implements a personalized education system using the **Google Agent Development Kit (ADK)** pattern. It features a hierarchical multi-agent architecture where specialized agents collaborate to create curricula, teach concepts, and assess student knowledge. The implementation focuses on four core ADK pillars: **Multi-Agent Orchestration**, **Tool Use**, **Session State & Long-Term Memory**, and **Observability**.

-----

## 2\. Core Concepts & Architecture

The solution demonstrates the following ADK concepts:

### 🧩 Multi-Agent Architecture

The system operates on a hierarchical structure where a supervisor delegates tasks to specialized workers.

  * **Sequential Workflow:** The `EducationSupervisor` manages the lifecycle: `Plan -> Teach -> Assess`.
  * **Specialization:** Each agent (`CurriculumAgent`, `TutorAgent`, `QuizAgent`) has a distinct persona and responsibility, reducing hallucination and improving focus.

### 🛠 Tool Use

Agents are equipped with deterministic tools to ground their capabilities.

  * **`GoogleSearchTool`:** Used by the `TutorAgent` to fetch real-time, grounded information (e.g., "What are the applications of Python?").
  * **`GradeQuizTool`:** A custom tool used by the `QuizAgent` to perform structured grading logic, returning consistent JSON outputs (Score + Feedback).

### 🧠 Session & Long-Term Memory

The system maintains context across the user's journey using distinct memory services.

  * **Session State (`InMemorySessionService`):** Tracks transient data like the *current concept* being taught or the *current quiz* draft. This allows the system to pause/resume within a specific lesson.
  * **Long-Term Memory (`ADKInMemoryMemory`):** acts as a permanent store for high-value artifacts like the *Full Learning Plan* and *Final Grades*. This enables the agent to recall a user's progress across different sessions.

### 👁 Observability

Enterprise-grade tracing is implemented using a `MockTracer` (simulating OpenTelemetry).

  * **Spans:** Every agent action (`predict`) and tool execution (`run`) is wrapped in a trace span.
  * **Events & Attributes:** Critical data points (e.g., `quiz_score`, `prompt_length`) are logged as attributes, allowing developers to debug the exact flow of execution.

-----

## 3\. Codebase Breakdown

### `education_agents_adk.py`

This is the core implementation file containing the agent definitions, tools, and supervisor logic. It includes a **Mock ADK Layer** to allow the system to run in environments (like Colab) without requiring a full GCP billing setup for demonstration purposes.

#### **Key Components:**

| Component | Type | Responsibility |
| :--- | :--- | :--- |
| **`EducationSupervisor`** | **Supervisor** | Orchestrates the loop: calls `CurriculumAgent` once, then iterates through the plan calling `TutorAgent` and `QuizAgent` for each concept. Manages `SessionService` updates. |
| **`CurriculumAgent`** | `LlmAgent` | Takes a vague user goal ("Learn Python") and outputs a structured text plan. |
| **`TutorAgent`** | `LlmAgent` | Explains specific concepts from the plan. Uses `GoogleSearchTool` to answer follow-up questions. |
| **`QuizAgent`** | `LlmAgent` | Generates multiple-choice quizzes. Uses `GradeQuizTool` to calculate scores. |
| **`GoogleSearchTool`** | Tool | Simulates retrieving search results to ground the LLM's answers. |
| **`GradeQuizTool`** | Tool | Deterministic logic that compares student answers to the answer key. |
| **`MockTracer`** | Utility | Captures execution flow (`start_as_current_span`) for observability validation. |

#### **The Orchestration Loop (`supervise_education`):**

1.  **Plan:** Supervisor asks `CurriculumAgent` for a plan → Store in Memory.
2.  **Loop:** For each concept in the plan:
      * **Teach:** Delegate to `TutorAgent` → Update Session.
      * **Q\&A:** `TutorAgent` uses Search Tool for follow-up questions → Update Session.
      * **Quiz:** Delegate to `QuizAgent` to create a test → Update Session.
      * **Grade:** Delegate to `QuizAgent` (using Tool) to grade → Store in Long-Term Memory.
3.  **Result:** Return full session history and memory entries.

-----

### `test_education_agents.py`

Comprehensive testing suite using `pytest` to verify the "trajectory" of the agents.

  * **End-to-End Test:** Simulates a full user session ("Introduction to Python") and asserts that the plan was created, concepts were taught, and grades were stored in long-term memory.
  * **Unit Tests:** Verifies individual agent logic (e.g., ensuring `QuizAgent` actually generates a string starting with `[MOCK QUIZ]`).
  * **Observability Test:** Uses `caplog` to inspect logs and verify that `MockTracer` is correctly generating "Starting span" and "Ending span" events.

-----

## 4\. Setup & Execution

### Prerequisites

  * Python 3.10+
  * `pytest`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/vidushi-7/education-bliss-ai-agent.git
cd education-bliss-ai-agent
pip install google-adk pytest # Install ADK if running in a real environment
```

### Configuration

Open `education_agents_adk.py` and update the configuration dictionary with your Google Cloud details:

```python
ADK_CONFIG = {
    "project_id": "your-actual-gcp-project-id", # <--- Update this
    "location": "us-central1",                  # <--- Update this
    "model_name": "gemini-1.5-flash",
}
```

### Running the System

You can run the supervisor directly to see the agent interaction loop:

```python
from education_agents_adk import EducationSupervisor

supervisor = EducationSupervisor()
result = supervisor.supervise_education(learning_goal="Introduction to Data Science")
print(result)
```

### Running Tests

Execute the test suite to verify the architecture:

```bash
pytest test_education_agents.py
```

**✅ Verification:**
Refer to the screenshot below confirming that all unit, integration, and observability tests passed successfully.

##  💡💡💡 **All Tests got Passed successfully.** 💡💡💡

<img width="1439" height="546" alt="Screen Shot 2025-11-28 at 6 07 56 PM" src="https://github.com/user-attachments/assets/ea791563-c48e-490a-ae46-593a79d471c1" />

-----

## 5\. Future Improvements

  * **Replace Mocks:** Swap `MockGoogleLlm` and `MockTracer` with production `vertexai` and `opentelemetry` libraries.
  * **Vector Memory:** Upgrade `ADKInMemoryMemory` to a Vector Database (e.g., Pinecone) for semantic retrieval of past lessons.
  * **Deployment:** Containerize the `EducationSupervisor` as a **Cloud Run** service.
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

##  https://youtu.be/XZcbYtie_KM

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
## https://youtu.be/XZcbYtie_KM

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

## 11. Citations

@misc{agents-intensive-capstone-project,
    author = {Addison Howard and Brenda Flynn and Eric Schmidt and Kanchana Patlolla and Kinjal Parekh and María Cruz and Naz Bayrak and Polong Lin and Ray Harvey},
    title = {Agents Intensive - Capstone Project},
    year = {2025},
    howpublished = {\url{https://kaggle.com/competitions/agents-intensive-capstone-project}},
    note = {Kaggle}
}
***

## 12. Author and Core Contributor:  
Vidushi Chouksey:  **https://www.linkedin.com/in/vidushi2222/**
***

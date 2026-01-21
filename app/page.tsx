import React from "react";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Education Bliss AI Agent
        </h1>

        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
          Autonomous AI Agents for Personalized Learning Mastery
        </p>

        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Features</h2>
          <ul style={{ lineHeight: "1.8" }}>
            <li>
              <strong>Adaptive Learning:</strong> Personalized curriculum
              tailored to individual student needs
            </li>
            <li>
              <strong>Multi-Agent Architecture:</strong> Specialized agents for
              planning, teaching, and assessment
            </li>
            <li>
              <strong>Real-time Grounding:</strong> Google Search integration for
              current, relevant content
            </li>
            <li>
              <strong>Session Persistence:</strong> Continue learning across
              multiple sessions
            </li>
            <li>
              <strong>Performance Monitoring:</strong> Vercel Speed Insights
              integration for tracking metrics
            </li>
          </ul>
        </div>

        <div style={{ color: "#999", fontSize: "0.9rem" }}>
          <p>
            Vercel Speed Insights is enabled. Performance metrics are being
            collected.
          </p>
          <p>
            Learn more at{" "}
            <a
              href="https://vercel.com/docs/speed-insights"
              style={{ color: "#0070f3" }}
            >
              Vercel Speed Insights Documentation
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

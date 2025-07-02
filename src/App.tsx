import React from "react";
import { DashboardProvider } from "./context/DashboardContext";
import Header from "./components/Header/Header";
import WordCloudDisplay from "./components/Dashboard/WordCloudDisplay";
import SentimentMeterDisplay from "./components/Dashboard/SentimentMeterDisplay";
import CommentAnalysisPanel from "./components/Dashboard/CommentAnalysisPanel";
import AudiencePostsDisplay from "./components/Dashboard/AudiencePostsDisplay";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer/Footer";

const App: React.FC = () => {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <main
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: "20px",
          maxWidth: "1600px",
          margin: "0 auto",
          minHeight: "100vh",
        }}
      >
        <Header />

        <div
          className='dashboard-grid'
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            padding: "0.5rem 0",
            alignItems: "start",
          }}
        >
          {[
            {
              title: "Trending Topics",
              component: <WordCloudDisplay />,
            },
            {
              title: "Sentiment Meter",
              component: <SentimentMeterDisplay />,
            },
            {
              title: "Comment Analysis",
              component: <CommentAnalysisPanel />,
            },
            {
              title: "Audience Posts",
              component: <AudiencePostsDisplay />,
            },
          ].map((panel, index) => (
            <DashboardCard key={index} title={panel.title}>
              {panel.component}
            </DashboardCard>
          ))}
        </div>

        <ScrollToTop />
      </main>

      <Footer />
    </>
  );
};

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <section
      className='dashboard-card'
      style={{
        display: "flex",
        flexDirection: "column",
        height: "580px",
        minHeight: "580px",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            marginTop: "0",
            paddingBottom: "0.75rem",
            marginBottom: "1rem",
            fontSize: "1.2em",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            flexShrink: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default App;

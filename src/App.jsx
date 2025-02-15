import React from 'react';
import HorizontalBoxPlot from './components/HorizontalBoxPlot';

const sampleData = [
  {
    question: "How satisfied were you with the overall service quality?",
    values: [3, 5, 6, 7, 7, 8, 8, 8, 9, 9]
  },
  {
    question: "How likely are you to recommend our service to others?",
    values: [2, 3, 4, 5, 5, 6, 6, 7, 8, 8]
  },
  {
    question: "How would you rate the responsiveness of our support team?",
    values: [1, 2, 3, 4, 4, 5, 5, 6, 7, 8]
  }
  // ... can add up to 10 questions
];

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Response Distribution</h1>
      <HorizontalBoxPlot 
        data={sampleData}
        width={1000}
        height={400}
        margin={{ top: 20, right: 60, bottom: 50, left: 200 }}
        config={{
          minValue: 0,
          maxValue: 10,
          gridLineCount: 6,
          allowQuestionWrap: true,
          questionWidth: 160,
          minBoxHeight: 60
        }}
      />
    </div>
  );
}

export default App; 
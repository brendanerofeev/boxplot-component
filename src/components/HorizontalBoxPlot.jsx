import React, { useMemo } from 'react';

// Statistical calculation utilities
const calculateStats = (values) => {
  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate standard deviation
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const variance = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Find min and max
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return {
    min,
    max,
    mean: Number(mean.toFixed(2)),
    lowerSD: Number((mean - stdDev).toFixed(2)),
    upperSD: Number((mean + stdDev).toFixed(2))
  };
};

const HorizontalBoxPlot = ({ 
  data,
  width = 1000,
  height = 400,
  margin = { top: 20, right: 60, bottom: 50, left: 140 },
  colors = {
    whiskerLine: '#314F48',
    upperBox: '#619B8E',
    lowerBox: '#B6D2CB',
    gridLine: '#E5E5E5',
    dividerLine: '#CCCCCC'
  },
  config = {
    minValue: 0,           // Minimum value on scale
    maxValue: 10,          // Maximum value on scale
    gridLineCount: 6,      // Number of vertical grid lines
    allowQuestionWrap: true, // Allow question text to wrap
    questionWidth: 120,    // Width allocated for question text
    minBoxHeight: 40,      // Minimum height for each box
  }
}) => {
  // Calculate dimensions based on data length
  const boxCount = data.length;
  const minTotalHeight = boxCount * config.minBoxHeight + margin.top + margin.bottom;
  const adjustedHeight = Math.max(height, minTotalHeight);
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = adjustedHeight - margin.top - margin.bottom;
  
  // Process data and calculate statistics
  const processedData = useMemo(() => {
    return data.map(item => ({
      question: item.question,
      ...calculateStats(item.values)
    }));
  }, [data]);
  
  // Calculate grid line positions
  const gridValues = useMemo(() => {
    const step = (config.maxValue - config.minValue) / (config.gridLineCount - 1);
    return Array.from({ length: config.gridLineCount }, (_, i) => {
      const value = config.minValue + (step * i);
      return Number(value.toFixed(2));
    });
  }, [config.minValue, config.maxValue, config.gridLineCount]);

  // Scale functions
  const xScale = (value) => {
    return margin.left + ((value - config.minValue) * innerWidth / (config.maxValue - config.minValue));
  };
  
  const yScale = (index) => {
    const boxHeight = innerHeight / processedData.length;
    return margin.top + index * boxHeight + boxHeight / 2;
  };

  return (
    <svg width={width} height={adjustedHeight}>
      <rect width={width} height={adjustedHeight} fill="white" />
      
      {/* Vertical divider line */}
      <line
        x1={margin.left - 30}
        x2={margin.left - 30}
        y1={margin.top}
        y2={adjustedHeight - margin.bottom}
        stroke={colors.dividerLine}
        strokeWidth={1}
      />
      
      {/* Grid lines and labels */}
      {gridValues.map(value => (
        <g key={value}>
          <line
            x1={xScale(value)}
            x2={xScale(value)}
            y1={margin.top}
            y2={adjustedHeight - margin.bottom}
            stroke={colors.gridLine}
            strokeWidth={1}
          />
          <text
            x={xScale(value)}
            y={adjustedHeight - margin.bottom + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#666666"
          >
            {value}
          </text>
        </g>
      ))}
      
      {/* Box plots */}
      {processedData.map((item, index) => {
        const y = yScale(index);
        
        return (
          <g key={item.question}>
            {/* Question text with optional wrapping */}
            <foreignObject
              x={margin.left - config.questionWidth - 20}
              y={y - 30}
              width={config.questionWidth}
              height={60}
            >
              <div style={{
                width: 'calc(100% - 20px)',  // Subtract the total padding (10px + 10px)
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: '12px',
                whiteSpace: config.allowQuestionWrap ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: '0 10px',
                color: '#000000',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.2',
                wordBreak: 'break-word',
                textAlign: 'right',
                maxHeight: '60px',
                overflowY: 'auto',
                boxSizing: 'border-box'
              }}>
                {item.question}
              </div>
            </foreignObject>

            {/* Box plot elements */}
            <line
              x1={xScale(item.min)}
              x2={xScale(item.max)}
              y1={y}
              y2={y}
              stroke={colors.whiskerLine}
              strokeWidth={2}
            />
            
            <rect
              x={xScale(item.lowerSD)}
              y={y - 20}
              width={xScale(item.mean) - xScale(item.lowerSD)}
              height={40}
              fill={colors.lowerBox}
            />
            
            <rect
              x={xScale(item.mean)}
              y={y - 20}
              width={xScale(item.upperSD) - xScale(item.mean)}
              height={40}
              fill={colors.upperBox}
            />
            
            <circle
              cx={xScale(item.min)}
              cy={y}
              r={4}
              fill={colors.whiskerLine}
              stroke={colors.whiskerLine}
            />
            <circle
              cx={xScale(item.max)}
              cy={y}
              r={4}
              fill={colors.whiskerLine}
              stroke={colors.whiskerLine}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default HorizontalBoxPlot; 
export const GRADIENTS = [
  ["#111827", "#4B5563"], // Black -> Gray
  ["#EC4899", "#E11D48"], // Pink -> Rose
  ["#F43F5E", "#EA580C"], // Rose -> Orange
  ["#1F2937", "#6B7280"], // Gray -> Gray
  ["#DB2777", "#F43F5E"], // Pink -> Rose
  ["#000000", "#374151"], // Black -> Gray
];

export const getGradient = (i) => GRADIENTS[i % GRADIENTS.length];
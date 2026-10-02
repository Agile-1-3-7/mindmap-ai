import { Topic, ConceptNode } from "@/types";

export const TOPICS: Topic[] = [
  {
    id: "backprop",
    title: "Neural Networks: Backpropagation",
    category: "Machine Learning",
    description: "Deep dive into reverse-mode automatic differentiation, chain rule computations, and gradient propagation.",
    status: "active",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    conceptsCount: 4,
    iconName: "network"
  },
  {
    id: "gradient-descent",
    title: "Optimization & Gradient Descent",
    category: "Machine Learning",
    description: "How first-order iterative optimization algorithms traverse loss landscapes toward minima.",
    status: "coming_soon",
    difficulty: "Beginner",
    estimatedMinutes: 6,
    conceptsCount: 3,
    iconName: "trending-down"
  },
  {
    id: "loss-functions",
    title: "Loss Functions & Error Metrics",
    category: "Machine Learning",
    description: "Cross-entropy, Mean Squared Error, and objective functions that guide parameter convergence.",
    status: "coming_soon",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    conceptsCount: 3,
    iconName: "target"
  },
  {
    id: "data-structures",
    title: "Data Structures & Tree Traversal",
    category: "Computer Science",
    description: "Binary search trees, recursion depth, stack frames, and graph traversals.",
    status: "coming_soon",
    difficulty: "Intermediate",
    estimatedMinutes: 10,
    conceptsCount: 5,
    iconName: "layers"
  }
];

export const INITIAL_CONCEPT_NODES: ConceptNode[] = [
  {
    id: "concept-backprop",
    name: "Backpropagation",
    category: "Core Calculus",
    mastery: "Needs attention",
    status: "misconception",
    misconceptionId: "M01",
    activeMisconceptionId: "M01",
    description: "Application of calculus chain rule to calculate partial derivatives of loss with respect to all internal parameters.",
    attemptsCount: 3
  },
  {
    id: "concept-gd",
    name: "Gradient Descent",
    category: "Optimization",
    mastery: "Strong",
    status: "mastered",
    misconceptionId: null,
    activeMisconceptionId: null,
    description: "Parameter update mechanism: stepping along the negative gradient vector with learning rate scaling (w \u2190 w - \u03b7\u2207L).",
    attemptsCount: 4
  },
  {
    id: "concept-loss",
    name: "Loss Functions",
    category: "Foundations",
    mastery: "Strong",
    status: "mastered",
    misconceptionId: null,
    activeMisconceptionId: null,
    description: "Formulation of scalar objective penalties (MSE, Cross-Entropy) to quantify prediction disparity on batches.",
    attemptsCount: 3
  },
  {
    id: "concept-activation",
    name: "Activation Derivatives",
    category: "Architecture",
    mastery: "Developing",
    status: "improving",
    misconceptionId: null,
    activeMisconceptionId: null,
    description: "Non-linear gating functions and the multiplicative impact of their first derivatives on upstream gradients.",
    attemptsCount: 1
  }
];

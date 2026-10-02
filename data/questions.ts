import { Question } from "@/types";

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "q1",
    topicId: "backprop",
    concept: "Backpropagation Fundamentals",
    title: "Diagnostic Question 1: Role of Backpropagation",
    prompt: "In your own words, what is the primary role of backpropagation when training a neural network?",
    context: "Consider the training cycle: forward pass, loss calculation, backward pass, and parameter update.",
    expectedConcept: "Backpropagation uses the chain rule to calculate the partial derivatives (gradients) of the loss with respect to weights; it does not update weights itself.",
    hints: [
      "Think about what information flows backward through the layers.",
      "Consider whether backpropagation calculates values or modifies them."
    ],
    suggestedAnswers: [
      {
        label: "Natural Answer: Conflates Backprop with Optimizer (Triggers M01)",
        answer: "Backpropagation is the optimization algorithm that takes steps to adjust and update the weights to minimize the loss.",
        triggersMisconception: "M01",
        isCorrect: false
      },
      {
        label: "Natural Answer: Conflates Loss with Gradients (Triggers M04)",
        answer: "Backpropagation evaluates the total scalar error score and loss of the model across the training batch.",
        triggersMisconception: "M04",
        isCorrect: false
      },
      {
        label: "Natural Answer: Conceptually Correct",
        answer: "Backpropagation calculates how much each weight contributed to the error by computing partial derivatives using the chain rule.",
        isCorrect: true
      }
    ]
  },
  {
    id: "q2",
    topicId: "backprop",
    concept: "Gradient Computation vs Parameter Mutation",
    title: "Diagnostic Question 2: Immediate Output of Backward Pass",
    prompt: "Right after the backward pass finishes propagating through every layer, what specific mathematical values have been computed and stored?",
    context: "Before any optimizer step or learning rate multiplier is applied.",
    expectedConcept: "The gradients (partial derivatives ∂L/∂w) for each trainable parameter are stored in memory buffers.",
    hints: [
      "Does the backward pass alter the existing weights in memory?",
      "What tensor does PyTorch populate under param.grad?"
    ],
    suggestedAnswers: [
      {
        label: "Natural Answer: Assumes Weights Mutated (Triggers M02)",
        answer: "The newly updated weight values that have already been adjusted to reduce error for the next iteration.",
        triggersMisconception: "M02",
        isCorrect: false
      },
      {
        label: "Natural Answer: Equates Weights & Gradients (Triggers M03)",
        answer: "The weights and gradients, which are essentially the exact same values describing the connections.",
        triggersMisconception: "M03",
        isCorrect: false
      },
      {
        label: "Natural Answer: Conceptually Correct",
        answer: "The partial derivatives of the loss with respect to each weight (gradients), representing the direction of steepest error increase.",
        isCorrect: true
      }
    ]
  },
  {
    id: "q_disambiguate_m01_m02",
    topicId: "backprop",
    concept: "Parameter Mutation Disambiguation",
    title: "Diagnostic Probe: Memory State Inspection",
    prompt: "Let's check one more thing before we diagnose this: If we pause execution immediately after the backward pass finishes and before the optimizer runs, have the weight numbers stored in memory changed yet?",
    context: "System noticed ambiguity between optimization formula equivalence (M01) vs memory mutation (M02).",
    expectedConcept: "No, weights have not changed; only the gradient buffers are populated. The optimizer performs the actual mutation.",
    isDisambiguationQuestion: true,
    disambiguationPair: ["M01", "M02"],
    hints: [
      "Check whether automatic differentiation touches parameter memory or just grad buffers.",
      "When does optimizer.step() get called?"
    ],
    suggestedAnswers: [
      {
        label: "Disambiguation: Confirms M02 (Direct Mutation)",
        answer: "Yes, backpropagation directly writes the new weight values into memory as it steps backward through the layers.",
        triggersMisconception: "M02",
        isCorrect: false
      },
      {
        label: "Disambiguation: Confirms M01 (Optimizer Confusion)",
        answer: "No, but backpropagation and gradient descent are the same equation, so it doesn't matter who does it.",
        triggersMisconception: "M01",
        isCorrect: false
      },
      {
        label: "Disambiguation: Correct Distinction",
        answer: "No, the weights are unchanged. Backpropagation only calculated and stored the gradients in the grad buffer.",
        isCorrect: true
      }
    ]
  },
  {
    id: "q3",
    topicId: "backprop",
    concept: "Backpropagation vs Gradient Descent",
    title: "Diagnostic Question 3: Optimizer Substitution",
    prompt: "If you replace standard Stochastic Gradient Descent (SGD) with the Adam optimizer in your training script, does the mathematical calculation of backpropagation change? Why or why not?",
    context: "Think about the boundary between computing gradients and applying them.",
    expectedConcept: "No, backpropagation still computes the exact same partial derivatives (dL/dw) via the chain rule; Adam only changes the update rule.",
    hints: [
      "Does the chain rule formula for ∂L/∂w depend on whether you use SGD, Adam, or RMSprop?",
      "Where does the optimizer step happen relative to the backward pass?"
    ],
    suggestedAnswers: [
      {
        label: "Natural Answer: Assumes Same Process (Triggers M01)",
        answer: "Yes, because Adam uses a completely different backpropagation algorithm to compute updated weights.",
        triggersMisconception: "M01",
        isCorrect: false
      },
      {
        label: "Natural Answer: Ignores Activation Derivative (Triggers M05)",
        answer: "No, because backpropagation only depends on the learning rate and ignores activation derivatives entirely.",
        triggersMisconception: "M05",
        isCorrect: false
      },
      {
        label: "Natural Answer: Conceptually Correct",
        answer: "No, backpropagation still calculates the exact same derivatives using the chain rule. Adam only changes how those gradients are used to update the weights.",
        isCorrect: true
      }
    ]
  }
];

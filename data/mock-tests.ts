import { MockTestQuestion, MockTest } from "@/types";

export const MOCK_TEST_QUESTIONS_BANK: MockTestQuestion[] = [
  // 1. Priority 1: Active Misconception - Backpropagation vs Optimizer (M01)
  {
    id: "mock_q1",
    concept: "Backpropagation",
    question: "A PyTorch script executes `loss.backward()`. Exactly what has happened in system memory at the end of this line?",
    type: "multiple_choice",
    options: [
      "The model's weight tensors were updated to lower the loss.",
      "The gradient buffers (`.grad`) were populated with partial derivatives; weights were untouched.",
      "The learning rate was applied to step toward the minimum.",
      "The next training batch was loaded into GPU cache."
    ],
    correctOptionIndex: 1,
    correctExplanation: "loss.backward() performs reverse-mode automatic differentiation. It calculates and writes partial derivatives into param.grad, leaving the actual weight tensors unchanged until optimizer.step() is called.",
    testsMisconceptionId: "M01",
    isTransfer: false
  },

  // 2. Priority 1: Active Misconception - Weight Mutation (M02)
  {
    id: "mock_q2",
    concept: "Backpropagation",
    question: "If you remove the line `optimizer.step()` from a training loop but leave `loss.backward()` intact, what will happen across 100 epochs?",
    type: "multiple_choice",
    options: [
      "The network will train normally because backpropagation handles weight updates.",
      "The loss will fluctuate randomly around zero.",
      "The weights will never change, and the model will fail to learn anything.",
      "Gradients will update the weights automatically without learning rate scaling."
    ],
    correctOptionIndex: 2,
    correctExplanation: "Without optimizer.step(), the weights are never modified. Backpropagation computes gradients on every epoch, but nothing applies those gradients to mutate the weights.",
    testsMisconceptionId: "M02",
    isTransfer: true
  },

  // 3. Priority 2: Weak / Needs Attention Concept - Backpropagation Chain Rule
  {
    id: "mock_q3",
    concept: "Backpropagation",
    question: "Why is the calculus chain rule foundational to backpropagation in deep multi-layer networks?",
    type: "multiple_choice",
    options: [
      "It allows computing partial derivatives of the final loss with respect to early weights by decomposing through intermediate layers.",
      "It allows the optimizer to dynamically choose between SGD and Adam.",
      "It accelerates GPU matrix multiplication by combining linear layers.",
      "It converts multidimensional gradients into scalar loss values."
    ],
    correctOptionIndex: 0,
    correctExplanation: "The chain rule allows computing ∂L/∂w for any layer by multiplying local Jacobians/derivatives backwards from the loss function through each composite transformation.",
    isTransfer: false
  },

  // 4. Priority 3: Developing Concept - Activation Derivatives & Vanishing Gradients (M05)
  {
    id: "mock_q4",
    concept: "Activation Derivatives",
    question: "In a 20-layer neural network with Sigmoid activations, early layers stop updating during training. What mathematical aspect of backpropagation causes this?",
    type: "multiple_choice",
    options: [
      "The learning rate decays to zero after layer 5.",
      "Sigmoid's maximum derivative is 0.25; repeatedly multiplying fractions < 0.25 across 20 layers causes gradients to vanish.",
      "Backpropagation skips neurons with non-negative inputs.",
      "The loss function becomes undefined for deep networks."
    ],
    correctOptionIndex: 1,
    correctExplanation: "Because the chain rule multiplies by the activation function's derivative at each layer, a maximum derivative of 0.25 raised to high powers rapidly shrinks upstream gradients toward zero.",
    testsMisconceptionId: "M05",
    isTransfer: true
  },

  // 5. Priority 3: Developing Concept - ReLU vs Sigmoid
  {
    id: "mock_q5",
    concept: "Activation Derivatives",
    question: "What property of the ReLU activation function's derivative specifically helps backpropagation prevent vanishing gradients?",
    type: "multiple_choice",
    options: [
      "Its derivative is exactly 1 for all positive inputs, preventing multiplicative decay.",
      "Its derivative smoothly curves between 0 and 1 like a logistic function.",
      "Its derivative automatically rescales parameter weights.",
      "It computes second-order Hessian matrices during the backward pass."
    ],
    correctOptionIndex: 0,
    correctExplanation: "For any positive input z > 0, d/dz ReLU(z) = 1. Multiplying by 1 does not attenuate or shrink gradients as they flow backward through deep layers.",
    isTransfer: false
  },

  // 6. Priority 4: Retention Verification - Gradient Descent Update Rule
  {
    id: "mock_q6",
    concept: "Gradient Descent",
    question: "In the standard gradient descent update formula `w_new = w_old - η * ∇L`, what role does the gradient `∇L` play?",
    type: "multiple_choice",
    options: [
      "It indicates the learning rate scaling factor.",
      "It represents the directional vector of steepest error increase, so subtracting it moves toward lower error.",
      "It measures the accuracy percentage on the validation set.",
      "It replaces the activation function during evaluation."
    ],
    correctOptionIndex: 1,
    correctExplanation: "The gradient points in the direction of steepest ascent (fastest increase in loss). Stepping in the negative direction (-∇L) minimizes the loss.",
    isTransfer: false
  },

  // 7. Priority 4: Retention Verification - Loss vs Gradient (M04)
  {
    id: "mock_q7",
    concept: "Loss Functions",
    question: "A training batch of 128 samples passes through a network with 5 million parameters. How many loss values and how many gradient values are generated?",
    type: "multiple_choice",
    options: [
      "128 loss values, 1 gradient value.",
      "5 million loss values, 1 gradient value.",
      "1 scalar loss value for the batch, and 5 million gradient values (one per parameter).",
      "5 million loss values and 5 million gradient values."
    ],
    correctOptionIndex: 2,
    correctExplanation: "Loss is a single scalar quantifying aggregate error on the batch. Gradients form a vector containing a separate partial derivative for every trainable parameter.",
    testsMisconceptionId: "M04",
    isTransfer: true
  }
];

export const INITIAL_MOCK_TEST: MockTest = {
  id: "mock_session_1",
  title: "Targeted Diagnostic Evaluation: Neural Networks Core",
  generatedAt: "Recently generated",
  rationale: "Synthesized from your active cognitive map: prioritized to diagnose Backpropagation vs Optimizer boundary (M01/M02) and test Activation Derivative propagation.",
  blueprint: [
    { topic: "Backpropagation", count: 3, purpose: "Active Misconception & Weak Concept Focus" },
    { topic: "Activation Derivatives", count: 2, purpose: "Developing Concept Transfer Test" },
    { topic: "Gradient Descent", count: 1, purpose: "Optimization Retention Verification" },
    { topic: "Loss Functions", count: 1, purpose: "Scalar vs Vector Disambiguation" }
  ],
  questions: MOCK_TEST_QUESTIONS_BANK,
  totalQuestions: MOCK_TEST_QUESTIONS_BANK.length,
  completed: false
};

import { Misconception, MisconceptionId } from "@/types";

export const MISCONCEPTIONS_TAXONOMY: Record<MisconceptionId, Misconception> = {
  M01: {
    id: "M01",
    name: "Backpropagation is the same as gradient descent",
    description: "Treating backpropagation and gradient descent as interchangeable terms for the same optimization process.",
    concept: "Backpropagation vs. Gradient Descent",
    explanation: {
      quick: "Backpropagation computes the error gradients with respect to parameters using the calculus chain rule. Gradient descent is a separate optimizer that takes those gradients to update the weights.",
      detailed: "In deep learning, training consists of two separate mathematical stages: (1) Gradient computation: Backpropagation traverses the computation graph in reverse, accumulating partial derivatives (dL/dw) via the chain rule. (2) Parameter update: An optimization algorithm (SGD, Adam, RMSprop) updates the weights using the rule w ← w - η∇L. Backpropagation never modifies parameters; it only generates the sensitivity vector that the optimizer consumes.",
      basics: "Think of Backpropagation as a surveyor measuring the exact steepness of a hill in all directions, while Gradient Descent is the hiker who actually takes steps down the slope based on those measurements. If you swap Gradient Descent for Adam, backpropagation remains completely unchanged because the derivatives are identical."
    },
    relationshipFlow: {
      stage1: "Forward Pass (Compute layer activations)",
      stage2: "Loss Function (Evaluate prediction disparity)",
      stage3: "Backpropagation (Calculates ∂Loss/∂w gradients via chain rule)",
      stage4: "Gradient Descent / Optimizer (Applies gradients to update weights: w ← w - η∇L)"
    },
    keyDistinction: {
      termA: "Backpropagation",
      descriptionA: "Calculates how the error changes with respect to model parameters (gradients) using the chain rule of calculus. It is an efficient bookkeeping algorithm for derivatives.",
      termB: "Gradient Descent",
      descriptionB: "An optimization algorithm that takes the gradients calculated by backpropagation and uses them to take steps to adjust parameter values."
    },
    analogy: "A surveyor measuring hill slope vs. a hiker stepping downhill.",
    example: "In PyTorch: `loss.backward()` calculates gradients; `optimizer.step()` updates the weights.",
    reassessmentQuestion: {
      prompt: "A neural network has completed its backward pass and all gradients have been calculated, but its weights have not yet changed in memory. Which stage just occurred, and what still needs to happen?",
      context: "Transfer scenario: debugging a training script where loss is not decreasing.",
      correctAnswerExplanation: "Backpropagation just finished (calculating ∂L/∂w), and an optimization step (such as gradient descent / optimizer.step()) is still required to actually mutate the parameters.",
      suggestedCorrectAnswer: "Backpropagation just occurred to compute the gradients. Gradient descent (or the optimizer) still needs to execute to update the weights using those gradients.",
      suggestedWrongAnswer: "Backpropagation is still running because it hasn't reached the input layer to update the weights yet."
    }
  },
  M02: {
    id: "M02",
    name: "Backpropagation directly updates the weights",
    description: "Believing that the backward pass itself mutates or adjusts the network weights in memory.",
    concept: "Weight Mutation vs Gradient Accumulation",
    explanation: {
      quick: "Backpropagation only populates the gradient tensors (.grad); it does not write new values into weight parameters.",
      detailed: "During `loss.backward()`, automatic differentiation traverses the reverse graph and accumulates partial derivatives into the `.grad` attribute of each parameter. The weight tensors themselves remain completely unchanged until an optimizer applies an update formula (`optimizer.step()`).",
      basics: "Backpropagation writes an itemized bill of necessary adjustments. The optimizer is the accountant that actually approves and pays the transaction."
    },
    relationshipFlow: {
      stage1: "Forward Pass (Calculates outputs y_pred)",
      stage2: "Scalar Loss (Calculates error L)",
      stage3: "Backpropagation (Populates weight.grad without changing weight values)",
      stage4: "Optimizer Step (Alters weight tensor in memory: weight.data -= lr * weight.grad)"
    },
    keyDistinction: {
      termA: "Backpropagation Pass",
      descriptionA: "Accumulates partial derivatives (dL/dw) without modifying parameter memory values.",
      termB: "Optimizer Step",
      descriptionB: "Applies an update rule (like learning rate, momentum, weight decay) to modify the actual weight values."
    },
    analogy: "An architect drafting blueprints for remodeling vs. the construction crew moving the walls.",
    example: "In PyTorch, checking `model.layer.weight` before and after `loss.backward()` shows identical values. Only `weight.grad` changes.",
    reassessmentQuestion: {
      prompt: "A student inspects `model.weights` right before and right after running `loss.backward()`. They are surprised to find the numbers are identical. Explain why this happens.",
      context: "Transfer scenario: inspecting tensor memory states during training.",
      correctAnswerExplanation: "loss.backward() only populates the .grad tensor; it does not touch the actual weight values until optimizer.step() is called.",
      suggestedCorrectAnswer: "Because backpropagation only computes and stores the gradients in the grad buffer; it does not modify the actual weight values.",
      suggestedWrongAnswer: "Because the learning rate was set to zero so backpropagation could not update the weights."
    }
  },
  M03: {
    id: "M03",
    name: "Gradients and weights are the same thing",
    description: "Confusing the parameter state (weights) with the sensitivity derivative of the loss (gradients).",
    concept: "Model Parameters vs Parameter Gradients",
    explanation: {
      quick: "Weights are the model parameters that define predictions. Gradients describe how sensitive the loss is to small changes in each weight.",
      detailed: "A weight w is an internal coordinate defining the network's current state. The gradient ∂L/∂w is a derivative describing the slope of the error surface at that coordinate. Weights persist across inference; gradients only exist during training to guide optimization.",
      basics: "A weight is like the angle of your car's steering wheel. The gradient is the GPS telling you which direction and how sharply you must turn to stay on course."
    },
    relationshipFlow: {
      stage1: "Weights (Static parameters evaluated during inference)",
      stage2: "Forward Pass (Produces predictions from inputs and weights)",
      stage3: "Error Surface (Defines loss relative to weight configurations)",
      stage4: "Gradient (Local derivative vector indicating direction of steepest ascent)"
    },
    keyDistinction: {
      termA: "Weights (w)",
      descriptionA: "The internal multipliers of neurons that persist and produce predictions.",
      termB: "Gradients (∂L/∂w)",
      descriptionB: "The instantaneous rate of change of loss with respect to each weight."
    },
    analogy: "Position coordinate on a mountain (weight) vs. the incline of the terrain at that spot (gradient).",
    example: "A weight can be 5.2 while its gradient is -0.01. The negative gradient says: increasing this weight slightly will decrease loss.",
    reassessmentQuestion: {
      prompt: "When deploying a neural network to a smartphone for offline inference, do you need to ship the weights, the gradients, or both?",
      context: "Transfer scenario: production mobile deployment of a trained model.",
      correctAnswerExplanation: "Only the weights are required for forward inference. Gradients are transient derivative values used only during backward training passes.",
      suggestedCorrectAnswer: "Only the weights are required for inference. Gradients are only temporary values computed during training to adjust weights.",
      suggestedWrongAnswer: "Both weights and gradients must be deployed so the smartphone can compute predictions."
    }
  },
  M04: {
    id: "M04",
    name: "Loss and gradient are the same thing",
    description: "Conflating the overall scalar error metric (loss) with the vector of directional derivatives (gradient).",
    concept: "Scalar Loss vs Vector Gradients",
    explanation: {
      quick: "Loss is a single scalar score measuring overall prediction error. Gradients are multidimensional vectors showing how each individual parameter should change.",
      detailed: "The loss L(y, y_pred) outputs a single real number (scalar) representing error on a batch. The gradient ∇L is a collection of tensors containing a separate partial derivative for every single parameter in the model (often millions of values).",
      basics: "The loss is your thermometer saying you have a 102°F fever (how bad it is). The gradient is the detailed medical prescription specifying exactly how much medicine each organ needs."
    },
    relationshipFlow: {
      stage1: "Predictions vs Ground Truth",
      stage2: "Objective Function (Calculates single scalar Loss)",
      stage3: "Chain Rule Differentiation",
      stage4: "Parameter Gradients (Vector matching total parameter count)"
    },
    keyDistinction: {
      termA: "Loss (L)",
      descriptionA: "A single scalar value (e.g., MSE = 0.38) quantifying total mismatch.",
      termB: "Gradient (∇L)",
      descriptionB: "A multidimensional vector of partial derivatives matching the dimensions of all trainable weights."
    },
    analogy: "A scoreboard score (loss) vs. player performance breakdown statistics (gradients).",
    example: "A ResNet-50 has 1 loss value per batch, but over 25 million gradient values.",
    reassessmentQuestion: {
      prompt: "If a model has 10 million parameters, how many loss values and how many gradient values are produced on a single training batch of 64 images?",
      context: "Transfer scenario: tensor dimensions during training.",
      correctAnswerExplanation: "There is 1 scalar loss value for the batch, and 10 million gradient values (one partial derivative per parameter).",
      suggestedCorrectAnswer: "There is 1 scalar loss value, and 10 million gradient values—one partial derivative for each parameter.",
      suggestedWrongAnswer: "There are 10 million loss values, one for each parameter in the network."
    }
  },
  M05: {
    id: "M05",
    name: "Activation derivatives do not affect backpropagation",
    description: "Assuming backpropagation only depends on weights and loss without realizing the activation function's derivative is a multiplicative factor in the chain rule.",
    concept: "Chain Rule & Activation Derivatives",
    explanation: {
      quick: "Backpropagation relies on the calculus chain rule, which directly multiplies by the local derivative of the activation function at each layer.",
      detailed: "When propagating error backwards through neuron j, the gradient is multiplied by σ'(z_j). If the activation function saturates (like Sigmoid with large inputs where σ' ≈ 0), the gradient gets multiplied by near-zero, causing the vanishing gradient problem.",
      basics: "The activation derivative acts like a valve in a pipeline. If the valve is closed (derivative = 0), no gradient flow can pass backwards to earlier layers."
    },
    relationshipFlow: {
      stage1: "Linear Sum: z = w·x + b",
      stage2: "Nonlinear Activation: a = σ(z)",
      stage3: "Backward Propagation: incoming gradient multiplied by σ'(z)",
      stage4: "Weight Gradient: ∂L/∂w = incoming_grad · σ'(z) · x"
    },
    keyDistinction: {
      termA: "Activation Function (σ)",
      descriptionA: "Introduces non-linearity into activations during forward pass.",
      termB: "Activation Derivative (σ')",
      descriptionB: "Multiplicative scaling factor in the backward pass chain rule."
    },
    analogy: "A series of valves in a water pipe. If one valve is squeezed shut (zero derivative), downstream water cannot flow backwards.",
    example: "In a deep Sigmoid network, multiplying derivatives < 0.25 across 10 layers shrinks the gradient by 0.25^10 ≈ 0.00000095.",
    reassessmentQuestion: {
      prompt: "A researcher switches from Sigmoid to ReLU activations and notices that weights in the earliest layers of a deep network start learning much faster. Why does changing the activation function affect backpropagation in early layers?",
      context: "Transfer scenario: architecture choice to prevent vanishing gradients.",
      correctAnswerExplanation: "Because backpropagation multiplies gradients by the activation derivative at every layer; ReLU has a derivative of 1 for positive inputs, avoiding vanishing gradients.",
      suggestedCorrectAnswer: "Because backpropagation multiplies incoming gradients by the activation derivative at each layer. ReLU has a derivative of 1 for positive inputs, preventing gradients from vanishing.",
      suggestedWrongAnswer: "Because ReLU changes the learning rate of the optimizer for the earlier layers."
    }
  }
};

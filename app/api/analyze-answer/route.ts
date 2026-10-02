import { NextRequest, NextResponse } from "next/server";
import { MISCONCEPTIONS_TAXONOMY } from "@/data/misconceptions";
import { DiagnosticEvaluation, MisconceptionId } from "@/types";

interface RequestBody {
  question: string;
  expectedConcept?: string;
  studentAnswer: string;
  previousAttempts?: Array<{
    question: string;
    studentAnswer: string;
    isCorrect?: boolean;
    misconceptionId?: MisconceptionId | null;
  }>;
  relevantMisconceptions?: MisconceptionId[];
}

// Semantic heuristic diagnostic analyzer for DEMO MODE or OpenAI fallback
function analyzeAnswerSemantically(
  question: string,
  studentAnswer: string,
  expectedConcept: string = "",
  previousAttempts: RequestBody["previousAttempts"] = []
): DiagnosticEvaluation {
  const answer = studentAnswer.trim();
  const lower = answer.toLowerCase();
  const qLower = question.toLowerCase();

  if (!answer) {
    return {
      correctness: "incorrect",
      conceptUnderstanding: "No response was provided.",
      missingConcept: "Explanation of gradient computation or parameter update.",
      misconceptionCandidates: [],
      evidenceSummary: "Empty submission.",
      isSimulated: true,
    };
  }

  // Count past evidence for M01 and M02
  const priorM01Count = previousAttempts.filter((a) => a.misconceptionId === "M01").length;
  const priorM02Count = previousAttempts.filter((a) => a.misconceptionId === "M02").length;
  const priorWeightConfusionCount = priorM01Count + priorM02Count;

  // -------------------------------------------------------------
  // 1. Check Reassessment / Transfer Questions
  // -------------------------------------------------------------
  const isTransferOrReassessment =
    qLower.includes("which stage just occurred") ||
    qLower.includes("which stage has occurred") ||
    qLower.includes("weights have not yet changed") ||
    qLower.includes("numbers are identical") ||
    qLower.includes("deploying a neural network to a smartphone") ||
    qLower.includes("how many loss values and how many gradient values") ||
    qLower.includes("why does changing the activation function affect backpropagation");

  if (isTransferOrReassessment) {
    // M01 / M02 Transfer check:
    if (qLower.includes("weights have not yet changed") || qLower.includes("which stage")) {
      const understandsBackpropFinished =
        lower.includes("backprop") ||
        lower.includes("backward") ||
        lower.includes("computed gradients") ||
        lower.includes("gradients calculated");

      const understandsOptimizerStillNeeded =
        lower.includes("gradient descent") ||
        lower.includes("optimizer") ||
        lower.includes("update") ||
        lower.includes("step");

      if (understandsBackpropFinished && understandsOptimizerStillNeeded) {
        return {
          correctness: "correct",
          conceptUnderstanding:
            "Student clearly distinguished the gradient calculation stage from the subsequent parameter update step in a transfer debugging scenario.",
          missingConcept: null,
          misconceptionCandidates: [],
          evidenceSummary:
            "Transfer assessment verified: Recognized that backpropagation already completed derivative accumulation and that the optimizer must still execute to alter weights.",
          isSimulated: true,
        };
      }

      if (lower.includes("backpropagation is still") || lower.includes("update the weights yet")) {
        return {
          correctness: "incorrect",
          conceptUnderstanding:
            "Student still attributes parameter mutation to backpropagation rather than the optimizer.",
          missingConcept: "Separation between derivative evaluation and optimizer step.",
          misconceptionCandidates: [{ id: "M01", confidence: 0.94 }],
          evidenceSummary:
            "Reassessment showed persistent M01 confusion: expected backpropagation to change the weights upon reaching the input layer.",
          isSimulated: true,
        };
      }
    }

    // M02 Transfer check:
    if (qLower.includes("numbers are identical")) {
      if (
        (lower.includes("grad") || lower.includes("gradient")) &&
        (lower.includes("buffer") || lower.includes("only computes") || lower.includes("optimizer.step"))
      ) {
        return {
          correctness: "correct",
          conceptUnderstanding:
            "Understands that loss.backward() only populates derivative buffers and leaves weight tensors untouched.",
          missingConcept: null,
          misconceptionCandidates: [],
          evidenceSummary:
            "Transfer verified: Accurately identified that backward passes write to gradient tensors, not weight tensors.",
          isSimulated: true,
        };
      }
    }

    // M03 Transfer check:
    if (qLower.includes("smartphone") || qLower.includes("offline inference")) {
      if (lower.includes("only the weights") || lower.includes("only weights") || (lower.includes("weights") && !lower.includes("both"))) {
        return {
          correctness: "correct",
          conceptUnderstanding:
            "Correctly distinguished static model parameters (weights) needed for forward inference from transient training derivatives (gradients).",
          missingConcept: null,
          misconceptionCandidates: [],
          evidenceSummary: "Transfer verified: Correctly recognized gradients are unnecessary for deployment.",
          isSimulated: true,
        };
      }
    }

    // M04 Transfer check:
    if (qLower.includes("how many loss values")) {
      if (
        (lower.includes("1 loss") || lower.includes("one loss") || lower.includes("single loss") || lower.includes("scalar")) &&
        (lower.includes("gradient") || lower.includes("million"))
      ) {
        return {
          correctness: "correct",
          conceptUnderstanding:
            "Accurately distinguished scalar batch error from multidimensional parameter gradient vectors.",
          missingConcept: null,
          misconceptionCandidates: [],
          evidenceSummary: "Transfer verified: Correct dimensional understanding of loss vs gradients.",
          isSimulated: true,
        };
      }
    }

    // M05 Transfer check:
    if (qLower.includes("earliest layers") || qLower.includes("relu activations")) {
      if (lower.includes("chain rule") || lower.includes("derivative") || lower.includes("vanishing") || lower.includes("multiply")) {
        return {
          correctness: "correct",
          conceptUnderstanding:
            "Understands that layer activation derivatives multiply backwards in the chain rule, preventing gradient decay.",
          missingConcept: null,
          misconceptionCandidates: [],
          evidenceSummary: "Transfer verified: Correct causal link between activation derivatives and backpropagation flow.",
          isSimulated: true,
        };
      }
    }
  }

  // -------------------------------------------------------------
  // 2. Disambiguation Question Probe (Part 7)
  // -------------------------------------------------------------
  const isDisambiguationProbe = qLower.includes("check one more thing") || qLower.includes("pause execution immediately");
  if (isDisambiguationProbe) {
    if (lower.includes("yes") || lower.includes("directly writes") || lower.includes("changes memory")) {
      return {
        correctness: "incorrect",
        conceptUnderstanding: "Believes the backward pass mutates weight memory directly.",
        missingConcept: "Gradients are stored in separate attributes; weights are mutated later by optimizer.",
        misconceptionCandidates: [{ id: "M02", confidence: 0.95 }],
        evidenceSummary:
          "Disambiguation resolved to M02: Confirmed student believes backward execution directly alters weight values in memory.",
        isSimulated: true,
      };
    }
    if (lower.includes("same equation") || lower.includes("same thing") || lower.includes("doesn't matter")) {
      return {
        correctness: "incorrect",
        conceptUnderstanding: "Conflates backpropagation and gradient descent as synonymous algorithms.",
        missingConcept: "Distinct mathematical roles: derivative evaluation vs parameter update rule.",
        misconceptionCandidates: [{ id: "M01", confidence: 0.95 }],
        evidenceSummary:
          "Disambiguation resolved to M01: Confirmed student treats gradient computation and optimization update as the identical process.",
        isSimulated: true,
      };
    }
    if (lower.includes("no") && (lower.includes("grad") || lower.includes("unchanged") || lower.includes("not changed"))) {
      return {
        correctness: "correct",
        conceptUnderstanding: "Correctly recognizes that weights remain untouched until the optimizer step.",
        missingConcept: null,
        misconceptionCandidates: [],
        evidenceSummary: "Probe verified: Accurately stated weights are unchanged after backward pass.",
        isSimulated: true,
      };
    }
  }

  // -------------------------------------------------------------
  // 3. General Semantic Evaluation of Student Explanations
  // -------------------------------------------------------------

  // Evidence indicating correct understanding:
  // Recognizes chain rule, computing gradients/derivatives, or optimizer role
  const describesGradientCalculation =
    lower.includes("chain rule") ||
    lower.includes("partial derivative") ||
    lower.includes("calculates gradients") ||
    lower.includes("calculates how much each weight contributed") ||
    lower.includes("computes gradients") ||
    lower.includes("computes the derivatives") ||
    lower.includes("rate of change of error") ||
    lower.includes("sensitivity of the loss") ||
    (lower.includes("backward pass computes") && lower.includes("optimizer"));

  const describesOptimizerBoundaryCorrectly =
    (lower.includes("gradient descent") || lower.includes("optimizer")) &&
    (lower.includes("uses those gradients") || lower.includes("uses them to update") || lower.includes("changes the weights based on"));

  // Check if student gives a conceptually sound answer
  if ((describesGradientCalculation || describesOptimizerBoundaryCorrectly) && !lower.includes("backpropagation updates the weights directly")) {
    return {
      correctness: "correct",
      conceptUnderstanding:
        "Student accurately captured the core causal mechanism: backpropagation computes error derivatives via the chain rule, which an optimizer then consumes to update weights.",
      missingConcept: null,
      misconceptionCandidates: [],
      evidenceSummary:
        "Conceptually sound: Correctly identified derivative computation and recognized the boundary between gradient evaluation and parameter updates.",
      isSimulated: true,
    };
  }

  // Evidence indicating M04: Conflating loss with gradients
  if (
    (lower.includes("evaluates the total scalar error") ||
      lower.includes("overall error score") ||
      lower.includes("measures the loss across the batch")) &&
    !lower.includes("derivative") &&
    !lower.includes("gradient")
  ) {
    return {
      correctness: "incorrect",
      conceptUnderstanding: "Student described calculating overall batch error rather than parameter derivatives.",
      missingConcept: "Layer-wise partial derivative computation using calculus chain rule.",
      misconceptionCandidates: [{ id: "M04", confidence: 0.88 }],
      evidenceSummary:
        "Identified M04 evidence: Conflated the aggregate loss score with backpropagation's parameter sensitivity gradients.",
      isSimulated: true,
    };
  }

  // Evidence indicating M03: Equating weights and gradients
  if (
    lower.includes("weights and gradients are the same") ||
    lower.includes("exact same values describing the connections") ||
    lower.includes("gradients are the weights")
  ) {
    return {
      correctness: "incorrect",
      conceptUnderstanding: "Student treated parameter weights and loss gradients as identical quantities.",
      missingConcept: "Weights define model state; gradients define instantaneous slope of error with respect to weights.",
      misconceptionCandidates: [{ id: "M03", confidence: 0.92 }],
      evidenceSummary:
        "Identified M03 evidence: Conflated parameter coordinates (weights) with derivative slopes (gradients).",
      isSimulated: true,
    };
  }

  // Evidence indicating M05: Disregarding activation derivatives
  if (
    lower.includes("ignores activation") ||
    lower.includes("activation derivatives do not affect") ||
    lower.includes("only depends on the learning rate")
  ) {
    return {
      correctness: "incorrect",
      conceptUnderstanding: "Student overlooked that activation derivatives are multiplicative factors in backpropagation.",
      missingConcept: "Multiplicative scaling by activation derivatives in the chain rule.",
      misconceptionCandidates: [{ id: "M05", confidence: 0.90 }],
      evidenceSummary:
        "Identified M05 evidence: Believed activation functions only affect forward activations and not backward gradients.",
      isSimulated: true,
    };
  }

  // Evidence indicating M01 vs M02 (Conflating backpropagation with weight updating / optimization)
  const indicatesWeightUpdate =
    lower.includes("updates and adjusts the weights") ||
    lower.includes("updates the weights") ||
    lower.includes("adjusts the weights directly") ||
    lower.includes("modifies the weights to minimize") ||
    lower.includes("new updated weight values") ||
    lower.includes("updated weight values") ||
    lower.includes("changes the weights directly") ||
    lower.includes("optimization algorithm that takes steps") ||
    lower.includes("replaces backpropagation with an adaptive formula");

  if (indicatesWeightUpdate) {
    // If ambiguity between M01 and M02 exists on the first occurrence:
    const hasAmbiguity =
      !lower.includes("memory") &&
      !lower.includes("directly writes") &&
      priorWeightConfusionCount === 0;

    if (hasAmbiguity) {
      return {
        correctness: "incorrect",
        conceptUnderstanding:
          "Student stated that backpropagation updates or adjusts weights, which conflates derivative calculation with parameter mutation.",
        missingConcept: "Backpropagation only evaluates gradients; an optimizer is required to adjust weights.",
        misconceptionCandidates: [
          { id: "M01", confidence: 0.72 },
          { id: "M02", confidence: 0.68 },
        ],
        evidenceSummary:
          "Potential conceptual issue detected: Attributed parameter updating to backpropagation. Ambiguity remains whether student treats them as the same algorithm (M01) or believes backprop mutates memory (M02).",
        suggestFollowUpQuestionId: "q_disambiguate_m01_m02",
        isSimulated: true,
      };
    }

    // High confidence M01 or M02 based on phrasing and history
    const isM02 = lower.includes("stored") || lower.includes("memory") || lower.includes("already been adjusted");
    const chosenId: MisconceptionId = isM02 ? "M02" : "M01";
    const confidence = priorWeightConfusionCount >= 2 ? 0.95 : 0.88;

    return {
      correctness: "incorrect",
      conceptUnderstanding:
        priorWeightConfusionCount >= 1
          ? `Consistent pattern (${priorWeightConfusionCount + 1} instances): Student conflates the backward gradient calculation pass with the parameter update optimization step.`
          : "Student stated that backpropagation updates the weights directly, rather than calculating gradients for an optimizer to consume.",
      missingConcept: "Distinct mathematical separation between gradient computation (backprop) and weight updating (gradient descent / optimizer).",
      misconceptionCandidates: [{ id: chosenId, confidence }],
      evidenceSummary:
        priorWeightConfusionCount >= 1
          ? `Confirmed pattern: Student consistently attributes weight updating responsibilities to backpropagation across multiple questions.`
          : `Evidence suggests misconception ${chosenId}: Treating backpropagation as a parameter update mechanism.`,
      isSimulated: true,
    };
  }

  // Partial understanding or general fallback
  if (lower.includes("gradient") || lower.includes("derivative") || lower.includes("error")) {
    return {
      correctness: "partially_correct",
      conceptUnderstanding:
        "Student recognized that backpropagation involves gradients and error signals, but lacked precision regarding the chain rule and optimizer separation.",
      missingConcept: "Explicit chain rule formulation and role of the optimizer.",
      misconceptionCandidates: [{ id: "M01", confidence: 0.65 }],
      evidenceSummary:
        "Partial conceptual understanding: Identified derivative context, but did not clearly separate gradient computation from optimization.",
      isSimulated: true,
    };
  }

  return {
    correctness: "incorrect",
    conceptUnderstanding:
      "Response does not accurately capture how backpropagation functions in neural network training.",
    missingConcept: "Calculus chain rule and derivative computation.",
    misconceptionCandidates: [{ id: "M01", confidence: 0.70 }],
    evidenceSummary: "Lacks core conceptual elements of backpropagation.",
    isSimulated: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { question, studentAnswer, expectedConcept = "", previousAttempts = [] } = body;

    if (!question || typeof studentAnswer !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Missing question or studentAnswer." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // In Demo Mode (no API key provided), run semantic heuristic engine
    if (!apiKey) {
      const demoResult = analyzeAnswerSemantically(
        question,
        studentAnswer,
        expectedConcept,
        previousAttempts
      );
      return NextResponse.json(demoResult);
    }

    // Call OpenAI when key is present
    try {
      const taxonomyPrompt = Object.values(MISCONCEPTIONS_TAXONOMY)
        .map((m) => `- ${m.id}: "${m.name}" - ${m.description} (Concept: ${m.concept})`)
        .join("\n");

      const attemptsHistory =
        previousAttempts.length > 0
          ? `PREVIOUS ATTEMPTS IN THIS SESSION:\n` +
            previousAttempts
              .map(
                (att, idx) =>
                  `Attempt ${idx + 1}: Question: "${att.question}" | Answer: "${att.studentAnswer}" | Prior Misconception: ${att.misconceptionId || "None"}`
              )
              .join("\n")
          : "No previous attempts in this session.";

      const systemPrompt = `You are the diagnostic assessment engine for MindMap AI.
Your purpose is to evaluate a student's answer based on CONCEPTUAL MEANING rather than rigid keyword matching.
Students can express correct ideas in their own words.

EVALUATION CRITERIA:
1. Accept valid paraphrasing and causal explanations.
2. If student expresses an underlying misconception, classify against this PREDEFINED TAXONOMY:
${taxonomyPrompt}
3. Never invent new misconception IDs. Only use: "M01", "M02", "M03", "M04", "M05", or empty array.
4. Output STRICT JSON adhering to this exact schema:
{
  "correctness": "correct" | "partially_correct" | "incorrect",
  "conceptUnderstanding": string, // 1 sentence describing their demonstrated understanding
  "missingConcept": string | null, // key missing concept, or null if correct
  "misconceptionCandidates": [
    { "id": "M01" | "M02" | "M03" | "M04" | "M05", "confidence": number }
  ],
  "evidenceSummary": string // Concise summary of the evaluation evidence
}
5. Do not include markdown codeblocks or extraneous text. Return raw valid JSON.`;

      const userPrompt = `${attemptsHistory}

QUESTION:
"${question}"
EXPECTED CONCEPT:
"${expectedConcept}"

STUDENT'S ANSWER:
"${studentAnswer}"

Evaluate conceptual meaning and return strictly the JSON object.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 350,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!openAiRes.ok) {
        console.warn(`OpenAI returned ${openAiRes.status}. Using semantic demo analyzer.`);
        const fallback = analyzeAnswerSemantically(
          question,
          studentAnswer,
          expectedConcept,
          previousAttempts
        );
        return NextResponse.json(fallback);
      }

      const openAiData = await openAiRes.json();
      const rawContent = openAiData.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error("Empty response from OpenAI");
      }

      const parsed: DiagnosticEvaluation = JSON.parse(rawContent);

      return NextResponse.json({
        ...parsed,
        isSimulated: false,
      });
    } catch (apiError) {
      console.error("OpenAI call failed or timed out. Falling back to semantic demo evaluator:", apiError);
      const fallback = analyzeAnswerSemantically(
        question,
        studentAnswer,
        expectedConcept,
        previousAttempts
      );
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("Unhandled error in analyze-answer:", error);
    return NextResponse.json(
      {
        correctness: "incorrect",
        conceptUnderstanding: "Answer evaluated via fallback diagnostic engine.",
        missingConcept: "Derivative vs optimizer distinction.",
        misconceptionCandidates: [{ id: "M01", confidence: 0.75 }],
        evidenceSummary: "Fallback semantic evaluation.",
        isSimulated: true,
      },
      { status: 200 }
    );
  }
}

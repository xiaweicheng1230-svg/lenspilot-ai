# AI Design

## Principle

The model is a photography coach, not an aesthetic judge. The application supplies the image, normalized EXIF, user goal, scene type, and note. Missing EXIF fields remain null and must not be inferred as facts.

## Reliability layers

1. Versioned system and task prompts
2. Provider interface independent of a specific model vendor
3. Structured output requested from the provider
4. Pydantic validation and bounded scores
5. Safe defaults only for non-semantic optional fields
6. Explicit failure and retry when semantic content is invalid
7. Persisted provider, model, prompt version, latency, and Mock flag

## Advice policy

Camera settings are expressed as a starting range with trade-offs. The report must state that real settings depend on available light, stabilization, subject motion, equipment, and the user's creative intent.

## Prompt versions

- `photo_analysis_v1`: baseline structured diagnosis
- `photo_analysis_v2`: evidence-aware diagnosis, executable advice, and uncertainty
- `parameter_explanation_v1`: image-specific parameter explanation
- `learning_plan_v1`: profile-grounded seven-day plan

Actual prompts will be committed with the analysis implementation so every stored result can reference the prompt that produced it.


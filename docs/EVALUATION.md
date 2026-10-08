# AI Evaluation

## Current status

待采集真实测试集。当前阶段只定义评测协议，不声明任何模型效果数据。

## Planned cases

- Night scene
- Portrait
- Motion
- Overexposure
- Underexposure
- Blur
- Normal exposure
- Image without EXIF

## Metrics

- JSON schema success rate
- Required-field completeness
- Actionability of advice
- Correct use of available EXIF
- Hallucination of absent EXIF
- Response latency

## Method

Machine-checkable metrics will be calculated by the evaluation runner. Advice quality and hallucination require a documented human rubric. Results must include provider, model, prompt version, dataset version, date, and sample count.


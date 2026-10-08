FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml ./
COPY app ./app
RUN pip install --no-cache-dir .

RUN addgroup --system lenspilot && adduser --system --ingroup lenspilot lenspilot \
    && mkdir -p /app/data /app/uploads \
    && chown -R lenspilot:lenspilot /app

USER lenspilot

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


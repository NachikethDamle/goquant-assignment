# GoQuant Backend

## Setup Instructions

1. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the server:
    ```bash
    uvicorn app.main:app --reload
    ```

4. Access the API:
    ```
    http://localhost:8000/api/ohlcv?symbol=BTC-USDT&interval=1H
    ```
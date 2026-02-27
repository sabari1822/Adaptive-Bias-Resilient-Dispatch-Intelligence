#!/bin/bash
source venv/bin/activate
uvicorn app:app --port 8000 > uvicorn.log 2>&1 &
UVICORN_PID=$!
echo "Started uvicorn on PID $UVICORN_PID"
sleep 4
echo "Running Playwright script..."
python take_screenshots.py
if [ $? -ne 0 ]; then
  echo "Playwright failed"
  kill -9 $UVICORN_PID
  exit 1
fi
echo "Generating PDF..."
python generate_test_pdf.py
echo "Killing uvicorn..."
kill -9 $UVICORN_PID
echo "Done"

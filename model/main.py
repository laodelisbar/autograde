from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from test_controller import predict_text
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)

@app.get("/")
def read_root():
    return {"Hello": "World"}

class TextInputs(BaseModel):
    input_premise: list[str]
    input_hypothesis: list[str]

@app.post("/predict")
def predict(inputs: TextInputs):
    try:
        return predict_text(inputs.input_premise, inputs.input_hypothesis)
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
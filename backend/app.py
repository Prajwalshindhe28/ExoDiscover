import pickle
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
import uvicorn 
import pandas as pd
import joblib
import json
from io import StringIO
import numpy as np

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from your frontend
# This is crucial for development!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Load your trained model
with open('Gradient_Boosting.pkl', 'rb') as f:
    model = pickle.load(f)

with open('accuracy_Gradient_boosting.pkl','rb') as f:
    accuracy_Gradient_boosting = pickle.load(f)



class KeplerInput(BaseModel):
    koi_fpflag_nt: float
    koi_fpflag_ss: float
    koi_fpflag_co: float
    koi_fpflag_ec: float
    koi_period: float
    koi_period_err1: float
    koi_period_err2: float
    koi_time0bk: float
    koi_time0bk_err1: float
    koi_time0bk_err2: float
    koi_impact: float
    koi_impact_err1: float
    koi_impact_err2: float
    koi_duration: float
    koi_duration_err1: float
    koi_duration_err2: float
    koi_depth: float
    koi_depth_err1: float
    koi_depth_err2: float
    koi_prad: float
    koi_prad_err1: float
    koi_prad_err2: float
    koi_teq: float
    koi_insol: float
    koi_insol_err1: float
    koi_insol_err2: float
    koi_model_snr: float
    koi_steff: float
    koi_steff_err1: float
    koi_steff_err2: float
    koi_slogg: float
    koi_slogg_err1: float
    koi_slogg_err2: float
    koi_srad: float
    koi_srad_err1: float
    koi_srad_err2: float




# Define your prediction endpoint   
@app.post("/predict")
def predict(data: list[KeplerInput]):
    results = []
    for row in data:
        # Convert Pydantic model to list of values
        features = np.array(list(row.dict().values())).reshape(1, -1)

        # Make a prediction
        prediction = model.predict(features)

        # Format prediction result
        if int(prediction[0]) == 1:
            results.append({"prediction": "Confirmed Exoplanet", "accuracy": f"{accuracy_Gradient_boosting:.2f}"})
        else:
            results.append({"prediction": "False Positive", "accuracy": f"{accuracy_Gradient_boosting:.2f}"})

    # Return list of results
    return results

@app.get("/")
def read_root():
    return {"message":'Hello world'}

if __name__ == '__main__':
    uvicorn.run(app, host = '127.0.0.1',port =8000 )
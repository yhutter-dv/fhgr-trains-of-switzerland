from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

df_stations = pd.read_csv("./data_cleaned/sbb_stations.csv", sep=",")
app = FastAPI()

@app.get("/stations")
def stations():
    return df_stations.to_dict(orient="records")

# Enable CORS: It is important that this is done AFTER defining the endpoints.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

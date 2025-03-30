from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


def prepare_df_arrival(df_arrival_departure):
    # Ignore Null values
    df_arrival = df_arrival_departure[df_arrival_departure["arrival_time"].notnull()]


    relevant_columns = ["opuic", "arrival_time", "arrival_delay"]
    df_arrival = df_arrival[relevant_columns]

    # Convert to correct types
    df_arrival["arrival_time"] = pd.to_datetime(df_arrival['arrival_time'])

    # Set arrival_time column as the index
    df_arrival.set_index('arrival_time', inplace=True)

    return df_arrival

df_stations = pd.read_csv("./data_cleaned/sbb_stations.csv", sep=";")
df_arrival_departure = pd.read_csv("./data_cleaned/data_cleaned.csv", sep=";")

df_arrival = prepare_df_arrival(df_arrival_departure)

app = FastAPI()

def get_arrival_delay_count(sample_interval):
    # Resample and calculate number of delays in a certain inverval
    df_arrival_resampled = df_arrival.groupby(["opuic"]).resample(sample_interval).count()

    # Rename column for clarity
    df_arrival_resampled.rename(columns={"arrival_delay": "arrival_delay_count", "opuic": "opuic_count" }, inplace=True)

    # Remove unneeded column
    df_arrival_resampled.drop(columns=["opuic_count"], inplace=True)

    # Convert back into regular dataframe
    df_arrival_resampled.reset_index(inplace=True)

    # Calculate nomralized value for count (between 0 and 1)
    max_number_of_delays = df_arrival_resampled['arrival_delay_count'].max()
    df_arrival_resampled['arrival_delay_count_normalized'] = df_arrival_resampled['arrival_delay_count'] / max_number_of_delays

    # Add information about station by joining on opuic such as longitude and latitude
    df_arrival_resampled = df_arrival_resampled.merge(df_stations[['opuic', 'stop_name', 'longitude', 'latitude']], on='opuic', how='left')

    # Add column for utc seconds
    df_arrival_resampled['arrival_time_seconds'] = df_arrival_resampled['arrival_time'].astype('int64') / 1_000_000_000

    # Filter out any values that do not have a longitude and latitude
    df_arrival_resampled = df_arrival_resampled[(df_arrival_resampled["longitude"].notnull()) & (df_arrival_resampled["latitude"].notnull()) ]

    return df_arrival_resampled



@app.get("/stations")
def stations():
    return df_stations.to_dict(orient="records")

@app.get("/stations/arrival_delays")
def stations_arrival_delays(sample_interval = "1h"):
    df_result = get_arrival_delay_count(sample_interval)
    return df_result.to_dict(orient="records")

# Enable CORS: It is important that this is done AFTER defining the endpoints.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

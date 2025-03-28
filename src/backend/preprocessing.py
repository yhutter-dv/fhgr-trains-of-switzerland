import argparse
import pandas as pd
import os.path
import glob

def preprocess_station_file(args):
    if os.path.isfile(args.input_station_file) == False:
        print(f"ERROR: Input Station file '{args.input_station_file}' was not found!")
        return

    if args.output_station_file.endswith(".csv") == False:
        print(f"ERROR: Please make sure that the output station '{args.output_station_file}' ends with '.csv'")
        return

    try:
        print(f"Preprocssing station file '{args.input_station_file}'")
        interested_columns = {
            "Station abbreviation": "station_abbreviation",
            "Stop name": "stop_name",
            "OPUIC": "opuic",
            "KM": "km",
            "Geopos": "geopos",
        }


        df_stations = pd.read_csv(args.input_station_file, sep=";", usecols=interested_columns.keys())
        # Rename columns
        df_stations.rename(columns=interested_columns, inplace=True)

        # Remove any duplicates
        df_stations.drop_duplicates(subset=['opuic'], keep='first', inplace=True)

        # Create separate column for longitude and latitude from geopos
        df_stations[['latitude', 'longitude']] = df_stations['geopos'].str.split(',', expand=True)

        # Convert to correct types
        df_stations['longitude'] = df_stations['longitude'].astype(float)
        df_stations['latitude'] = df_stations['latitude'].astype(float)

        # Remove geopos
        df_stations.drop('geopos', axis=1, inplace=True)

        # Save
        df_stations.to_csv(args.output_station_file, index=False, sep=";")
        print(f"Generated cleaned station file '{args.output_station_file}'")
    except Exception as e:
        print(f"ERROR: '{e}'")

def preprocess_input_data_to_df(csv_file_path):
    print(f"Preprocssing file '{csv_file_path}'")
    interested_columns = {
        "Day of operation": "day_of_operation",
        "Product ID": "product_id",
        "OPUIC": "opuic",
        "Linie": "train_id",
        "Line Text": "train_line",
        "Stop name": "stop_name",
        "OPUIC": "opuic",
        "Arrival time": "arrival_time",
        "Arrival forecast": "arrival_forecast",
        "Arrival forecast status": "arrival_forecast_status",
        "Arrival delay": "arrival_delay",
        "Departure time": "departure_time",
        "Departure forecast": "departure_forecast",
        "Departure forecast status": "departure_forecast_status",
        "Departure delay": "departure_delay",
    }
    df_arrival_departure = pd.read_csv(csv_file_path, sep=";", usecols=interested_columns.keys())
    # Rename columns
    df_arrival_departure.rename(columns=interested_columns, inplace=True)

    # Convert to correct type
    df_arrival_departure["arrival_time"] = pd.to_datetime(df_arrival_departure['arrival_time'])
    df_arrival_departure["departure_time"] = pd.to_datetime(df_arrival_departure['departure_time'])

    return df_arrival_departure


def preprocess_input_data_dir(args):
    if os.path.isdir(args.input_data_dir) == False:
        print(f"ERROR: Input data directory '{args.input_data_dir}' not found!")
        return
    if args.output_data_file.endswith(".csv") == False:
        print(f"ERROR: Please make sure that the output data file '{args.output_data_file}' ends with '.csv'")
        return

    try:
        print(f"Preprocssing input data directory '{args.input_data_dir}'")
        # Iterate over all csv files inside the directory and merge into a single big data frame
        csv_glob = os.path.join(args.input_data_dir, "*.csv")
        df_complete = None
        for index, csv_file_path in enumerate(glob.glob(csv_glob)):
            try:
                if index == 0:
                    df_complete = preprocess_input_data_to_df(csv_file_path)
                else:
                    df_temp = preprocess_input_data_to_df(csv_file_path)
                    df_complete = pd.concat([df_complete, df_temp])
            except Exception as e:
                print(f"ERROR: Failed to preprocess file '{csv_file_path}' because of '{e}', it will be skipped!")
                continue
        # Save
        df_complete.to_csv(args.output_data_file, index=False, sep=";")
        print(f"Generated data file '{args.output_data_file}'")
    except Exception as e:
        print(f"ERROR: '{e}'")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='preprocessing')
    parser.add_argument('--input-station-file', help='CSV File for stations which should be preprocessed', required=True)
    parser.add_argument('--input-data-dir', help='Directory which contains CSV Files for Arrival Departures to be preprocessed', required=True)
    parser.add_argument('--output-station-file', help='Full path where to preprocessed station file should be saved', required=True)
    parser.add_argument('--output-data-file', help='Full path where to preprocessed data file should be saved', required=True)
    args = parser.parse_args()

    preprocess_station_file(args)
    preprocess_input_data_dir(args)

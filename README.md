# fhgr-trains-of-switzerland
A `Visual Analytics Tool` to explore the train network of SBB in Switzerland.

## Prerequisites
Make sure you have an up to date version of `Python` and `NodeJs` installed. For the development I used the following versions:
- Python version `3.13.2`
- NodeJs version `v23.9.0`

## Folder structure
The Application is split into a `frontend` which does the visualization and `backend` which provides a `REST` API and does the data processing.

## Preprocessing
For preprocessing a script called `src/backend/preprocessing.py` was created which can be invoked from the command line:

```bash
python3 preprocessing.py --input-station-file data/sbb_stations.csv --input-data-dir data/arrival_departure_files/ --output-station-file data_cleaned/sbb_stations.csv --output-data-file data_cleaned/data_cleaned.csv
```

## Running the Application
> :warning: Make sure to start the `backend` before the `frontend`

### Backend
Open a `terminal` and enter the following commands:

```bash
cd src/backend # Navigate into the backend directory
python3 -m venv ./venv # Create a virtual environment
source ./venv/bin/activate.sh # Activate the virtual environment
pip3 install -r ./requirements.txt # Install all required backages
fastapi dev # Run the backend
```

### Jupyter Notebooks
> :warning: Make sure you have your `virtual environment` activated and installed all relevant packages. If you have completed the steps above this is already the case.

The Jupyter Notebook is located inside `backend` directory. It was mainly used for exploring the dataset.

```bash
cd src/backend # Navigate into the backend directory
python3 -m ipykernel install --user --name=venv # Install the venv as an available kernel
jupyter notebook sbb_notebook.ipynb # Run Jupyter Notebook
```

### Frontend
Open a `terminal` and enter the following commands:

```bash
cd src/frontend # Navigate into the frontend directory
npm i # Install all relevant node packages
npm run dev # Run the frontend
```

## Data
During the development of the Visual Analytics Tool the following `data` was used:
- [SBB departure and arrival times](https://data.sbb.ch/explore/dataset/ist-daten-sbb/information/)
- [SBB stations](https://data.sbb.ch/explore/dataset/linie-mit-betriebspunkten/information/)

## Frameworks 
The following `Frameworks` were used:
- [Vite](https://vite.dev/)
- [MapLibreGL JS](https://github.com/maplibre/maplibre-gl-js)


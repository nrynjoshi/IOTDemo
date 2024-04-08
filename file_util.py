import json
import pandas as pd


def read_json_file(filename):
    file = open(filename)
    data = json.load(file)
    # Convert the updated dictionary back to a JSON string
    response = json.dumps(data, indent=2)
    return response


def read_csv_file(filename):
    df = pd.read_csv(filename, dtype=str)
    df = df.fillna('')
    print(df)
    data = {'header': list(df.columns.values), 'values': df.values.tolist()}
    return data

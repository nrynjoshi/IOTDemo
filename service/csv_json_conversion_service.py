import csv
import json
import time

import pandas as pd


def convert_csv_to_json(csv_data):
    start_time = time.time()
    # Split CSV data into header and body
    json_list = []
    try:

        print("convert_csv_to_json initialize")
        csv_reader = csv.reader(csv_data.splitlines())
        csv_header = next(csv_reader)  # Get the header

        for row in csv_reader:
            data = {}
            options = []
            for i, column in enumerate(row):
                jsonKey = csv_header[i]
                jsonValue = column

                if jsonKey.startswith("option"):
                    options.append(jsonValue)
                else:
                    data[jsonKey] = jsonValue
                if options:
                    data["options"] = options

            json_list.append(data)
        print("convert_csv_to_json completed")
        print("convert_csv_to_json --- %s seconds" % (time.time() - start_time))
        return json_list
    except Exception as ex:
        print("convert_csv_to_json error")
        print(f"Error CSV To JSON conversion: {ex}")
        return json_list


def dump_to_json(data):
    return json.dumps(data)


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

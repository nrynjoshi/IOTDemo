import csv
import json


def convert_csv_to_json(csv_data):
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
        return json_list
    except Exception as ex:
        print("convert_csv_to_json error")
        print(f"Error CSV To JSON conversion: {ex}")
        return json_list


def dump_to_json(data):
    return json.dumps(data)

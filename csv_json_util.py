import csv
import json

def convert_csv_to_json(csv_data):
    # Split CSV data into header and body
    json_list = []
    try:

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

                data["options"] = options

            json_list.append(data)
        return json_list


        # for idxCsvBody, csv_body in enumerate(csv_body_list):
        #     print("idxCsvBody:{}".format(idxCsvBody))
        #     csv_body_column = csv_body.split(",")
        #     data = {}
        #     options = []
        #     for idx, rowByRow in enumerate(csv_body_column):
        #         print("idx:{}".format(idx))
        #         if len(csv_header)-1 == idx:
        #             break
        #
        #         jsonKey = csv_header[idx]
        #         jsonValue = rowByRow
        #
        #         if jsonKey.startswith("option"):
        #             options.append(jsonValue)
        #         else:
        #             data[jsonKey] = jsonValue
        #
        #     data["options"] = options
        #     json_list.append(data)
        # return json_list
    except Exception as ex:
        print(f"Error CSV To JSON conversion: {ex}")
        return json_list



def dump_to_json(data):
    return json.dumps(data)
import json

def read_file(filename):
    file=open(filename)
    data = json.load(file)
    # Convert the updated dictionary back to a JSON string
    response = json.dumps(data, indent=2)
    return response

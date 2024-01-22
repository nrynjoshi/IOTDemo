import json

def change_jsonKeyName(response, parseRootKeyName, fromJsonKeyName, toJsonKeyName):
    # Parse the JSON string into a Python dictionary
    data = json.loads(response)

    # Iterate through nodes and update keys
    for node in data[parseRootKeyName]:
        node[toJsonKeyName] = node.pop(fromJsonKeyName)

    # Convert the updated dictionary back to a JSON string
    response = json.dumps(data, indent=2)
    return response




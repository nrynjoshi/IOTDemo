from service import azure_blob_call_service


# TODO-List page api part started

def todo_list():
    list = azure_blob_call_service.getRecordsContainer("Daily_Activities_Records.csv")
    return list

# TODO-List page api part ended

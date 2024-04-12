# Emergency page api part started
from service import azure_blob_call_service

def emergency_contacts():
    list = azure_blob_call_service.getRecordsContainer("Emergency Contact List.csv")
    return list

# Emergency page api part ended

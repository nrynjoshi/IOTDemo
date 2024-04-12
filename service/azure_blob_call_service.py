from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from service import csv_json_conversion_service
import time
from datetime import datetime

userId = ['1503960366']
userIdentity = '1503960366'


def getRulesContainer(blob_name):
    container_name = "rules"  # Name of the container where your CSV file is stored
    my_list = []
    try:
        csv_data = download_blob_from_storage(container_name, blob_name)
        my_list = csv_json_conversion_service.convert_csv_to_json(csv_data)
        return my_list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


def getRecordsContainer(blob_name):
    container_name = "records"  # Name of the container where your CSV file is stored
    list = get_json_from_storage_container_csv_file(container_name, blob_name)
    return list


def getUserRecordDbContainerData(blob_name):
    current_date = datetime.now()  # Get the current date
    year = current_date.year
    month = current_date.month

    # Convert the month integer to a string with leading zero if necessary
    month = str(month).zfill(2)
    filename = blob_name + '_' + str(year) + '_' + str(month) + '_' + str(userIdentity) + '.csv'
    container_name = "userrecorddb"  # Name of the container where your CSV file is stored
    list = get_json_from_storage_container_csv_file(container_name, filename)
    return list


# -------------------------- main connection code portion start ---------------------------

# Connection string for your Azure Storage Account
connection_string = "DefaultEndpointsProtocol=https;AccountName=visualizationdataset;AccountKey=jPzuNJEDQ4EP0KQZ/eNSbIEQCtRBOLte6a8Dl7ipc9Y/UKuyfjGU189qLjH1qrXr5CtsjkjxPETB+AStTwOAFw==;EndpointSuffix=core.windows.net"


def get_json_from_storage_container_csv_file(container_name, blob_name):
    my_list = []
    try:
        start_time = time.time()
        csv_data = download_blob_from_storage(container_name, blob_name)

        my_list = csv_json_conversion_service.convert_csv_to_json(csv_data)

        print("get_json_from_storage_container_csv_file --- %s seconds" % (time.time() - start_time))
        return my_list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


# Create the BlobServiceClient object which will be used to create a container client
blob_service_client = BlobServiceClient.from_connection_string(connection_string)


def download_blob_from_storage(container_name, blob_name):
    try:
        start_time = time.time()
        print(f"download_blob_from_storage initialize : {container_name} -> {blob_name}")

        # Create a blob client using the blob service client
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

        # Download blob data
        download_stream = blob_client.download_blob()

        # Decode the byte stream and convert it to string
        blob_data = download_stream.readall().decode('utf-8')
        print("download_blob_from_storage completed")
        print("download_blob_from_storage --- %s seconds" % (time.time() - start_time))
        return blob_data

    except Exception as e:
        print("download_blob_from_storage error")
        print(f"Error downloading blob: {e}")
        return None

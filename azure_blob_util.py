from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import csv_json_util

# Connection string for your Azure Storage Account
connection_string = "DefaultEndpointsProtocol=https;AccountName=visualizationdataset;AccountKey=jPzuNJEDQ4EP0KQZ/eNSbIEQCtRBOLte6a8Dl7ipc9Y/UKuyfjGU189qLjH1qrXr5CtsjkjxPETB+AStTwOAFw==;EndpointSuffix=core.windows.net"


def getRecords(blob_name):
    list = []
    try:
        # Name of the container where your CSV file is stored
        container_name = "records"

        csv_data = download_blob_from_storage(container_name, blob_name)

        list = csv_json_util.convert_csv_to_json(csv_data)

        return list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return list


def download_blob_from_storage(container_name, blob_name):
    try:
        # Create the BlobServiceClient object which will be used to create a container client
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)

        # Create a blob client using the blob service client
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

        # Download blob data
        download_stream = blob_client.download_blob()

        # Decode the byte stream and convert it to string
        blob_data = download_stream.readall().decode('utf-8')

        return blob_data

    except Exception as e:
        print(f"Error downloading blob: {e}")
        return None


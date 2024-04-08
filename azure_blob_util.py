from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import csv_json_util

userId = ['1503960366', '2022484408']


def getRulesContainer(blob_name):
    container_name = "rules"  # Name of the container where your CSV file is stored
    my_list = []
    try:
        csv_data = download_blob_from_storage(container_name, blob_name)
        my_list = csv_json_util.convert_csv_to_json(csv_data)
        return my_list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


def getRecordsContainer(blob_name):
    container_name = "records"  # Name of the container where your CSV file is stored
    list = get_json_from_storage_container_csv_file(container_name, blob_name)
    return list


def getSelfMadeContainerData(blob_name):
    container_name = "selfmadedata"  # Name of the container where your CSV file is stored
    list = get_json_from_storage_container_csv_file(container_name, blob_name)
    return list


def getFitabaseContainerdata(blob_name):
    container_name = "fitabasedata"  # Name of the container where your CSV file is stored
    list = get_json_from_storage_container_csv_file(container_name, blob_name)
    return list


# -------------------------- main connection code portion start ---------------------------

# Connection string for your Azure Storage Account
connection_string = "DefaultEndpointsProtocol=https;AccountName=visualizationdataset;AccountKey=jPzuNJEDQ4EP0KQZ/eNSbIEQCtRBOLte6a8Dl7ipc9Y/UKuyfjGU189qLjH1qrXr5CtsjkjxPETB+AStTwOAFw==;EndpointSuffix=core.windows.net"


def get_json_from_storage_container_csv_file(container_name, blob_name):
    my_list = []
    try:
        csv_data = download_blob_from_storage(container_name, blob_name)

        my_list = csv_json_util.convert_csv_to_json(csv_data)
        # filter by id and set to main list
        filterByIdList = []
        count = 0
        foundUserId = 0
        for x in my_list:

            element_to_check = x['Id']

            # Use filter to create an iterator of elements equal to the target element
            filtered_elements = filter(lambda userid: userid == element_to_check, userId)

            # Convert the iterator to a list and check if it's not empty
            if list(filtered_elements):
                if foundUserId == 0:
                    foundUserId = element_to_check
                if foundUserId == element_to_check:
                    filterByIdList.append(x)
                    count = count + 1
            # else:
            # print("Element does not exist in the list")

        filterByIdList.reverse()
        return filterByIdList
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


def download_blob_from_storage(container_name, blob_name):
    try:
        print(f"download_blob_from_storage initialize : {container_name} -> {blob_name}")
        # Create the BlobServiceClient object which will be used to create a container client
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)

        # Create a blob client using the blob service client
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

        # Download blob data
        download_stream = blob_client.download_blob()

        # Decode the byte stream and convert it to string
        blob_data = download_stream.readall().decode('utf-8')
        print("download_blob_from_storage completed")
        return blob_data

    except Exception as e:
        print("download_blob_from_storage error")
        print(f"Error downloading blob: {e}")
        return None

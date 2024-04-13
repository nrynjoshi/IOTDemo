import time
from datetime import datetime

from azure.storage.blob import BlobServiceClient

import csv
import time

# hardcoded the userIdentify but it will collect from session in future work
userIdentity = '1503960366'


# getConstantContainer function will read the information from blob_name csv file under constant container
# It takes param blob_name which is the filename with extension i.e.csv to download a file from server
def getConstantContainer(blob_name):
    container_name = "constant"  # Name of the container where your CSV file is stored
    my_list = []
    try:
        csv_data = download_blob_from_storage(container_name, blob_name)
        my_list = convert_csv_to_json(csv_data)
        return my_list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


# getUserBasicInfoByIdentity function will read the user information from static defined userId from
# user_basic_info.csv blob_name csv file under userrecorddb.
# It will give that user basic information like name, dataofbirth etc
def getUserBasicInfoByIdentity():
    container_name = "userrecorddb"  # Name of the container where your CSV file is stored
    # reading the actual data
    list = get_json_from_storage_container_csv_file(container_name, "user_basic_info.csv")
    userInfo = {}
    for x in list:
        if x['Id'] == userIdentity:
            userInfo = x
            break
    if len(userInfo) == 0:
        raise Exception("User does not exist")
    return userInfo


# getUserRecordDbContainerData function will read the information from blob_name csv file under userrecorddb
# container for the specific user and current year and month dataset It takes param blob_name which is the filename

# with extension i.e.csv to download a file from server
def getUserRecordDbContainerData(blob_name):
    # Getting the current date time to get the current month and year for preparing the proper filename
    current_date = datetime.now()  # Get the current date
    year = current_date.year
    month = current_date.month

    # Convert the month integer to a string with leading zero if necessary
    month = str(month).zfill(2)

    # Prepare the filename to access the data for given year and given month with specific userId only
    # TODO: Latter that userIdentification Id will be fetch from session after login work, this one goes for future enhancement
    filename = blob_name + '_' + str(year) + '_' + str(month) + '_' + str(userIdentity) + '.csv'
    container_name = "userrecorddb"  # Name of the container where your CSV file is stored
    # reading the actual data
    list = get_json_from_storage_container_csv_file(container_name, filename)
    return list


# -------------------------- main connection code portion start ---------------------------

# Connection string for your Azure Storage Account
connection_string = "DefaultEndpointsProtocol=https;AccountName=visualizationdataset;AccountKey=jPzuNJEDQ4EP0KQZ/eNSbIEQCtRBOLte6a8Dl7ipc9Y/UKuyfjGU189qLjH1qrXr5CtsjkjxPETB+AStTwOAFw==;EndpointSuffix=core.windows.net"


# get_json_from_storage_container_csv_file function will download the blob file i.e csv from cloud storage and
# convert that csv file to json object It takes param container_name which is the container or directory where the

# file has been stored It takes param blob_name which is the filename with extension i.e.csv to download a file from
# server
def get_json_from_storage_container_csv_file(container_name, blob_name):
    my_list = []
    try:
        start_time = time.time()

        # It will download the csv data file from azure server under defined container_name with given blob_name filename
        csv_data = download_blob_from_storage(container_name, blob_name)

        # It will convert the csv_data to json since the whole application will work on json data
        my_list = convert_csv_to_json(csv_data)

        print("get_json_from_storage_container_csv_file --- %s seconds" % (time.time() - start_time))
        return my_list
    except Exception as ex:
        print(f"Error Processing blob: {ex}")
        return my_list


# Create the BlobServiceClient object which will be used to create a container client
blob_service_client = BlobServiceClient.from_connection_string(connection_string)


# download_blob_from_storage function will download the blob file i.e csv from azure storage
# It takes param container_name which is the container or directory where the file has been stored
# It takes param blob_name which is the filename with extension i.e.csv to download a file from server
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

# this function will convert the csv dataset to json object
# this will take csv_data as a param value and return a json list
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

                # this statement check if csv key start with option (i.e. option1, option2, option3) then it will
                # convert that all keys into a list a value with option json key name
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

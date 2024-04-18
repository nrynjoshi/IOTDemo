#  Data Visualization For Home Care
<p float="left">
<span>
The constant and userrecorddb is the container name for the azure cloud storage service.</span>
</p>

# How to configure Azure Cloud Storage Service
1. Create a azure cloud storage service
2. create a storage account
3. create a two container name constant and userrecorddb as shown in the folder
4. Upload all the files from these two folder into the container respectively
5. Go to ./service/azure_blob_call_service.py file and open it
6. Search for connection_string and replace the value with your new connection string generated from azure cloud

# Where to find connection_string in azure storage account service 
You can find your storage account's connection strings in the Azure portal. Navigate to Settings + networking > 
Access keys in your storage account's menu blade to see connection strings for both primary and secondary access keys.

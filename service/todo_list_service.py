import copy

from service import azure_blob_call_service
import re


# TODO-List page api part started

# It will get the todolist which is applicable for all users and there is no restriction on this api,
# this one is just fetch all and provide
def todo_list():
    # this portion will call a azure cloud to get the .csv file from the constant container
    list = azure_blob_call_service.getConstantContainer("Daily_Activities_Records.csv")

    # list to store the updated record to serve as a api response
    update_list = []

    # Define a function to extract times from the string

    for record in list:
        time_string = record['time']
        # time_string has [12:00, 13:00] in string format and this extract_times function will split that one in
        # proper list
        time_list = extract_times(time_string)
        for time in time_list:
            # Copy the JSON object deepcopy will clone the json as it is without reference the old one to make changes
            # separate for new json only
            copied_record = copy.deepcopy(record)
            question = copied_record['question']
            new_question = question.replace('${time}', time)  # replace the ${time} in question string with actual time
            copied_record['question'] = new_question  # update the old question value with new one
            update_list.append(copied_record)  # adding to list
    return update_list


# TODO-List page api part ended

# this function will split the string of time into list format
# time_string has [12:00, 13:00] in string format and this extract_times function will split that one in proper list
def extract_times(input_time_string):
    # Use regular expression to find all time patterns in the string
    times = re.findall(r'\d{2}:\d{2}', input_time_string)
    return times

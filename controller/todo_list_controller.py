import copy

from service import azure_blob_call_service
import re


# TODO-List page api part started

def todo_list():
    list = azure_blob_call_service.getConstantContainer("Daily_Activities_Records.csv")
    update_list = []

    # Define a function to extract times from the string
    def extract_times(input_time_string):
        # Use regular expression to find all time patterns in the string
        times = re.findall(r'\d{2}:\d{2}', input_time_string)
        return times

    for record in list:
        time_string = record['time']

        time_list = extract_times(time_string)
        for time in time_list:
            # Copy the JSON object
            copied_record = copy.deepcopy(record)
            question = copied_record['question']
            new_question = question.replace('${time}', time)
            copied_record['question'] = new_question
            update_list.append(copied_record)
    return update_list

# TODO-List page api part ended

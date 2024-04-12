from service import azure_blob_call_service
from service import cleanup_csv_record
import copy


# TODO-List page api part started

def todo_list():
    list = azure_blob_call_service.getRecordsContainer("Daily_Activities_Records.csv")
    update_list = []
    for record in list:
        time_string = record['time']

        time_list = cleanup_csv_record.extract_times(time_string)
        for time in time_list:
            # Copy the JSON object
            copied_record = copy.deepcopy(record)
            question = copied_record['question']
            new_question = question.replace('${time}', time)
            copied_record['question'] = new_question
            update_list.append(copied_record)
    return update_list

# TODO-List page api part ended

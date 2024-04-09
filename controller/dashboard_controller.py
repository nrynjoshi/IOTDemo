from service import azure_blob_call_service
from service import csv_json_conversion_service


# Dashboard page api started

def current_heart_rate():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['HeartRate'], 'min_value': "80", 'max_value': "100", 'text': "Heart Rate"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_SP02():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]

    data = {'value': latestedUpdatedRecord['BloodOxygenSaturation'], 'min_value': "80", 'max_value': "100",
            'text': "SPO2"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_respiratory_rate():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['RespiratoryRate'], 'min_value': "80", 'max_value': "100",
            'text': "Respiratory Rate"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_temperature():
    list = azure_blob_call_service.getSelfMadeContainerData("hourlyBodyTemperate.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BodyTemperate_F'], 'min_value': "80", 'max_value': "100",
            'text': "Body Temperature"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_blood_pressure():
    list = azure_blob_call_service.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BloodPressure'], 'min_value': "80", 'max_value': "100",
            'text': "Blood Pressure"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_blood_sugar():
    list = azure_blob_call_service.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BloodSugarFasting'], 'min_value': "80", 'max_value': "100",
            'text': "Blood Sugar"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_mental_status():
    data = {'value': "Happy", 'min_value': "80", 'max_value': "100", 'text': "Metal Status"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_sleep_pattern():
    list = azure_blob_call_service.getFitabaseContainerdata("sleepDay_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['TotalMinutesAsleep'], 'min_value': "80", 'max_value': "100",
            'text': "Sleep Minute Time"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data


def current_steps_count():
    list = azure_blob_call_service.getFitabaseContainerdata("dailySteps_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['StepTotal'], 'min_value': "80", 'max_value': "100",
            'text': "Total Steps"}
    json_data = csv_json_conversion_service.dump_to_json(data)
    return json_data

# Dashboard page api part ended

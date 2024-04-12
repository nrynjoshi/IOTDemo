import math  # Import the math module to check for NaN
from datetime import datetime, timedelta

import pandas as pd

from service import azure_blob_call_service
from service import cleanup_csv_record
import time

# Analysis page api part started
def heart_record_analysis():
    list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    estart_time = time.time()
    body_temperature = extract_required_key_value(list, ["ActivityHour", "BodyTemperate"])
    heart_rate = extract_required_key_value(list, ["ActivityHour", "HeartRate"])
    respiratory_rate = extract_required_key_value(list, ["ActivityHour", "RespiratoryRate"])
    total_steps = extract_required_key_value(list, ["ActivityHour", "TotalStepCount"])
    sleep_pattern = extract_required_key_value(list, ["ActivityHour", "TotalMinuteSleep"])
    blood_sugar = extract_required_key_value(list, ["ActivityHour", "BloodSugarFasting"])
    spo2 = extract_required_key_value(list, ["ActivityHour", "BloodOxygenSaturation"])
    print("heart_record_analysis after extract --- %s seconds" % (time.time() - estart_time))

    estart_time = time.time()
    # pre process data for ui diagram


    heart_rate = heart_rate_analysis(heart_rate)
    body_temperature = body_temperature_analysis(body_temperature)
    respiratory_rate = respiratory_rate_analysis(respiratory_rate)
    total_steps = total_steps_analysis(total_steps)
    sleep_pattern = sleep_pattern_analysis(sleep_pattern)
    blood_sugar = blood_sugar_anaysis(blood_sugar)
    spo2 = spo2_analysis(spo2)
    data = {'heart_rate': heart_rate, 'sleep_pattern': sleep_pattern, 'body_temperature': body_temperature,
            'blood_sugar': blood_sugar, 'spo2': spo2, 'respiratory_rate': respiratory_rate, 'total_steps': total_steps}
    print("heart_record_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return data


def extract_required_key_value(data, keys_to_keep):
    # Define the keys you want to keep in the new list

    # Initialize a list to store the dictionaries with selected key-value pairs
    new_list = []

    # Iterate over the original list of dictionaries
    for item in data:
        # Create a new dictionary with only the desired key-value pairs
        new_dict = {key: item[key] for key in keys_to_keep if key in item}
        # Append the new dictionary to the new list
        new_list.append(new_dict)
    # Filter out dictionaries with NaN values
    new_list = [d for d in new_list if not any(math.isnan(v) if isinstance(v, float) else False for v in d.values())]

    return new_list


def cleanupNaNValueFromList(data):
    # Filter out JSON objects with NaN values
    filtered_data = [obj for obj in data if not any(val != val for val in obj.values())]
    return filtered_data


def heart_rate_analysis(list):
    # Get today's date
    today = datetime.today()
    # Calculate the date one week ago
    one_week_ago = today - timedelta(days=7)
    response_list = []
    for x in list:
        date_object = cleanup_csv_record.parse_time(x['ActivityHour'])
        if one_week_ago.month <= date_object.month <= today.month and one_week_ago.day <= date_object.day <= today.day and one_week_ago.year <= date_object.year <= today.year:
            response_list.append(x)

    # Convert timestamp to datetime
    for entry in response_list:
        entry['HeartRate'] = int(entry['HeartRate'])  # Convert value to integer

    # Create DataFrame
    df = pd.DataFrame(response_list)

    df['ActivityHour'] = df['ActivityHour'].apply(cleanup_csv_record.parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['ActivityHour'])
    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour')

    # Initialize start time
    start_time = df.iloc[0]['ActivityHour']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=2)
    while end_time <= df.iloc[-1]['ActivityHour']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour'] >= start_time) & (df['ActivityHour'] < end_time)]
        # Calculate average for this interval
        avg_value = interval_data['HeartRate'].mean()

        # Create JSON object
        json_obj = {'variable': start_time.strftime('%H'), 'value': avg_value, "group": start_time.strftime('%m/%d'), }

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(hours=2)
    json_list = cleanupNaNValueFromList(json_list)
    return json_list


def respiratory_rate_analysis(list):
    # Convert timestamp to datetime
    for entry in list:
        # Get the value of 'TotalMinuteSleep' and handle empty strings
        total_minute_sleep = entry['RespiratoryRate']
        if total_minute_sleep == '' or pd.isna(total_minute_sleep):
            total_minute_sleep = 0
        else:
            total_minute_sleep = int(total_minute_sleep)

        entry['RespiratoryRate'] = total_minute_sleep  # Convert value to integer

    response_list = []

    for x in list:
        date_object = cleanup_csv_record.parse_time(x['ActivityHour'])
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['RespiratoryRate'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    return response_list


def spo2_analysis(list):
    # Convert timestamp to datetime
    for entry in list:
        # Get the value of 'TotalMinuteSleep' and handle empty strings
        total_minute_sleep = entry['BloodOxygenSaturation']
        if total_minute_sleep == '' or pd.isna(total_minute_sleep):
            total_minute_sleep = 0
        else:
            total_minute_sleep = int(total_minute_sleep)

        entry['BloodOxygenSaturation'] = total_minute_sleep  # Convert value to integer

    response_list = []

    for x in list:
        date_object = cleanup_csv_record.parse_time(x['ActivityHour'])
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['BloodOxygenSaturation'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    return response_list


def blood_sugar_anaysis(list):
    # Convert timestamp to datetime
    for entry in list:
        # Get the value of 'TotalMinuteSleep' and handle empty strings
        total_minute_sleep = entry['BloodSugarFasting']
        if total_minute_sleep == '' or pd.isna(total_minute_sleep):
            total_minute_sleep = 0
        else:
            total_minute_sleep = int(total_minute_sleep)

        entry['BloodSugarFasting'] = total_minute_sleep  # Convert value to integer

    # Create DataFrame
    df = pd.DataFrame(list)

    df['ActivityHour'] = df['ActivityHour'].apply(cleanup_csv_record.parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['ActivityHour'])
    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour')

    # Initialize start time
    start_time = df.iloc[0]['ActivityHour']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour'] >= start_time) & (df['ActivityHour'] < end_time)]

        # Calculate average for this interval
        BloodSugarFasting = interval_data['BloodSugarFasting'].mean()

        # Create JSON object
        json_obj = {'x': start_time.strftime('%m/%d/%Y'), 'y': BloodSugarFasting}

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(days=1)
    json_list = cleanupNaNValueFromList(json_list)
    return json_list


def sleep_pattern_analysis(list):
    # Convert timestamp to datetime
    for entry in list:
        # Get the value of 'TotalMinuteSleep' and handle empty strings
        total_minute_sleep = entry['TotalMinuteSleep']
        if total_minute_sleep == '' or pd.isna(total_minute_sleep):
            total_minute_sleep = 0
        else:
            total_minute_sleep = int(total_minute_sleep)

        entry['TotalMinuteSleep'] = total_minute_sleep  # Convert value to integer

    # Create DataFrame
    df = pd.DataFrame(list)

    df['ActivityHour'] = df['ActivityHour'].apply(cleanup_csv_record.parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['ActivityHour'])
    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour')

    # Initialize start time
    start_time = df.iloc[0]['ActivityHour']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour'] >= start_time) & (df['ActivityHour'] < end_time)]

        # Calculate average for this interval
        TotalMinutesAsleep = interval_data['TotalMinuteSleep'].sum()

        stage = ''
        if TotalMinutesAsleep >= 420:
            stage = 'Deep Sleep'
        elif TotalMinutesAsleep >= 330:
            stage = 'Light Sleep'
        elif TotalMinutesAsleep >= 180:
            stage = 'Poor Sleep'
        else:
            stage = 'Awake'

        # Create JSON object
        json_obj = {'timestamp': start_time.strftime('%m/%d/%Y %H:%M'), 'stage': stage}

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(days=1)
    json_list = cleanupNaNValueFromList(json_list)
    return json_list


def body_temperature_analysis(list):
    response_list = []

    for x in list:
        date_object = cleanup_csv_record.parse_time(x['ActivityHour'])
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['BodyTemperate'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    return response_list


def total_steps_analysis(list):
    # Convert timestamp to datetime
    for entry in list:
        # Get the value of 'TotalMinuteSleep' and handle empty strings
        TotalStepCount = entry['TotalStepCount']
        if TotalStepCount == '' or pd.isna(TotalStepCount):
            TotalStepCount = 0
        else:
            TotalStepCount = int(TotalStepCount)

        entry['TotalStepCount'] = TotalStepCount  # Convert value to integer

    # Create DataFrame
    df = pd.DataFrame(list)

    df['ActivityHour'] = df['ActivityHour'].apply(cleanup_csv_record.parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['ActivityHour'])
    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour')

    # Initialize start time
    start_time = df.iloc[0]['ActivityHour']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour'] >= start_time) & (df['ActivityHour'] < end_time)]

        filtered_data = interval_data[interval_data['TotalStepCount'] != 0]
        # Calculate average for this interval
        avg_value = filtered_data['TotalStepCount'].sum()

        # Create JSON object
        json_obj = {'x': start_time.strftime('%m/%d/%Y'), 'y': int(avg_value)}

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(days=1)
    json_list = cleanupNaNValueFromList(json_list)
    return json_list

# Analysis page api part ended

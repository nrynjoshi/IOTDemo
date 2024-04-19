import math  # Import the math module to check for NaN
from datetime import datetime, timedelta

import pandas as pd

from service import azure_blob_call_service
import time


#  page api part started

# This function is the main entry function to gather the hourly health record of specific user for analysis
def health_record_analysis():
    # get a json list for the hourlyHealthRecord blob name
    estart_time = time.time()
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}

    # pre processing record
    list = []
    for entry in db_list:
        entry['HeartRate'] = int(entry['HeartRate'])  # Convert value to integer
        entry['ActivityHour_parsed'] = parse_time(entry['ActivityHour'])  # Convert value to integer

        # Get the value of 'TotalMinuteSleep' and handle empty strings
        TotalStepCount = entry['TotalStepCount']
        if TotalStepCount == '' or pd.isna(TotalStepCount):
            TotalStepCount = 0
        else:
            TotalStepCount = int(TotalStepCount)
        entry['TotalStepCount'] = TotalStepCount  # Convert value to integer

        # Get the value of 'TotalMinuteSleep' and handle empty strings
        RespiratoryRate = entry['RespiratoryRate']
        if RespiratoryRate == '' or pd.isna(RespiratoryRate):
            RespiratoryRate = 0
        else:
            RespiratoryRate = int(RespiratoryRate)

        entry['RespiratoryRate'] = RespiratoryRate  # Convert value to integer

        # Get the value of 'TotalMinuteSleep' and handle empty strings
        BloodOxygenSaturation = entry['BloodOxygenSaturation']
        if BloodOxygenSaturation == '' or pd.isna(BloodOxygenSaturation):
            BloodOxygenSaturation = 0
        else:
            BloodOxygenSaturation = int(BloodOxygenSaturation)

        entry['BloodOxygenSaturation'] = BloodOxygenSaturation  # Convert value to integer

        # Get the value of 'TotalMinuteSleep' and handle empty strings
        BloodSugarFasting = entry['BloodSugarFasting']
        if BloodSugarFasting == '' or pd.isna(BloodSugarFasting):
            BloodSugarFasting = 0
        else:
            BloodSugarFasting = int(BloodSugarFasting)

        entry['BloodSugarFasting'] = BloodSugarFasting  # Convert value to integer

        # Get the value of 'TotalMinuteSleep' and handle empty strings
        TotalMinuteSleep = entry['TotalMinuteSleep']
        if TotalMinuteSleep == '' or pd.isna(TotalMinuteSleep):
            TotalMinuteSleep = 0
        else:
            TotalMinuteSleep = int(TotalMinuteSleep)

        entry['TotalMinuteSleep'] = TotalMinuteSleep  # Convert value to integer

        if entry['ActivityHour_parsed']:  # Remove rows with NaT (empty strings)
            list.append(entry)

    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    # this below statement will parse the different health parameter list as per required data for visualization
    heart_rate = heart_rate_analysis(df)
    body_temperature = body_temperature_analysis(list)
    respiratory_rate = respiratory_rate_analysis(list)
    total_steps = total_steps_analysis(df)
    sleep_pattern = sleep_pattern_analysis(df)
    blood_sugar = blood_sugar_anaysis(df)
    spo2 = spo2_analysis(list)

    # preparing the json object for response
    data = {'heart_rate': heart_rate, 'sleep_pattern': sleep_pattern, 'body_temperature': body_temperature,
            'blood_sugar': blood_sugar, 'spo2': spo2, 'respiratory_rate': respiratory_rate, 'total_steps': total_steps}
    print("health_record_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return data


# this will extract the defined json key value as a new list by eliminating rest of the json key value to make the
# json lite and more simplified
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


# this will help to clean all NaN value from list so that the process function will receive the clean list and
# consitent
def cleanupNaNValueFromList(data):
    # Filter out JSON objects with NaN values
    filtered_data = [obj for obj in data if not any(val != val for val in obj.values())]
    return filtered_data


def heart_rate_analysis(df):
    estart_time = time.time()
    # Initialize start time
    start_time = df.iloc[0]['ActivityHour_parsed']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=2)
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] < end_time)]
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
    print("heart_rate_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


def respiratory_rate_analysis(list):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['RespiratoryRate'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    print("respiratory_rate_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return response_list


def spo2_analysis(list):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['BloodOxygenSaturation'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    print("spo2_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return response_list


def blood_sugar_anaysis(df):
    estart_time = time.time()
    # Initialize start time
    start_time = df.iloc[0]['ActivityHour_parsed']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] < end_time)]

        # Calculate average for this interval
        BloodSugarFasting = interval_data['BloodSugarFasting'].mean()

        # Create JSON object
        json_obj = {'x': start_time.strftime('%m/%d/%Y'), 'y': BloodSugarFasting}

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 1-day interval
        start_time = end_time
        end_time += pd.Timedelta(days=1)
    json_list = cleanupNaNValueFromList(json_list)
    print("blood_sugar_anaysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


def sleep_pattern_analysis(df):
    estart_time = time.time()
    # Initialize start time
    start_time = df.iloc[0]['ActivityHour_parsed']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] < end_time)]

        # Calculate average for this interval
        TotalMinutesAsleep = interval_data['TotalMinuteSleep'].sum()

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
    print("sleep_pattern_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


def body_temperature_analysis(list):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['BodyTemperate'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    print("body_temperature_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return response_list


def total_steps_analysis(df):
    estart_time = time.time()
    # Initialize start time
    start_time = df.iloc[0]['ActivityHour_parsed']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(days=1)
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] < end_time)]

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
    print("total_steps_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


# Analysis page api part ended

# this function will parse the json datetime string to datetime object for processing with timestamp
def parse_time(time_str):
    if time_str.strip():  # Check if the string is not empty
        try:
            return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M')
        except ValueError:
            return pd.NaT  # Return NaT (Not a Time) for empty strings
    else:
        return pd.NaT  # Return NaT (Not a Time) for empty strings

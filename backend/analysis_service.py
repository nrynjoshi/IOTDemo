import math  # Import the math module to check for NaN
from datetime import datetime, timedelta

import pandas as pd

from backend import azure_blob_call_service
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
    list = clean_record_and_preprocess(db_list, None, None)

    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    # this below statement will parse the different health parameter list as per required data for visualization
    currentdate = datetime.now()
    heart_rate = heart_rate_analysis(df, 2)
    body_temperature = body_temperature_analysis(list, currentdate)
    respiratory_rate = respiratory_rate_analysis(list, currentdate)
    total_steps = total_steps_analysis(df)
    sleep_pattern = sleep_pattern_analysis(df)
    blood_sugar = blood_sugar_anaysis(df)
    spo2 = spo2_analysis(list, currentdate)

    # preparing the json object for response
    data = {'heart_rate': heart_rate, 'sleep_pattern': sleep_pattern, 'body_temperature': body_temperature,
            'blood_sugar': blood_sugar, 'spo2': spo2, 'respiratory_rate': respiratory_rate, 'total_steps': total_steps}
    print("health_record_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return data


def heart_rate_analysis_with_filter(start_date_string, end_date_string, hourly_interval):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(start_date_string)
    end_date = parse_user_input_date(end_date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, end_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}
    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    heart_rate = heart_rate_analysis(df, int(hourly_interval))
    return heart_rate


def sleep_pattern_analysis_with_filter(start_date_string, end_date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(start_date_string)
    end_date = parse_user_input_date(end_date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, end_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}
    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    sleep_pattern = sleep_pattern_analysis(df)
    return sleep_pattern



def blood_sugar_analysis_with_filter(start_date_string, end_date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(start_date_string)
    end_date = parse_user_input_date(end_date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, end_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}
    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    sleep_pattern = blood_sugar_anaysis(df)
    return sleep_pattern


def steps_counts_analysis_with_filter(start_date_string, end_date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(start_date_string)
    end_date = parse_user_input_date(end_date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, end_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}
    # Create DataFrame
    df = pd.DataFrame(list)

    # Sort data by timestamp
    df = df.sort_values(by='ActivityHour_parsed')

    sleep_pattern = total_steps_analysis(df)
    return sleep_pattern


def respiratory_analysis_with_filter(date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, start_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}

    sleep_pattern = respiratory_rate_analysis(list, start_date)
    return sleep_pattern

def spo2_analysis_with_filter(date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, start_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}

    sleep_pattern = spo2_analysis(list, start_date)
    return sleep_pattern


def body_temp_analysis_with_filter(date_string):
    db_list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(db_list) == 0:
        return {'status': 'error', 'message': ''}
    start_date = parse_user_input_date(date_string)

    # pre processing record
    list = clean_record_and_preprocess(db_list, start_date, start_date)
    if len(list) == 0:
        return {'status': 'error', 'message': 'No Result found'}

    sleep_pattern = body_temperature_analysis(list, start_date)
    return sleep_pattern

def clean_record_and_preprocess(db_list, start_date, end_date):
    list = []
    for entry in db_list:
        entry['ActivityHour_parsed'] = parse_time(entry['ActivityHour'])  # Convert value to integer

        if (end_date is None and start_date is None) or (start_date.date() <= entry['ActivityHour_parsed'].date() <= end_date.date()):
            entry['HeartRate'] = int(entry['HeartRate'])  # Convert value to integer

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
    return list


# this will help to clean all NaN value from list so that the process function will receive the clean list and
# consitent
def cleanupNaNValueFromList(data):
    # Filter out JSON objects with NaN values
    filtered_data = [obj for obj in data if not any(val != val for val in obj.values())]
    return filtered_data


def heart_rate_analysis(df, hourly_interval):
    estart_time = time.time()
    # Initialize start time
    start_time = df.iloc[0]['ActivityHour_parsed']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=hourly_interval)
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] <= end_time)]
        # Calculate average for this interval
        avg_value = interval_data['HeartRate'].mean()

        # Create JSON object
        json_obj = {'variable': start_time.strftime('%H'), 'value': avg_value, "group": start_time.strftime('%m/%d'), }

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(hours=hourly_interval)
    json_list = cleanupNaNValueFromList(json_list)
    print("heart_rate_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


def respiratory_rate_analysis(list, date):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:

            if date_object.month == date.month and date_object.year == date.year and date_object.day == date.day:
                data = {'timestamp': x['ActivityHour'], 'spo2': int(x['RespiratoryRate'])}
                response_list.append(data)
    response_list = cleanupNaNValueFromList(response_list)
    print("respiratory_rate_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return response_list


def spo2_analysis(list, date):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:

            if date_object.month == date.month and date_object.year == date.year and date_object.day == date.day:
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
    end_time = start_time
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] <= end_time)]

        # Calculate average for this interval
        BloodSugarFasting = interval_data['BloodSugarFasting'].mean()

        # Create JSON object
        json_obj = {'x': end_time.strftime('%m/%d/%Y'), 'y': BloodSugarFasting}

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
    end_time = start_time
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
        json_obj = {'timestamp': end_time.strftime('%m/%d/%Y %H:%M'), 'stage': stage}

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(days=1)
    json_list = cleanupNaNValueFromList(json_list)
    print("sleep_pattern_analysis after preparing data --- %s seconds" % (time.time() - estart_time))
    return json_list


def body_temperature_analysis(list, date):
    estart_time = time.time()
    response_list = []

    for x in list:
        date_object = x['ActivityHour_parsed']
        if date_object:
            if date.month == date.month and date_object.year == date.year and date_object.day == date.day:
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
    end_time = start_time
    while end_time <= df.iloc[-1]['ActivityHour_parsed']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['ActivityHour_parsed'] >= start_time) & (df['ActivityHour_parsed'] <= end_time)]

        filtered_data = interval_data[interval_data['TotalStepCount'] != 0]
        # Calculate average for this interval
        avg_value = filtered_data['TotalStepCount'].sum()

        # Create JSON object
        json_obj = {'x': end_time.strftime('%m/%d/%Y'), 'y': int(avg_value)}

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


def parse_user_input_date(time_str):
    if time_str.strip():  # Check if the string is not empty
        try:
            return pd.to_datetime(time_str, format='%Y-%m-%d')
        except ValueError:
            return pd.NaT  # Return NaT (Not a Time) for empty strings
    else:
        return pd.NaT  # Return NaT (Not a Time) for empty strings

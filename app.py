from flask import Flask, send_from_directory

import azure_blob_util
import csv_json_util
import decision_tree
import file_util
import pandas as pd
from datetime import datetime, timedelta

from flask_cors import CORS

# CORS access given to all request call from defined url
app = Flask(__name__, static_url_path='/')
cors = CORS(app, origins=["http://localhost:3000", "https://elderdatavisualization.azurewebsites.net"])


# Controller for index page which will display all compiled version of reactjs from python application after build
@app.route('/')
def index_page():
    return app.send_static_file('index.html')  # Return index.html from the static folder


# Dashboard page api started

@app.route('/api/current/heart-rate')
def current_heart_rate():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['HeartRate'], 'min_value': "80", 'max_value': "100", 'text': "Heart Rate"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/SPO2')
def current_SP02():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]

    data = {'value': latestedUpdatedRecord['BloodOxygenSaturation'], 'min_value': "80", 'max_value': "100",
            'text': "SPO2"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/respiratory-rate')
def current_respiratory_rate():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['RespiratoryRate'], 'min_value': "80", 'max_value': "100",
            'text': "Respiratory Rate"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/body-temperature')
def current_temperature():
    list = azure_blob_util.getSelfMadeContainerData("hourlyBodyTemperate.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BodyTemperate_F'], 'min_value': "80", 'max_value': "100",
            'text': "Body Temperature"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/blood-pressure')
def current_blood_pressure():
    list = azure_blob_util.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BloodPressure'], 'min_value': "80", 'max_value': "100",
            'text': "Blood Pressure"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/blood-sugar')
def current_blood_sugar():
    list = azure_blob_util.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['BloodSugarFasting'], 'min_value': "80", 'max_value': "100",
            'text': "Blood Sugar"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/mental-status')
def current_mental_status():
    data = {'value': "Happy", 'min_value': "80", 'max_value': "100", 'text': "Metal Status"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/sleep-pattern')
def current_sleep_pattern():
    list = azure_blob_util.getFitabaseContainerdata("sleepDay_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['TotalMinutesAsleep'], 'min_value': "80", 'max_value': "100",
            'text': "Sleep Minute Time"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/api/current/steps')
def current_steps_count():
    list = azure_blob_util.getFitabaseContainerdata("dailySteps_merged.csv")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    data = {'value': latestedUpdatedRecord['StepTotal'], 'min_value': "80", 'max_value': "100",
            'text': "Total Steps"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


# Dashboard page api part ended

# TODO-List page api part started
@app.route('/api/todo-list')
def todo_list():
    list = azure_blob_util.getRecordsContainer("Daily_Activities_Records.csv")
    return list


# TODO-List page api part ended

# Analysis page api part started

@app.route('/api/report/heart-rate-analysis')
def heart_rate_analysis():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    print('fetch successfully from azure')

    def parse_time(time_str):
        if time_str.strip():  # Check if the string is not empty
            try:
                return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M:%S')
            except ValueError:
                try:
                    return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M:%S %p')
                except ValueError:
                    try:
                        return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M %p')
                    except ValueError:
                        return pd.NaT  # Return NaT (Not a Time) for empty strings
        else:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    # Get today's date
    today = datetime.today()
    # Calculate the date one week ago
    one_week_ago = today - timedelta(days=7)
    response_list = []
    for x in list:
        date_object = parse_time(x['Time'])
        if one_week_ago.month <= date_object.month <= today.month and one_week_ago.day <= date_object.day <= today.day and one_week_ago.year <= date_object.year <= today.year:
            response_list.append(x)

    # Convert timestamp to datetime
    for entry in list:
        entry['HeartRate'] = int(entry['HeartRate'])  # Convert value to integer

    # Create DataFrame
    df = pd.DataFrame(list)

    df['Time'] = df['Time'].apply(parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['Time'])
    # Sort data by timestamp
    df = df.sort_values(by='Time')

    # Initialize start time
    start_time = df.iloc[0]['Time']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=2)
    while end_time <= df.iloc[-1]['Time']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['Time'] >= start_time) & (df['Time'] < end_time)]
        # Calculate average for this interval
        avg_value = interval_data['HeartRate'].mean()

        # Create JSON object
        json_obj = {
            'variable': start_time.strftime('%H'),
            'value': avg_value,
            "group": start_time.strftime('%m/%d'),
        }

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(hours=2)

    return json_list


@app.route('/api/report/respiratory-rate-analysis')
def respiratory_rate_analysis():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")
    print('fetch successfully from azure')

    # Convert timestamp to datetime
    for entry in list:
        entry['RespiratoryRate'] = int(entry['RespiratoryRate'])  # Convert value to integer

    def parse_time(time_str):
        if time_str.strip():  # Check if the string is not empty
            try:
                return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M:%S')
            except ValueError:
                try:
                    return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M:%S %p')
                except ValueError:
                    try:
                        return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M %p')
                    except ValueError:
                        return pd.NaT  # Return NaT (Not a Time) for empty strings
        else:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    # Create DataFrame
    df = pd.DataFrame(list)

    df['Time'] = df['Time'].apply(parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['Time'])
    # Sort data by timestamp
    df = df.sort_values(by='Time')

    # Initialize start time
    start_time = df.iloc[0]['Time']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=1)
    while end_time <= df.iloc[-1]['Time']:
        # Select data within the current 2-hour interval

        interval_data = df[(df['Time'] >= start_time) & (df['Time'] < end_time)]

        # Calculate average for this interval
        avg_value = interval_data['RespiratoryRate'].mean()

        # Create JSON object
        json_obj = {
            'timestamp': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'spo2': avg_value
        }

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(hours=1)

    return json_list


@app.route('/api/report/spo2-analysis')
def spo2_analysis():
    list = azure_blob_util.getSelfMadeContainerData("healthparam__seconds_merged.csv")

    # Convert timestamp to datetime
    for entry in list:
        entry['BloodOxygenSaturation'] = int(entry['BloodOxygenSaturation'])  # Convert value to integer

    def parse_time(time_str):
        if time_str.strip():  # Check if the string is not empty
            try:
                return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M:%S')
            except ValueError:
                try:
                    return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M:%S %p')
                except ValueError:
                    try:
                        return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M %p')
                    except ValueError:
                        return pd.NaT  # Return NaT (Not a Time) for empty strings
        else:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    # Create DataFrame
    df = pd.DataFrame(list)

    df['Time'] = df['Time'].apply(parse_time)
    # Remove rows with NaT (empty strings)
    df = df.dropna(subset=['Time'])
    # Sort data by timestamp
    df = df.sort_values(by='Time')

    # Initialize start time
    start_time = df.iloc[0]['Time']

    # Initialize a list to store JSON values
    json_list = []

    # Iterate over sorted data
    end_time = start_time + pd.Timedelta(hours=1)
    while end_time <= df.iloc[-1]['Time']:
        # Select data within the current 2-hour interval
        interval_data = df[(df['Time'] >= start_time) & (df['Time'] < end_time)]

        # Calculate average for this interval
        avg_value = interval_data['BloodOxygenSaturation'].mean()

        # Create JSON object
        json_obj = {
            'timestamp': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'spo2': avg_value
        }

        # Append JSON object to list
        json_list.append(json_obj)

        # Move to the next 2-hour interval
        start_time = end_time
        end_time += pd.Timedelta(hours=1)

    return json_list


@app.route('/api/report/blood-sugar-analysis')
def blood_sugar_anaysis():
    list = azure_blob_util.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    response_list = []
    for x in list:
        date_object = datetime.strptime(x['ActivityDay'], '%m/%d/%Y')

        current_date = datetime.now()  # Get the current date

        if date_object.month == current_date.month and date_object.year == current_date.year:
            data = {'x': x['ActivityDay'], 'y': x['BloodSugarFasting']}
            response_list.append(data)

    return response_list


@app.route('/api/report/sleep-pattern-analysis')
def sleep_pattern_analysis():
    list = azure_blob_util.getFitabaseContainerdata("sleepDay_merged.csv")

    def parse_time(time_str):
        if time_str.strip():  # Check if the string is not empty
            try:
                return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M:%S')
            except ValueError:
                try:
                    return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M:%S %p')
                except ValueError:
                    try:
                        return pd.to_datetime(time_str, format='%m/%d/%Y %I:%M %p')
                    except ValueError:
                        return pd.NaT  # Return NaT (Not a Time) for empty strings
        else:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    response_list = []
    for x in list:
        date_object = parse_time(x['SleepDay'])

        current_date = datetime.now()  # Get the current date

        if date_object.month == current_date.month and date_object.year == current_date.year:
            # making rules for different sleep pattern i.e Awake,Light sleep, Deep sleep, REM sleep
            TotalSleepRecords = int(x['TotalSleepRecords'])
            TotalMinutesAsleep = int(x['TotalMinutesAsleep'])
            TotalTimeInBed = int(x['TotalTimeInBed'])
            stage = ''
            if TotalSleepRecords <= 2 and TotalMinutesAsleep >= 420 and TotalTimeInBed >= 425:
                stage = 'Deep Sleep'
            elif TotalSleepRecords <= 2 and TotalMinutesAsleep >= 330 and TotalTimeInBed >= 340:
                stage = 'Light Sleep'
            elif TotalMinutesAsleep >= 180:
                stage = 'Poor Sleep'
            else:
                stage = 'Awake'

            data = {'timestamp': x['SleepDay'], 'stage': stage}
            response_list.append(data)

    return response_list


@app.route('/api/report/body-temperature-analysis')
def body_temperature_analysis():
    list = azure_blob_util.getSelfMadeContainerData("hourlyBodyTemperate.csv")
    response_list = []

    def parse_time(time_str):
        if time_str.strip():  # Check if the string is not empty
            try:
                return datetime.strptime(time_str, '%m/%d/%Y %H:%M:%S')
            except ValueError:
                try:
                    return datetime.strptime(time_str, '%m/%d/%Y %I:%M:%S %p')
                except ValueError:
                    try:
                        return datetime.strptime(time_str, '%m/%d/%Y %I:%M %p')
                    except ValueError:
                        try:
                            return datetime.strptime(time_str, '%m/%d/%Y %I:%M')
                        except ValueError:
                            return None  # Return NaT (Not a Time) for empty strings
        else:
            return None  # Return NaT (Not a Time) for empty strings

    for x in list:
        date_object = parse_time(x['ActivityHour'])
        if date_object:
            current_date = datetime.now()  # Get the current date

            if date_object.month == current_date.month and date_object.year == current_date.year and date_object.day == current_date.day:
                dateTime = str(date_object.year) + '-' + str(date_object.month) + '-' + str(
                    date_object.day) + ' ' + str(
                    date_object.hour) + ':00:00'
                data = {'timestamp': dateTime, 'spo2': int(x['BodyTemperate_F'])}
                response_list.append(data)

    return response_list


@app.route('/api/report/total-steps-analysis')
def total_steps_analysis():
    list = azure_blob_util.getFitabaseContainerdata("dailySteps_merged.csv")
    response_list = []
    for x in list:
        date_object = datetime.strptime(x['ActivityDay'], '%m/%d/%Y')

        current_date = datetime.now()  # Get the current date

        if date_object.month == current_date.month and date_object.year == current_date.year:
            data = {'x': x['ActivityDay'], 'y': x['StepTotal']}
            response_list.append(data)

    return response_list


# Analysis page api part ended

# Activities page api part started
@app.route('/api/energy')
def energy_json():
    response = file_util.read_json_file(r'.\data\energy.json')
    return response


@app.route('/api/force-directed-graph')
def force_directed_graph():
    response = file_util.read_json_file(r'.\data\force-directed-graph.json')

    return response



@app.route('/api/parallel-coordinate-cars')
def parallel_coordinate_cars():
    response = file_util.read_json_file(r'.\data\parallel-coordinate-cars.json')
    return response


@app.route('/api/parallel-coordinate-keys')
def parallel_coordinate_keys():
    response = file_util.read_json_file(r'.\data\parallel-coordinate-keys.json')

    return response


@app.route('/api/activity-tracks')
def activity_tracks():
    response = file_util.read_json_file(r'.\data\activity-tracks.json')


    return response


# Activities page api part ended

# Emergency page api part started

@app.route('/api/emergency-contacts')
def emergency_contacts():
    list = azure_blob_util.getRecordsContainer("Emergency Contact List.csv")
    return list


@app.route('/api/decision_tree')
def decision_tree_engine():
    data = decision_tree.process('no', 'yes', 'yes', 'no', 25, 'yes', 'normal', 'normal')

    return csv_json_util.dump_to_json(data)


# Emergency page api part ended


# Python application entry point for running application
if __name__ == '__main__':
    app.run()

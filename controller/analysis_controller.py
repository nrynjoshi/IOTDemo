import pandas as pd
from datetime import datetime, timedelta
from service import azure_blob_call_service


# Analysis page api part started

def heart_rate_analysis():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")
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


def respiratory_rate_analysis():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")
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


def spo2_analysis():
    list = azure_blob_call_service.getSelfMadeContainerData("healthparam__seconds_merged.csv")

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


def blood_sugar_anaysis():
    list = azure_blob_call_service.getSelfMadeContainerData("dailyBloodSugarAndPressure.csv")
    response_list = []
    for x in list:
        date_object = datetime.strptime(x['ActivityDay'], '%m/%d/%Y')

        current_date = datetime.now()  # Get the current date

        if date_object.month == current_date.month and date_object.year == current_date.year:
            data = {'x': x['ActivityDay'], 'y': x['BloodSugarFasting']}
            response_list.append(data)

    return response_list


def sleep_pattern_analysis():
    list = azure_blob_call_service.getFitabaseContainerdata("sleepDay_merged.csv")

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


def body_temperature_analysis():
    list = azure_blob_call_service.getSelfMadeContainerData("hourlyBodyTemperate.csv")
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


def total_steps_analysis():
    list = azure_blob_call_service.getFitabaseContainerdata("dailySteps_merged.csv")
    response_list = []
    for x in list:
        date_object = datetime.strptime(x['ActivityDay'], '%m/%d/%Y')

        current_date = datetime.now()  # Get the current date

        if date_object.month == current_date.month and date_object.year == current_date.year:
            data = {'x': x['ActivityDay'], 'y': x['StepTotal']}
            response_list.append(data)

    return response_list

# Analysis page api part ended

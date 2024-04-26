# Activities page api part started
from backend import azure_blob_call_service, decision_tree_ml_service
from datetime import datetime
import pandas as pd
import copy
import re


def activity_tracks():
    list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")

    # To finding Disease  using Symptoms
    userInfo = azure_blob_call_service.getUserBasicInfoByIdentity()
    age = calculate_age(userInfo['DateOfBirth'])
    gender = userInfo['Gender']

    filter_list = []
    for x in list:
        date_object = parse_time(x['ActivityHour'])
        if date_object:
            current_date = datetime.now()  # Get the current date
            if date_object.day == current_date.day:
                copied_json = copy.deepcopy(x)
                copied_json['ActivityHour'] = date_object
                filter_list.append(copied_json)
    filter_list = cleanupNaNValueFromList(filter_list)

    rules = prepareRules()
    links = []
    for x in filter_list:
        date_object = x['ActivityHour']
        prepareLinks(links, date_object, x['BodyTemperate'], rules['body_temperature'], 'Body Temperature')
        prepareLinks(links, date_object, x['Coughing'], None, 'Coughing')
        prepareLinks(links, date_object, x['BloodOxygenSaturation'], rules['difficulty_breathing'],
                     'Difficulty Breathing')
        prepareLinks(links, date_object, x['BloodPressure_mmHg'], rules['blood_pressure'], 'Blood Pressure')
        prepareLinks(links, date_object, x['CholesterolLevel'], None, 'Cholesterol Level')

        #     ML logic
        has_fever = convert_to_level(x['BodyTemperate'], rules['body_temperature'])
        has_cough = convert_to_level(x['Coughing'], None)
        has_fatigue = 'no'  # right no, there is no tracking of fatigue so consider as no value
        has_difficulty_breathing = convert_to_level(x['BloodOxygenSaturation'], rules['difficulty_breathing'])
        blood_pressure_level = convert_to_level(x['BloodPressure_mmHg'], rules['blood_pressure'])
        cholesterol_level = convert_to_level(x['CholesterolLevel'], None)
        ml_process_outcome = decision_tree_ml_service.process(has_fever, has_cough, has_fatigue,
                                                              has_difficulty_breathing, age,
                                                              gender, blood_pressure_level,
                                                              cholesterol_level)

        print("ActivityHour: ", date_object)
        outcome_mapping_sources = ['Body Temperature' + ' ' + str(has_fever), 'Coughing' + ' ' + str(has_cough),
                                   'Difficulty Breathing' + ' ' + str(has_difficulty_breathing),
                                   'Blood Pressure' + ' ' + str(blood_pressure_level),
                                   'Cholesterol Level' + ' ' + str(cholesterol_level)]
        for ml_outcome in ml_process_outcome:
            target_for_ml_process_outcome = ml_outcome['disease'] + '( ' + ml_outcome['outcome'] + ')'
            for outcome in outcome_mapping_sources:
                data = {
                    "source": outcome,
                    "target": target_for_ml_process_outcome,
                    "value": 15
                }
                links.append(data)

    nodes = []
    for x in links:
        if x not in nodes:
            source_node = {
                "name": x['source'],
                "category": x['source']
            }
            nodes.append(source_node)
        if x not in nodes:
            category = re.sub(r"[^a-zA-Z0-9]+", ' ',x['target'] )
            # if(x.get("category")):
            #     category = x['category']

            source_node = {
                "name": x['target'],
                "category": category
            }
            nodes.append(source_node)

    unique_values = set((d["name"], d["category"]) for d in nodes)
    nodes = [{"name": name, "category": category} for name, category in unique_values]

    responseBody = {

        "nodes": nodes,
        "links": links
    }

    return responseBody


# Activities page api part ended

def prepareRules():
    return {
        'body_temperature': {
            'min': 97.8,
            'max': 99.1
        },
        'difficulty_breathing': {
            'min': 95,
            'max': 100
        },
        'blood_pressure': {
            'min': '90/60',
            'max': '120/80'
        },
    }


def prepareLinks(links, date_object, actualValue, rules, target):
    evaluate(links, date_object, actualValue, rules, 4, 7, 'Early Morning', target)
    evaluate(links, date_object, actualValue, rules, 7, 12, 'Morning', target)
    evaluate(links, date_object, actualValue, rules, 12, 17, 'Afternoon', target)
    evaluate(links, date_object, actualValue, rules, 17, 20, 'Evening', target)
    evaluate(links, date_object, actualValue, rules, 20, 00, 'Night', target)
    evaluate(links, date_object, actualValue, rules, 00, 4, 'Late Night', target)


def evaluate(links, date_object, actualValue, rules, startingHourInclusive, endingHourExclusive, source, target):
    if startingHourInclusive <= date_object.hour < endingHourExclusive:
        result = convert_to_level(actualValue, rules)
        if not actualValue.isdigit():
            actualValue = 10  # if any boolean type value then set 10 to that type of value

        data = {
            "source": source,
            "target": target + ' ' + str(result),
            "value": actualValue
        }
        links.append(data)


def convert_to_level(value, ruleJson):
    if value.isdigit():
        min = ruleJson['min']
        max = ruleJson['max']
        if float(value) < min:
            return 'Less'  # less than required
        elif float(value) > max:
            return 'High'  # more than required
        else:
            return 'Normal'  # normal
    else:
        if value.__contains__('/'):
            # Split the blood pressure reading into systolic and diastolic values
            systolicInput, diastolicInput = map(int, value.split('/'))

            min = ruleJson['min']
            max = ruleJson['max']
            systolicMin, diastolicMin = map(int, min.split('/'))
            systolicMax, diastolicMax = map(int, max.split('/'))
            if systolicInput < systolicMin or diastolicInput < diastolicMin:
                return 'Less'
            elif systolicInput > systolicMax or diastolicInput > systolicMax:
                return 'High'
            else:
                return 'Normal'

        elif value == 'normal':
            return 'Normal'
        elif value == 'high':
            return 'High'
        elif value == 'low':
            return 'Low'
        elif checkIfBooleanTrueValue(value):
            return 'Yes'
        else:
            return 'No'


def checkIfBooleanTrueValue(value):
    return value.lower() in ('yes', 'true', 't', 'y', '1', 'male')


def parse_time(time_str):
    if time_str.strip():  # Check if the string is not empty
        try:
            return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M')
        except ValueError:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    else:
        return pd.NaT  # Return NaT (Not a Time) for empty strings


def cleanupNaNValueFromList(data):
    # Filter out JSON objects with NaN values
    filtered_data = [obj for obj in data if not any(val != val for val in obj.values())]
    return filtered_data


def calculate_age(date_of_birth):
    # Parse the date string into a datetime object
    dob = datetime.strptime(date_of_birth, "%m/%d/%Y")

    # Get the current date
    current_date = datetime.now()

    # Calculate the difference between the current date and the date of birth
    age = current_date.year - dob.year - ((current_date.month, current_date.day) < (dob.month, dob.day))

    return age



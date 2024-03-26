from flask import Flask

import azure_blob_util
import csv_json_util
import file_util
from flask_cors import CORS

app = Flask(__name__, static_url_path='')
cors = CORS(app, origins=["http://localhost:3000"])


@app.route('/energy')
def energy_json():
    response = file_util.read_json_file(r'.\data\energy.json')
    return response


@app.route('/force-directed-graph')
def force_directed_graph():
    response = file_util.read_json_file(r'.\data\force-directed-graph.json')
    return response


@app.route('/mobile-patent-suits')
def mobile_patent_suits():
    response = file_util.read_json_file(r'.\data\mobile-patent-suits.json')
    return response


@app.route('/parallel-coordinate-cars')
def parallel_coordinate_cars():
    response = file_util.read_json_file(r'.\data\parallel-coordinate-cars.json')
    return response


@app.route('/parallel-coordinate-keys')
def parallel_coordinate_keys():
    response = file_util.read_json_file(r'.\data\parallel-coordinate-keys.json')
    return response


@app.route('/todo-list')
def todo_list():
    list = azure_blob_util.getRecords("Daily_Activities_Records.csv")
    return list


@app.route('/')
def index_page():
    return app.send_static_file('index.html')  # Return index.html from the static folder


@app.route('/current/heart-rate')
def current_heart_rate():
    data = {'value': "98", 'min_value': "80", 'max_value': "100", 'text': "Heart Rate"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/SPO2')
def current_SP02():
    data = {'value': "98", 'min_value': "80", 'max_value': "100", 'text': "SPO2"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/respiratory-rate')
def current_respiratory_rate():
    data = {'value': "12", 'min_value': "80", 'max_value': "100", 'text': "Respiratory Rate"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/body-temperature')
def current_temperature():
    data = {'value': "99.1", 'min_value': "80", 'max_value': "100", 'text': "Body Temperature"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/blood-pressure')
def current_blood_pressure():
    data = {'value': "90/60", 'min_value': "80", 'max_value': "100", 'text': "Blood Pressure"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/blood-sugar')
def current_blood_sugar():
    data = {'value': "95", 'min_value': "80", 'max_value': "100", 'text': "Blood Sugar"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/mental-status')
def current_mental_status():
    data = {'value': "Happy", 'min_value': "80", 'max_value': "100", 'text': "Metal Status"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/sleep-pattern')
def current_sleep_pattern():
    data = {'value': "6 hrs 8min", 'min_value': "80", 'max_value': "100", 'text': "Sleep Pattern"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/current/steps')
def current_steps_count():
    data = {'value': "8000", 'min_value': "80", 'max_value': "100", 'text': "Steps"}
    json_data = csv_json_util.dump_to_json(data)
    return json_data


@app.route('/emergency-contacts')
def emergency_contacts():
    list = azure_blob_util.getRecords("Emergency Contact List.csv")
    return list


@app.route('/activity-tracks')
def activity_tracks():
    response = file_util.read_json_file(r'.\data\activity-tracks.json')
    return response


if __name__ == '__main__':
    app.run()

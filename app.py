from flask import Flask

import file_util
from flask_cors import CORS

app = Flask(__name__, static_url_path='')
cors = CORS(app, origins=["http://localhost:3000"])

@app.route('/energy')
def energy_json():
    response = file_util.read_file(r'.\data\energy.json')
    return response


@app.route('/force-directed-graph')
def force_directed_graph():
    response = file_util.read_file(r'.\data\force-directed-graph.json')
    return response


@app.route('/mobile-patent-suits')
def mobile_patent_suits():
    response = file_util.read_file(r'.\data\mobile-patent-suits.json')
    return response


@app.route('/parallel-coordinate-cars')
def parallel_coordinate_cars():
    response = file_util.read_file(r'.\data\parallel-coordinate-cars.json')
    return response


@app.route('/parallel-coordinate-keys')
def parallel_coordinate_keys():
    response = file_util.read_file(r'.\data\parallel-coordinate-keys.json')
    return response

@app.route('/todo-list')
def todo_list():
    response = file_util.read_file(r'.\data\todo-list.json')
    return response

@app.route('/')
def index_page():
    return app.send_static_file('index.html')  # Return index.html from the static folder

@app.route('/current-heart-rate')
def current_heart_rate():
    return "{ \"value\": \" + 80 + \"}"

@app.route('/emergency-contacts')
def emergency_contacts():
    response = file_util.read_file(r'.\data\emergency-contacts.json')
    return response

@app.route('/activity-tracks')
def activity_tracks():
    response = file_util.read_file(r'.\data\activity-tracks.json')
    return response


if __name__ == '__main__':
    app.run()

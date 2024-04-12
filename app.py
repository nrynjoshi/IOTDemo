from flask import Flask, request

import controller.todo_list_controller as todo_list_controller
import controller.activity_track_controller as activity_track_controller
import controller.analysis_controller as analysis_controller
import controller.emergency_contact_controller as emergency_contact_controller
import controller.machine_learning_controller as machine_learning_controller

from service import azure_blob_call_service
from service import csv_json_conversion_service

from flask_cors import CORS

# ------------------------------------------------------------------------

# CORS access given to all request call from defined url
app = Flask(__name__, static_url_path='/')
cors = CORS(app, origins=["http://localhost:3000", "https://elderdatavisualization.azurewebsites.net"])


# ------------------------------------------------------------------------

# Controller for index page which will display all compiled version of reactjs from python application after build
@app.route('/', methods=['GET'], )
def index_page():
    return app.send_static_file('index.html')  # Return index.html from the static folder


# ------------------------------------------------------------------------
# Dashboard page api started
@app.route('/api/current/health-record', methods=['GET'])
def current_heath_record():
    list = azure_blob_call_service.getUserRecordDbContainerData("hourlyHeathRecord")
    if len(list) == 0:
        return {'status': 'error', 'message': ''}
    latestedUpdatedRecord = list[-1]
    json_data = csv_json_conversion_service.dump_to_json(latestedUpdatedRecord)
    return json_data


# Dashboard page api part ended
# ------------------------------------------------------------------------
# TODO-List page api part started
@app.route('/api/todo-list', methods=['GET'])
def todo_list():
    json_data = todo_list_controller.todo_list()
    json_data = csv_json_conversion_service.dump_to_json(json_data)
    return json_data


# TODO-List page api part ended
# ------------------------------------------------------------------------
# Analysis page api part started

@app.route('/api/report/health-record', methods=['GET'])
def health_record_analysis():
    json_data = analysis_controller.heart_record_analysis()
    json_data = csv_json_conversion_service.dump_to_json(json_data)
    return json_data

# Analysis page api part ended
# ------------------------------------------------------------------------
# Activities page api part started
@app.route('/api/energy', methods=['GET'])
def energy_json():
    return activity_track_controller.energy_json()


@app.route('/api/force-directed-graph', methods=['GET'])
def force_directed_graph():
    return activity_track_controller.force_directed_graph()


@app.route('/api/parallel-coordinate-cars', methods=['GET'])
def parallel_coordinate_cars():
    return activity_track_controller.parallel_coordinate_cars()


@app.route('/api/parallel-coordinate-keys', methods=['GET'])
def parallel_coordinate_keys():
    return activity_track_controller.parallel_coordinate_keys()


@app.route('/api/activity-tracks', methods=['GET'])
def activity_tracks():
    return activity_track_controller.activity_tracks()


# Activities page api part ended

# ------------------------------------------------------------------------
# Emergency page api part started

@app.route('/api/emergency-contacts', methods=['GET'])
def emergency_contacts():
    return emergency_contact_controller.emergency_contacts()


# Emergency page api part ended
# ------------------------------------------------------------------------
# Machine learning part start
@app.route('/api/decision_tree', methods=['POST'])
def decision_tree_engine():
    input_json = request.get_json(force=True)
    return machine_learning_controller.decision_tree_engine(input_json)


# Machine learning part ended
# ------------------------------------------------------------------------
# Python application entry point for running application
if __name__ == '__main__':
    app.run()

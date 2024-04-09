from flask import Flask

import controller.dashboard_controller as dashboard_controller
import controller.todo_list_controller as todo_list_controller
import controller.activity_track_controller as activity_track_controller
import controller.analysis_controller as analysis_controller
import controller.emergency_contact_controller as emergency_contact_controller
import controller.machine_learning_controller as machine_learning_controller

from flask_cors import CORS

# ------------------------------------------------------------------------

# CORS access given to all request call from defined url
app = Flask(__name__, static_url_path='/')
cors = CORS(app, origins=["http://localhost:3000", "https://elderdatavisualization.azurewebsites.net"])


# ------------------------------------------------------------------------

# Controller for index page which will display all compiled version of reactjs from python application after build
@app.route('/')
def index_page():
    return app.send_static_file('index.html')  # Return index.html from the static folder


# ------------------------------------------------------------------------
# Dashboard page api started

@app.route('/api/current/heart-rate')
def current_heart_rate():
    return dashboard_controller.current_heart_rate()


@app.route('/api/current/SPO2')
def current_SP02():
    return dashboard_controller.current_SP02()


@app.route('/api/current/respiratory-rate')
def current_respiratory_rate():
    return dashboard_controller.current_respiratory_rate()


@app.route('/api/current/body-temperature')
def current_temperature():
    return dashboard_controller.current_temperature()


@app.route('/api/current/blood-pressure')
def current_blood_pressure():
    return dashboard_controller.current_blood_pressure()


@app.route('/api/current/blood-sugar')
def current_blood_sugar():
    return dashboard_controller.current_blood_sugar()


@app.route('/api/current/mental-status')
def current_mental_status():
    return dashboard_controller.current_mental_status()


@app.route('/api/current/sleep-pattern')
def current_sleep_pattern():
    return dashboard_controller.current_sleep_pattern()


@app.route('/api/current/steps')
def current_steps_count():
    return dashboard_controller.current_steps_count()


# Dashboard page api part ended
# ------------------------------------------------------------------------
# TODO-List page api part started
@app.route('/api/todo-list')
def todo_list():
    return todo_list_controller.todo_list()


# TODO-List page api part ended
# ------------------------------------------------------------------------
# Analysis page api part started

@app.route('/api/report/heart-rate-analysis')
def heart_rate_analysis():
    return analysis_controller.heart_rate_analysis()


@app.route('/api/report/respiratory-rate-analysis')
def respiratory_rate_analysis():
    return analysis_controller.respiratory_rate_analysis()


@app.route('/api/report/spo2-analysis')
def spo2_analysis():
    return analysis_controller.spo2_analysis()


@app.route('/api/report/blood-sugar-analysis')
def blood_sugar_anaysis():
    return analysis_controller.blood_sugar_anaysis()


@app.route('/api/report/sleep-pattern-analysis')
def sleep_pattern_analysis():
    return analysis_controller.sleep_pattern_analysis()


@app.route('/api/report/body-temperature-analysis')
def body_temperature_analysis():
    return analysis_controller.body_temperature_analysis()


@app.route('/api/report/total-steps-analysis')
def total_steps_analysis():
    return analysis_controller.total_steps_analysis()


# Analysis page api part ended
# ------------------------------------------------------------------------
# Activities page api part started
@app.route('/api/energy')
def energy_json():
    return activity_track_controller.energy_json()


@app.route('/api/force-directed-graph')
def force_directed_graph():
    return activity_track_controller.force_directed_graph()


@app.route('/api/parallel-coordinate-cars')
def parallel_coordinate_cars():
    return activity_track_controller.parallel_coordinate_cars()


@app.route('/api/parallel-coordinate-keys')
def parallel_coordinate_keys():
    return activity_track_controller.parallel_coordinate_keys()


@app.route('/api/activity-tracks')
def activity_tracks():
    return activity_track_controller.activity_tracks()


# Activities page api part ended

# ------------------------------------------------------------------------
# Emergency page api part started

@app.route('/api/emergency-contacts')
def emergency_contacts():
    return emergency_contact_controller.emergency_contacts()


# Emergency page api part ended
# ------------------------------------------------------------------------
# Machine learning part start
@app.route('/api/decision_tree')
def decision_tree_engine():
    return machine_learning_controller.decision_tree_engine()


# Machine learning part ended
# ------------------------------------------------------------------------
# Python application entry point for running application
if __name__ == '__main__':
    app.run()

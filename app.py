from flask import Flask, request, redirect
from flask_cors import CORS
from backend import azure_blob_call_service, activity_track_service, analysis_service, decision_tree_ml_service

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
    # json_data = csv_json_conversion_service.dump_to_json(latestedUpdatedRecord)
    return latestedUpdatedRecord

# ------------------------------------------------------------------------
# Analysis page api part started

@app.route('/api/report/health-record', methods=['GET'])
def health_record_analysis():
    json_data = analysis_service.health_record_analysis()
    # json_data = csv_json_conversion_service.dump_to_json(json_data)
    return json_data


# Analysis page api part ended
# ------------------------------------------------------------------------
# Activities page api part started

@app.route('/api/activity-tracks', methods=['GET'])
def activity_tracks():
    return activity_track_service.activity_tracks()


# Activities page api part ended

# ------------------------------------------------------------------------
# Emergency page api part started

@app.route('/api/emergency-contacts', methods=['GET'])
def emergency_contacts():
    list = azure_blob_call_service.getConstantContainer("Emergency Contact List.csv")
    return list


# Emergency page api part ended
# ------------------------------------------------------------------------
# Machine learning part start
@app.route('/api/decision_tree', methods=['POST'])
def decision_tree_engine():
    input_json = request.get_json(force=True)
    list = decision_tree_ml_service.decision_tree_engine(input_json)
    response_json = {'input': input_json, 'output': list}
    return response_json


# Machine learning part ended

# Error handle
@app.errorhandler(404)
def page_not_found(e):
    path = request.path
    if path.__contains__('/api/'):
        return {'status': 'error', 'message': 'API not found'}, 404
    else:
        return redirect("/?redirect=" + path, code=302)


# ------------------------------------------------------------------------
# Python application entry point for running application
if __name__ == '__main__':
    app.run()

from flask import Flask

import file_util
import json

import map_json_to_proper_naming

app = Flask(__name__)


@app.route('/energy')
def energy_json():
    response = file_util.read_file(r'.\data\energy.json')
    return response


@app.route('/force-directed-graph')
def force_directed_graph():
    response = file_util.read_file(r'.\data\force-directed-graph.json')

    response = map_json_to_proper_naming.change_jsonKeyName(response, "nodes", "id", "name")
    response = map_json_to_proper_naming.change_jsonKeyName(response, "nodes", "group", "category")

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


@app.route('/')
def index_page():
    return 'Welcome to Demo Flash App for D3.js'


if __name__ == '__main__':
    app.run()

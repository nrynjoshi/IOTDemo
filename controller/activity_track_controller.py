# Activities page api part started
from service import csv_json_conversion_service


def energy_json():
    response = csv_json_conversion_service.read_json_file(r'.\data\energy.json')
    return response


def force_directed_graph():
    response = csv_json_conversion_service.read_json_file(r'.\data\force-directed-graph.json')
    # ---
    nodes = [{"id": "", "group": ""}]
    links = []
    link = {"source": "", "target": "", "": "value"}
    return response


def parallel_coordinate_cars():
    response = csv_json_conversion_service.read_json_file(r'.\data\parallel-coordinate-cars.json')
    return response


def parallel_coordinate_keys():
    response = csv_json_conversion_service.read_json_file(r'.\data\parallel-coordinate-keys.json')

    return response


def activity_tracks():
    response = csv_json_conversion_service.read_json_file(r'.\data\activity-tracks.json')

    return response

# Activities page api part ended

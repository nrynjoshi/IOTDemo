from service import csv_json_conversion_service
from service import decision_tree_ml_service


def decision_tree_engine():
    data = decision_tree_ml_service.process('no', 'yes', 'yes', 'no', 25, 'yes', 'normal', 'normal')

    return csv_json_conversion_service.dump_to_json(data)

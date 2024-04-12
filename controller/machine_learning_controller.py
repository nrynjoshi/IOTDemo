from service import csv_json_conversion_service
from service import decision_tree_ml_service


def decision_tree_engine(input_json):
    data = decision_tree_ml_service.process(input_json['has_fever'], input_json['has_cough'], input_json['has_fatigue'],
                                            input_json['has_difficulty_breathing'], input_json['age'],
                                            input_json['is_male'], input_json['blood_pressure_level'],
                                            input_json['cholesterol_level'])
    return csv_json_conversion_service.dump_to_json(data)

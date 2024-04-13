# Step 1: Import Libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from service import azure_blob_call_service

clf_disease = DecisionTreeClassifier()
clf_outcome = DecisionTreeClassifier()
isInitDone: bool = False


def init():
    # Step 2: Load Dataset
    json_list = azure_blob_call_service.getRulesContainer('Disease Symptoms and Patient Profile Dataset.csv')

    # Convert list of JSON objects to DataFrame
    data = pd.DataFrame(json_list)

    # Step 3: Data Preprocessing (if needed)
    # Convert 'yes' and 'no' values to binary (0 or 1)

    data['Fever'] = data['Fever'].map({'yes': 1, 'no': 0})
    data['Cough'] = data['Cough'].map({'yes': 1, 'no': 0})
    data['Fatigue'] = data['Fatigue'].map({'yes': 1, 'no': 0})
    data['Difficulty Breathing'] = data['Difficulty Breathing'].map({'yes': 1, 'no': 0})
    data['Blood Pressure'] = data['Blood Pressure'].map({'Low': -1, 'Normal': 0, 'High': 1})
    data['Cholesterol Level'] = data['Cholesterol Level'].map({'Low': -1, 'Normal': 0, 'High': 1})
    data['Outcome Variable'] = data['Outcome Variable'].map({'Positive': 1, 'Negative': 0})
    data['Gender'] = data['Gender'].map({'Male': 1, 'Female': 0})

    # Step 4: Split Data into Features and Labels
    X = data.drop(['Disease', 'Outcome Variable'], axis=1)  # Features
    y_disease = data['Disease']  # Label for Disease
    y_outcome = data['Outcome Variable']  # Label for Outcome Variable

    # Step 5: Train Decision Tree Model for Disease
    X_train, X_test, y_disease_train, y_disease_test = train_test_split(X, y_disease, test_size=0.2, random_state=42)
    global clf_disease
    clf_disease.fit(X_train, y_disease_train)

    # Step 6: Train Decision Tree Model for Outcome Variable
    X_train, X_test, y_outcome_train, y_outcome_test = train_test_split(X, y_outcome, test_size=0.2, random_state=42)
    global clf_outcome
    clf_outcome.fit(X_train, y_outcome_train)
    global isInitDone
    isInitDone = True


def process(has_fever: str, has_cough: str, has_fatigue: str, has_difficulty_breathing: str, age: int, is_male: str,
            blood_pressure_level: str, cholesterol_level: str):
    global clf_disease
    global clf_outcome
    global isInitDone

    # Step 7: Make Predictions
    if not isInitDone:
        init()

    def convert_bool_to_int(b):
        if b.lower() in ('yes', 'true', 't', 'y', '1', 'male'):
            return 1
        else:
            return 0

    def convert_level_to_int(b):
        if b.lower() in 'high':
            return 1
        elif b.lower() in 'normal':
            return 0
        else:
            return -1

    # Assuming new_input is a dictionary containing new input data
    new_input = {'Fever': convert_bool_to_int(has_fever), 'Cough': convert_bool_to_int(has_cough),
                 'Fatigue': convert_bool_to_int(has_fatigue),
                 'Difficulty Breathing': convert_bool_to_int(has_difficulty_breathing), 'Age': age,
                 'Gender': convert_bool_to_int(is_male), 'Blood Pressure': convert_level_to_int(blood_pressure_level),
                 'Cholesterol Level': convert_level_to_int(cholesterol_level)}

    # Make prediction for Disease
    new_input_df = pd.DataFrame([new_input])
    predicted_disease = clf_disease.predict(new_input_df)

    # Make prediction for Outcome Variable
    predicted_outcome = clf_outcome.predict(new_input_df)

    def convert_outcome_to_string(b):
        if b == 1:
            return 'Positive'
        else:
            return 'Negative'

    print("Predicted Disease:", predicted_disease)
    print("Predicted Outcome Variable:", predicted_outcome)
    outcome = {'disease': predicted_disease[0], 'outcome': convert_outcome_to_string(predicted_outcome)}
    return outcome

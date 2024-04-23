# Step 1: Import Libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from service import azure_blob_call_service

clf_disease = DecisionTreeClassifier()
clf_outcome = DecisionTreeClassifier()
isInitDone: bool = False

# This init function will only trigger once on the application life cycle and this will only trigger when
# decision-making application called first time
def init():
    # Step 2: Load Dataset
    json_list = azure_blob_call_service.getConstantContainer('Disease Symptoms and Patient Profile Dataset.csv')

    # Convert list of JSON objects to DataFrame
    data = pd.DataFrame(json_list)

    # Step 3: Data Preprocessing (if needed)
    # Convert 'yes' and 'no' values to binary 1, 0 respectively for supporting in decision
    # Convert 'Male' and 'Female' values to binary 1, 0 respectively for supporting in decision
    # Convert 'Low', 'Normal', and 'High' values to binary -1, 0, 1 respectively for supporting in decision
    data['Fever'] = data['Fever'].map({'yes': 1, 'no': 0})
    data['Cough'] = data['Cough'].map({'yes': 1, 'no': 0})
    data['Fatigue'] = data['Fatigue'].map({'yes': 1, 'no': 0})
    data['Difficulty Breathing'] = data['Difficulty Breathing'].map({'yes': 1, 'no': 0})
    data['Blood Pressure'] = data['Blood Pressure'].map({'Low': -1, 'Normal': 0, 'High': 1})
    data['Cholesterol Level'] = data['Cholesterol Level'].map({'Low': -1, 'Normal': 0, 'High': 1})
    data['Outcome Variable'] = data['Outcome Variable'].map({'Positive': 1, 'Negative': 0})
    data['Gender'] = data['Gender'].map({'Male': 1, 'Female': 0})

    # Step 4: Split Data into Features and Labels
    # feeding the expected outcome field after making decision
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


# this function will get the json object and split that value as a separate param for further processing of information
def decision_tree_engine(input_json):
    data = process(input_json['has_fever'], input_json['has_cough'], input_json['has_fatigue'],
                   input_json['has_difficulty_breathing'], input_json['age'],
                   input_json['is_male'], input_json['blood_pressure_level'],
                   input_json['cholesterol_level'])
    return data


# this is actual evaluation logic of machine learning algorithm will takes a range of input paramater to make a
# decision and provide a expected outcome based on the input and its train values
def process(has_fever: str, has_cough: str, has_fatigue: str, has_difficulty_breathing: str, age: int, is_male: str,
            blood_pressure_level: str, cholesterol_level: str):
    print("has_fever: ", has_fever,
          "has_cough: ", has_cough,
          "has_fatigue: ", has_fatigue,
          "has_difficulty_breathing: ", has_difficulty_breathing,
          "age: ", age,
          "is_male: ", is_male,
          "blood_pressure_level: ", blood_pressure_level,
          "cholesterol_level: ", cholesterol_level
          )

    # declare the global set variable from the function level
    global clf_disease
    global clf_outcome
    global isInitDone

    # this statement will only execute once in a whole application run time to train the model this statement will
    # trigger whenever someone call for decision-making based on this machine learning only to save the performance
    # and load
    if not isInitDone:
        init()  # this will init the model and train the model

    # this will convert different types of value to boolean as defined while training model
    def convert_bool_to_int(b):
        if b.lower() in ('yes', 'true', 't', 'y', '1', 'male', 'm', 'high'):
            return 1
        else:
            return 0

    # this will convert different types of value to boolean as defined while training model
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

    # this function will convert integer outcome to equivalent string value for predicted_outcome
    def convert_outcome_to_string(b):
        if b == 1:
            return 'Positive'
        else:
            return 'Negative'

    print("Predicted Disease:", predicted_disease)
    print("Predicted Outcome Variable:", predicted_outcome)

    # preparing the json body for return statement
    resource_list = []
    for idx, x in enumerate(predicted_disease):
        outcome = {'disease': x, 'outcome': convert_outcome_to_string(predicted_outcome[idx])}
        resource_list.append(outcome)

    return resource_list

import pandas as pd
import re


def parse_time(time_str):
    if time_str.strip():  # Check if the string is not empty
        try:
            return pd.to_datetime(time_str, format='%m/%d/%Y %H:%M')
        except ValueError:
            return pd.NaT  # Return NaT (Not a Time) for empty strings

    else:
        return pd.NaT  # Return NaT (Not a Time) for empty strings


# Define a function to extract times from the string
def extract_times(time_string):
    # Use regular expression to find all time patterns in the string
    times = re.findall(r'\d{2}:\d{2}', time_string)
    return times

from flask import Flask

import file_util

app = Flask(__name__)

@app.route('/energy')
def energy_json():
    response = file_util.read_file(r'C:\Users\geeva\OneDrive - Leeds Beckett University\Dissertation Module\meeting 2\DemoApp\data\energy.json')
    return response

@app.route('/')
def index_page():
    return 'Welcome to Demo Flash App for D3.js'

if __name__ == '__main__':
    app.run()

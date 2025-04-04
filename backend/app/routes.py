from flask import Blueprint, jsonify, send_file
from backend.data.dust_visualize import visualization
from backend.data.seoul_visualize import visualize_seoul_air_quality
from backend.data.seoul_dust import pollutant

api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/api/dust-map")
def dust_map():
    image_path = visualization() # 인자 필요
    return send_file(image_path, mimetype='image/png')

@api_blueprint.route("/api/seoul-map")
def seoul_map():
    image_path = visualize_seoul_air_quality()
    return send_file(image_path, mimetype='image/png')

@api_blueprint.route("/api/seoul-dust-data")
def seoul_dust_data():
    data = pollutant() # 내부 인자 필요
    return jsonify(data)

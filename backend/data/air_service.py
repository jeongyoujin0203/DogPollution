from flask import Blueprint, request, jsonify

air_bp = Blueprint("air_bp", __name__, url_prefix="/api/air")

WHO_BANDS = {
    "PM10": [(0,20,"좋음"), (21,50,"보통"), (51,100,"나쁨"), (101,9999,"매우 나쁨")],
    "PM25": [(0,10,"좋음"), (11,25,"보통"), (26,50,"나쁨"), (51,9999,"매우 나쁨")]
}
LEVEL_META = {
    "좋음": {"level":0,"color":"#2ecc71","icon":"walk-good"},
    "보통": {"level":1,"color":"#f1c40f","icon":"walk-caution"},
    "나쁨": {"level":2,"color":"#e67e22","icon":"indoor-only"},
    "매우 나쁨": {"level":3,"color":"#e74c3c","icon":"mask"}
}

def classify(value, pollutant):
    for lo, hi, name in WHO_BANDS[pollutant]:
        if lo <= value <= hi:
            return name
    return "보통"

@air_bp.route("/visual-map", methods=["POST"])
def visual_map():
    data = request.get_json() or {}
    pm10 = data.get("pm10")
    pm25 = data.get("pm25")
    labels = []
    if pm10 is not None: labels.append(classify(pm10, "PM10"))
    if pm25 is not None: labels.append(classify(pm25, "PM25"))
    label = max(labels, key=lambda x: LEVEL_META[x]["level"]) if labels else "보통"
    return jsonify({
        "label": label,
        **LEVEL_META[label]
    })

from flask import Blueprint, request, jsonify
from .air_service import classify, LEVEL_META

guides_bp = Blueprint("guides_bp", __name__, url_prefix="/api/guides")

@guides_bp.route("/walkability", methods=["GET"])
def walkability():
    pm10 = request.args.get("pm10", type=int)
    pm25 = request.args.get("pm25", type=int)
    sensitivity = request.args.get("sensitivity", default="normal")

    labels = []
    if pm10 is not None: labels.append(classify(pm10,"PM10"))
    if pm25 is not None: labels.append(classify(pm25,"PM25"))
    label = max(labels, key=lambda x: LEVEL_META[x]["level"]) if labels else "보통"
    lvl = LEVEL_META[label]["level"]
    if sensitivity=="sensitive":
        lvl = min(lvl+1,3)

    if lvl==0:
        decision, tips="OK",["평상시 산책 OK"]
    elif lvl==1:
        decision, tips="CAUTION",["짧은 산책 권장","수분 보충"]
    else:
        decision, tips="AVOID",["실내 활동 권장","마스크 착용"]

    return jsonify({
        "decision": decision,
        "visual": {**LEVEL_META[label],"label":label},
        "tips": tips
    })

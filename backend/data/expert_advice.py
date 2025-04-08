from flask import Blueprint, jsonify

# 전문가 조언 데이터 (예시)
EXPERT_ADVICE = {
    'PM10': {
        'low': "미세먼지 농도가 낮습니다. 야외활동에 무리가 없습니다.",
        'moderate': "미세먼지 농도가 보통입니다. 외출 시 마스크를 착용하세요.",
        'high': "미세먼지 농도가 높습니다. 외출을 자제하세요.",
    },
    'PM25': {
        'low': "미세먼지 농도가 낮습니다. 걱정 없이 활동하세요.",
        'moderate': "미세먼지 농도가 보통입니다. 주의가 필요합니다.",
        'high': "미세먼지 농도가 매우 높습니다. 외출을 피하고 실내에 머무르세요.",
    }
}

def get_expert_advice(pollutant, value):
    """
    주어진 미세먼지 농도(value)에 따라 전문가 조언을 반환하는 함수
    인자:
      - pollutant: 'PM10' 또는 'PM25'
      - value: 미세먼지 농도 (정수)
    """
    if pollutant not in EXPERT_ADVICE:
        return "잘못된 pollutant 값입니다."
    if value < 50:
        return EXPERT_ADVICE[pollutant]['low']
    elif 50 <= value < 100:
        return EXPERT_ADVICE[pollutant]['moderate']
    else:
        return EXPERT_ADVICE[pollutant]['high']

# Flask Blueprint 생성 및 엔드포인트 정의
expert_advice_bp = Blueprint('expert_advice_bp', __name__)

@expert_advice_bp.route('/api/advice/<pollutant>/<int:value>', methods=['GET'])
def advice(pollutant, value):
    """
    GET 요청: 미세먼지 농도에 따른 전문가 조언을 반환하는 엔드포인트
    URL 경로 변수:
      - pollutant: 'PM10' 또는 'PM25'
      - value: 미세먼지 농도 (정수)
    """
    advice_text = get_expert_advice(pollutant, value)
    return jsonify({
        "pollutant": pollutant,
        "value": value,
        "advice": advice_text
    })
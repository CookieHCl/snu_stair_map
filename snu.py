# save as snu_buildings_autogeocode.py

import os
import sys
import json
import time
import requests

# 1) Kakao REST API 키를 발급받아 아래 환경변수에 세팅하세요.
API_KEY = "7010e43504a3e3b8dffc46cfa630a5ac"
if not API_KEY:
    print(
        "❌ KakaoAK 키가 설정되어 있지 않습니다. 환경변수 KAKAO_API_KEY를 확인하세요."
    )
    sys.exit(1)

HEADERS = {"Authorization": f"KakaoAK {API_KEY}"}

# 2) 처리할 동(몇동)의 최대값을 지정하세요.
#    예: 서울대학교는 1동~50동까지 있으니까 max_dong=50
dong_ranges = [
    range(1, 143 + 1),
    range(150, 153 + 1),
    range(300, 302 + 1),
    range(310, 316 + 1),
    range(900, 950 + 1),
]
special_dong_names = [
    "15-1",
    "16-1",
    "25-1",
    "43-1",
    "44-1",
    "48-1",
    "57-1",
    "62-1",
    "71-1",
    "71-2",
    "75-1",
    "80-1",
    "104-1",
    "137-1",
    "137-2",
    "139-1",
    "152-1",
    "200",
    "220",
    "221",
    "222",
    "500",
    "941-1",
]


def search_building(dong_number: int):
    """
    Kakao 로컬 키워드 검색 API 호출 후
    첫 번째 문서로부터 (place_name, 위도, 경도) 반환.
    """
    url = "https://dapi.kakao.com/v2/local/search/keyword.json"
    params = {"query": f"서울대학교 {dong_number}동"}
    resp = requests.get(url, headers=HEADERS, params=params)
    resp.raise_for_status()
    docs = resp.json().get("documents", [])
    if not docs:
        return None, None, None
    first = docs[0]
    return first["place_name"], float(first["y"]), float(first["x"])


def check_dup(results, dong_name, dong_lat, dong_lng):
    """
    이미 결과에 같은 동이 있는지 확인
    """
    for result in results:
        if (
            result["name"] == dong_name
            and result["lat"] == dong_lat
            and result["lng"] == dong_lng
        ):
            return True
    return False


def main():
    results = []
    for dong_range in dong_ranges:
        for n in dong_range:
            name, lat, lng = search_building(n)
            if name is None:
                print(f"⚠️  검색 결과 없음: 서울대학교 {n}동")
            else:
                if check_dup(results, name, lat, lng):
                    print(f"⚠️ 중복 결과: {n}동 → {name} ({lat:.6f}, {lng:.6f})")
                    continue
                print(f"✅ {n}동 → {name}: ({lat:.6f}, {lng:.6f})")
                results.append({"dong": f"{n}동", "name": name, "lat": lat, "lng": lng})
            time.sleep(0.1)  # 과도한 호출 방지
    for special_dong in special_dong_names:
        name, lat, lng = search_building(special_dong)
        if name is None:
            print(f"⚠️  검색 결과 없음: 서울대학교 {special_dong}동")
        else:
            if check_dup(results, name, lat, lng):
                print(f"⚠️ 중복 결과: {special_dong}동 → {name} ({lat:.6f}, {lng:.6f})")
                continue
            print(f"✅ {special_dong}동 → {name}: ({lat:.6f}, {lng:.6f})")
            results.append(
                {"dong": f"{special_dong}동", "name": name, "lat": lat, "lng": lng}
            )
        time.sleep(0.1)

    # JSON 파일로 저장
    with open("snu_buildings_coords.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("\n📑 결과가 snu_buildings_coords.json에 저장되었습니다.")


if __name__ == "__main__":
    main()

import requests

URL = "https://Noyzzing.pythonanywhere.com/admin/update_profile_pic"
KEY = "ROL-OAK-2026"
ALIAS = "Kiatura"
PIC_URL = "/uploads/Kiatura_profile.webp"

response = requests.post(
    f"{URL}?key={KEY}",
    json={"alias": ALIAS, "profile_pic": PIC_URL}
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

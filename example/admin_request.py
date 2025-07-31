import jwt # pip install pyjwt
import requests
from pathlib import Path
import time
import uuid

AUD="shortener"
ISS="dev@guigiusti.com"
USER="guigiusti"
SUB="dev@guigiusti.com"
TOKEN_EXPIRATION=60

HOST="http://localhost"

private_key = Path("../private.pem").read_bytes()

def get_token():
    now = int(time.time())
    jwt_payload = {
        "aud": AUD,
        "iss": ISS,
        "iat": now,
        "nbf": now,
        "exp": now + TOKEN_EXPIRATION,
        "sub": SUB,
        "jti": str(uuid.uuid4()),
        "user": USER
    }
    return jwt.encode(jwt_payload, private_key, algorithm="EdDSA")

def get_urls():
    token = get_token()
    response = requests.get(
        f"{HOST}/admin/urls",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.json()

def create_url(url, shortId):
    token = get_token()
    post_response = requests.post(
    f"{HOST}/admin/urls",
    headers={"Authorization": f"Bearer {token}"},
    body={
        "url": url,
        "shortId": shortId
    }
)
    return post_response.json()
def update_url(url, shortId):
    token = get_token()
    put_response = requests.put(
        f"{HOST}/admin/urls",
        headers={"Authorization": f"Bearer {token}"},
        body={
            "url": url,
            "shortId": shortId
        }
    )
    return put_response.json()

def delete_url(shortId):
    token = get_token()
    delete_response = requests.delete(
        f"{HOST}/admin/urls",
        headers={"Authorization": f"Bearer {token}"},
        body={"shortId": shortId}
    )
    return delete_response.json()

# create_url("https://guigiusti.com", "guigiusti")
# update_url("https://guigiusti.com/blog", "guigiusti")
# delete_url("guigiusti")
#print(get_urls())
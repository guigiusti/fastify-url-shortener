import jwt from "jsonwebtoken"; // npm install jsonwebtoken
import fs from "fs";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

const AUD = "shortener";
const ISS = "dev@guigiusti.com";
const USER = "guigiusti";
const SUB = "dev@guigiusti.com";
const TOKEN_EXPIRATION = 60;

const HOST = "http://localhost";

const privateKey = fs.readFileSync("../private.pem", "utf8");

function getToken() {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
        aud: AUD,
        iss: ISS,
        iat: now,
        nbf: now,
        exp: now + TOKEN_EXPIRATION,
        sub: SUB,
        jti: uuidv4(),
        user: USER
    };
    return jwt.sign(jwtPayload, privateKey, { algorithm: "ES256" });
}

async function getUrls() {
    const token = getToken();
    const response = await fetch(`${HOST}/admin/urls`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
}

async function createUrl(url: string, shortId: string) {
    const token = getToken();
    const postResponse = await fetch(`${HOST}/admin/urls`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
            url: url,
            shortId: shortId
        })
    });
    return postResponse.json();
}

async function updateUrl(url: string, shortId: string) {
    const token = getToken();
    const putResponse = await fetch(`${HOST}/admin/urls`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
            url: url,
            shortId: shortId
        })
    });
    return putResponse.json();
}

async function deleteUrl(shortId: string) {
    const token = getToken();
    const deleteResponse = await fetch(`${HOST}/admin/urls`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ shortId: shortId })
    });
    return deleteResponse.json();
}

//createUrl("https://guigiusti.com", "guigiusti");
// updateUrl("https://guigiusti.com/blog", "guigiusti");
// deleteUrl("guigiusti");
// console.log(getUrls());
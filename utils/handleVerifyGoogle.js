const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    const user = {
        name: payload.given_name ? payload.given_name : payload.name,
        surnames: payload.family_name ? payload.family_name : "",
        email: payload.email
    }
    return user;
}

module.exports = { verify }
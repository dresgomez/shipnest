export default function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).end();
}

const { password } = req.body;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (password === ADMIN_PASSWORD) {

return res.status(200).json({

success: true,
token: "admin_logged"

});

}

return res.status(401).json({

success: false

});

}
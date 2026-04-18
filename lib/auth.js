export function verifyAdmin(req) {
  const token = req.headers.authorization;

  if (!token || token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return false;
  }

  return true;
}
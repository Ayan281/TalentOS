const jwt = require("jsonwebtoken");
const cookie = require("cookie");

function authSocket(socket, next) {

  // Socket.IO gives us raw headers — we parse cookies manually
  const rawCookies = socket.handshake.headers.cookie;

  if (!rawCookies) {
    return next(new Error("Unauthorized: No cookie"));
  }

  const cookies = cookie.parse(rawCookies);
  const token = cookies.token;

  if (!token) {
    return next(new Error("Unauthorized: No token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role, username } available on every socket event
    next();
  } catch (err) {
    return next(new Error("Unauthorized: Invalid token"));
  }
}

module.exports = authSocket;
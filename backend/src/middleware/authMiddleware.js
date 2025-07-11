const crypto = require('crypto');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return res.status(403).json({ error: 'Firma del token inválida' }); // Forbidden
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token expirado' }); // Unauthorized
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' }); // Forbidden
  }
}

module.exports = verifyToken;

const express = require('express')
const passport = require('passport')

const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google'), (req, res) =>
  res.send(200)
)

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) =>
  res.redirect('http://localhost:3000')
)

// Testen (von chatgpt)
authRouter.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

module.exports = authRouter
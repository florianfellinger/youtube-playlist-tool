const express = require('express')
const passport = require('passport')

const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google'), (req, res) =>
  res.send(200)
)

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) =>
  res.redirect('http://localhost:3000')
)

authRouter.get('/google-logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' })

    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' })
      res.status(200).json({ message: 'Logged out successfully' })
    })
  })
})


// Testen (von chatgpt)
authRouter.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

module.exports = authRouter
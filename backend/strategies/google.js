const passport = require('passport')
const Profile = require('passport-google-oauth20')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const VerifyCallback = require('passport-google-oauth20')

passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
        scope: [
            'email',
            'profile',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl',
        ],
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("ACCESS TOKEN OF USER:", accessToken)
        console.log("PROFILE OF LOGGED IN USER:", profile)
        const user = {
            username: profile.displayName,
            profilePicture: profile.photos[0].value,
            accessToken
        }
        done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
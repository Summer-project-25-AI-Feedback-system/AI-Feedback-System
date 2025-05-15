import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

// GitHub OAuth configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false | null) => void
    ) => {
      console.log("Access Token:", accessToken);
      console.log("GitHub Profile:", profile);
      return done(null, profile);
    }
  )
);

// Serialize user to store user in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

export default passport;

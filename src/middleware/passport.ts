import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/User';

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      callbackURL: process.env.GITHUB_CALLBACK_URL ?? '',
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        let user = await User.findOne({ oauthId: profile.id });
        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.noemail`,
            githubUsername: profile.username,
            oauthId: profile.id,
            role: 'jobseeker',
            joinedDate: new Date(),
          });
        }
        return done(null, { ...user.toObject(), oauthId: profile.id });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.oauthId));

passport.deserializeUser(async (oauthId: string, done) => {
  try {
    const user = await User.findOne({ oauthId });
    done(null, user ? { ...user.toObject(), oauthId } : null);
  } catch (err) {
    done(err);
  }
});

export default passport;
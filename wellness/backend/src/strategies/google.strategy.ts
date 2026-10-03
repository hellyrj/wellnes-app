import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../repositories/user.repository';
import { generateTokens } from '../utils/jwt';

const userRepository = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Check if user exists with this Google ID
        let user = await userRepository.findByProviderId('google', profile.id);

        // If not, check if user exists with this email
        if (!user) {
          user = await userRepository.findByEmail(email);
          
          if (user) {
            // User exists with email but not Google - link the account
            user = await userRepository.updateProvider(user.id, 'google', profile.id);
          } else {
            // Create new user
            user = await userRepository.create({
              email,
              name: profile.displayName || profile.name?.givenName,
              profilePicture: profile.photos?.[0]?.value,
              provider: 'google',
              providerId: profile.id,
              isEmailVerified: true, // Google accounts are pre-verified
            });
          }
        }

        // Generate tokens
        const tokens = generateTokens(user.id, user.email);

        return done(null, { user, tokens });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;

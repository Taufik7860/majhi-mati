import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from './db.js';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'majhi_mati_super_secret_jwt_key_2026',
};

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwt_payload.id },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            wardNumber: true,
            department: true,
          },
        });

        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
import 'dotenv/config';
import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import MongoStore from 'connect-mongo';
import connectDB from './config/db';
import { typeDefs } from './schema/typeDefs';
import { resolvers, Context } from './resolvers/resolvers';
import passport from './middleware/passport';

const PORT = process.env.PORT ?? 3000;

async function startServer(): Promise<void> {
  await connectDB();

  const app = express();

  app.set('trust proxy', 1);
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'fallback-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // OAuth routes
  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/failure' }),
    (_req: Request, res: Response) => res.redirect('/auth/success')
  );
  app.get('/auth/success', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ message: 'Logged in successfully', user: req.user });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  app.get('/auth/failure', (_req: Request, res: Response) => {
    res.status(401).json({ message: 'GitHub authentication failed' });
  });
  app.get('/auth/status', (req: Request, res: Response) => {
    res.json(req.isAuthenticated() ? { authenticated: true, user: req.user } : { authenticated: false });
  });
  app.get('/auth/logout', (req: Request, res: Response, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  // GraphQL
  const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }): Promise<Context> => ({ user: req.user as Context['user'] }),
  }));

  // API docs redirect to GraphQL
  app.get('/api-docs', (_req: Request, res: Response) => {
    res.redirect('/graphql');
  });

  // Root
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Job Board API is running',
      graphql: '/graphql',
      auth: { login: '/auth/github', status: '/auth/status', logout: '/auth/logout' },
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`Login: http://localhost:${PORT}/auth/github`);
  });
}

startServer().catch(console.error);
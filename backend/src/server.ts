import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server: Server;

async function main() {
  try {
    await prisma.$connect();
    server = app.listen(config.port, () => {
      console.log(`Triplance Backend listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log('👿 unhandledRejection is detected, shutting down ...', err);
  prisma.$disconnect();
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.log('👿 uncaughtException is detected, shutting down ...', err);
  prisma.$disconnect();
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('💤 SIGTERM received, shutting down gracefully ...');
  prisma.$disconnect();
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('💤 SIGINT received, shutting down gracefully ...');
  prisma.$disconnect();
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

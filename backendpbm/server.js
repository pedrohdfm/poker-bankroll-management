import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`servidor rodando em http://localhost:${PORT}`);
            console.log(`saude da api: http://localhost:${PORT}/health`);
            console.log(`ambiente: ${process.env.NODE_ENV || 'development'}`);
        })

        // shutdown

        const shutdown = async (signal) => {
            console.log(`${signal} recebido. finalizando...`)

            server.close(async () => {
                await disconnectDB();
                console.log('server closed.')
                process.exit(0)
            })
        }

        process.on('SIGTERM', () => shutdown('SIGTERM'))
        process.on('SIGINT', () => shutdown('SIGINT'))

    // ver oq é isso dps

    process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    } catch (error) {
        console.error('erro ao inicializar o server: ', error)
        process.exit(1)
    }
}

startServer();
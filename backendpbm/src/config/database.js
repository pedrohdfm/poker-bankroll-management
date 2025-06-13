import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

    // event listener

    mongoose.connection.on('error', (err) => {
        console.error('erro na conexão com o mongodb: ', err)
    })

    mongoose.connection.on('disconnected', () => {
        console.log('mongodb desconectado')
    })

    mongoose.connection.on('reconnected', () => {
        console.log('mongodb reconectado')
    })
}

    catch (error) {
        console.error('erro ao conectar ao mongodb: ', error.message)
        process.exit(1);
    }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB desconectado com sucesso');
  } catch (error) {
    console.error('Erro ao desconectar MongoDB:', error);
  }
};

export { connectDB, disconnectDB}
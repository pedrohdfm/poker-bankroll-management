import mongoose from "mongoose";

const bankrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    saldoInicial: {
        type: Number,
        required: [true],
        default: 0
    },

    saldoAtual: {
        type: Number,
        required: true,
        default: 0
    },

    updatedT: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
}
)

bankrollSchema.methods.updateSaldo = function(amount) {
    this.saldoAtual += amount;
    this.updatedT = new Date();
    return this.save();
}

bankrollSchema.methods.resetSaldo = function(novoSaldo) {
    this.saldoInicial = novoSaldo;
    this.saldoAtual = novoSaldo;
    this.updatedT = new Date();
    return this.save();
}

const Bankroll = mongoose.model('Bankroll', bankrollSchema);

export default Bankroll;
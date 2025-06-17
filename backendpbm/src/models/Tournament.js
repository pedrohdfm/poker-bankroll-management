// backend/src/models/Tournament.js
import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Nome do torneio é obrigatório'],
    trim: true
  },
  
  buyIn: {
    type: Number,
    required: [true, 'Buy-in é obrigatório'],
    min: [0, 'Buy-in não pode ser negativo']
  },
  
  cashOut: {
    type: Number,
    default: 0,
    min: [0, 'Cash-out não pode ser negativo']
  },
    
  itm: {
    type: Boolean,
    default: false  // In The Money - se ficou na premiação
  },
  
  date: {
    type: Date,
    default: Date.now
  },
  
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Método para calcular o lucro/prejuízo
tournamentSchema.methods.getProfit = function() {
  return this.cashOut - this.buyIn;
};

// Virtual para verificar se foi ITM
tournamentSchema.virtual('isITM').get(function() {
  return this.cashOut > 0;
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
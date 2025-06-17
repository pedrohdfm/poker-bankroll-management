import Tournament from '../models/Tournament.js';
import Bankroll from '../models/Bankroll.js';
import Joi from 'joi';

// Schema de validação
const tournamentSchema = Joi.object({
  name: Joi.string().required().trim(),
  buyIn: Joi.number().required().min(0),
  cashOut: Joi.number().min(0).default(0),
  position: Joi.number().min(1).optional(),
  totalPlayers: Joi.number().min(2).optional(),
  date: Joi.date().optional(),
  notes: Joi.string().max(500).optional()
});

// Criar novo torneio
export const createTournament = async (req, res) => {
  try {
    // Validar dados
    const { error, value } = tournamentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Adicionar usuário e calcular ITM
    const tournamentData = {
      ...value,
      user: req.user._id,
      itm: value.cashOut > 0
    };

    // Criar torneio
    const tournament = await Tournament.create(tournamentData);

    // Atualizar bankroll
    const bankroll = await Bankroll.findOne({ user: req.user._id });
    if (bankroll) {
      const profit = tournament.cashOut - tournament.buyIn;
      await bankroll.updateSaldo(profit);  
    }

    res.status(201).json({
      message: 'Torneio registrado com sucesso',
      tournament
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar torneio' });
  }
};

// Listar torneios do usuário
export const getTournaments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const tournaments = await Tournament.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tournament.countDocuments({ user: req.user._id });

    res.json({
      tournaments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar torneios' });
  }
};

// Obter estatísticas
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Buscar todos os torneios
    const tournaments = await Tournament.find({ user: userId });
    
    if (tournaments.length === 0) {
      return res.json({
        totalTournaments: 0,
        totalBuyIns: 0,
        totalCashOuts: 0,
        profit: 0,
        roi: 0,
        itm: 0,
        avgBuyIn: 0,
        avgProfit: 0
      });
    }

    // Calcular estatísticas
    const stats = tournaments.reduce((acc, tournament) => {
      acc.totalBuyIns += tournament.buyIn;
      acc.totalCashOuts += tournament.cashOut;
      acc.itmCount += tournament.itm ? 1 : 0;
      return acc;
    }, { totalBuyIns: 0, totalCashOuts: 0, itmCount: 0 });

    const profit = stats.totalCashOuts - stats.totalBuyIns;
    const roi = stats.totalBuyIns > 0 ? ((profit / stats.totalBuyIns) * 100) : 0;
    const itmPercentage = (stats.itmCount / tournaments.length) * 100;

    res.json({
      totalTournaments: tournaments.length,
      totalBuyIns: stats.totalBuyIns,
      totalCashOuts: stats.totalCashOuts,
      profit,
      roi: roi.toFixed(2),
      itm: itmPercentage.toFixed(2),
      avgBuyIn: (stats.totalBuyIns / tournaments.length).toFixed(2),
      avgProfit: (profit / tournaments.length).toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
};
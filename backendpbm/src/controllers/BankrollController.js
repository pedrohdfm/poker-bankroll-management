import Bankroll from '../models/Bankroll.js';
import Joi from 'joi';

const bankrollSchema = Joi.object({
    saldoInicial: Joi.number().required().min(0)
})

export const setBankroll = async (req, res) => {
    try {
        const {error, value} = bankrollSchema.validate(req.body);
        if(error) {
            return res.status(400).json({error: error.details[0].message})
        }

        let bankroll = await Bankroll.findOne({ user: req.user._id})

        if (bankroll) {
            await bankroll.resetSaldo(value.saldoInicial)
        } else {
            bankroll = await Bankroll.create({
                user: req.user._id,
                saldoInicial: value.saldoInicial,
                saldoAtual: value.saldoInicial
            })
        }

        res.json({
            message: 'banca criada com sucesso',
            bankroll : {
                ...bankroll.toObject(),
                currentBalance: bankroll.saldoAtual,
                initialBalance: bankroll.saldoInicial
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erro ao criar banca'})
    }
}

export const getBankroll = async (req, res) => {
    try {
        let bankroll = await Bankroll.findOne({ user: req.user._id})

        if (!bankroll) {
            bankroll = await Bankroll.create({
                user: req.user._id,
                saldoInicial: 0,
                saldoAtual: 0
            })
        }
        res.json({ 
            bankroll: {
                ...bankroll.toObject(),
                currentBalance: bankroll.saldoAtual,
                initialBalance: bankroll.saldoInicial  
            } })
    } catch (err) {
        res.status(500).json({ error: 'banca nao encontrada'})
    }
}
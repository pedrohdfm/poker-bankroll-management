import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Target,
  Plus,
  LogOut,
  BarChart3,
  Brain
} from 'lucide-react';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [bankroll, setBankroll] = useState(null);
  const [stats, setStats] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [showSetBankroll, setShowSetBankroll] = useState(false);
  
  // Form states
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    buyIn: '',
    cashOut: ''
  });
  
  const [bankrollForm, setBankrollForm] = useState({
    saldoInicial: ''
  });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bankrollRes, statsRes, tournamentsRes] = await Promise.all([
        api.get('/api/bankroll'),
        api.get('/api/tournaments/stats'),
        api.get('/api/tournaments?limit=5')
      ]);
      
      setBankroll(bankrollRes.data.bankroll);
      setStats(statsRes.data);
      setTournaments(tournamentsRes.data.tournaments);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar torneio
  const handleAddTournament = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...tournamentForm,
        buyIn: parseFloat(tournamentForm.buyIn),
        cashOut: parseFloat(tournamentForm.cashOut) || 0,
      };
      
      await api.post('/api/tournaments', data);
      
      // Resetar form e recarregar dados
      setTournamentForm({
        name: '',
        buyIn: '',
        cashOut: '',
      });
      setShowAddTournament(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao adicionar torneio');
    }
  };

  // Definir banca inicial
  const handleSetBankroll = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/bankroll', {
        saldoInicial: parseFloat(bankrollForm.saldoInicial)
      });
      
      setBankrollForm({ saldoInicial: '' });
      setShowSetBankroll(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao definir banca');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Poker Bankroll Management</h1>
            <p>Olá, {user?.name}!</p>
          </div>
          <button onClick={logout} className="logout-button">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        {/* Banca Atual */}
<div className="stat-card bankroll-card">
  <div className="stat-header">
    <DollarSign className="stat-icon" />
    <span className="stat-label">Banca Atual</span>
  </div>
  <div className="stat-value">
    {formatCurrency(bankroll?.currentBalance || 0)}
  </div>
  <button 
    className="action-button"
    onClick={() => setShowSetBankroll(true)}
  >
    {!bankroll || bankroll.initialBalance === 0 ? 'Definir Banca Inicial' : 'Redefinir Banca'}
  </button>
</div>
        

        {/* ROI */}
        <div className="stat-card">
          <div className="stat-header">
            <TrendingUp className="stat-icon" />
            <span className="stat-label">ROI</span>
          </div>
          <div className={`stat-value ${stats?.roi >= 0 ? 'positive' : 'negative'}`}>
            {stats?.roi || 0}%
          </div>
        </div>

        {/* ITM */}
        <div className="stat-card">
          <div className="stat-header">
            <Trophy className="stat-icon" />
            <span className="stat-label">ITM</span>
          </div>
          <div className="stat-value">
            {stats?.itm || 0}%
          </div>
        </div>

        {/* Lucro/Prejuízo */}
        <div className="stat-card">
          <div className="stat-header">
            <BarChart3 className="stat-icon" />
            <span className="stat-label">Lucro/Prejuízo</span>
          </div>
          <div className={`stat-value ${stats?.profit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(stats?.profit || 0)}
          </div>
        </div>
      </div>

      {/* Seção de Torneios */}
      <div className="tournaments-section">
        <div className="section-header">
          <h2>Últimos Torneios</h2>
          <button 
            className="add-button"
            onClick={() => setShowAddTournament(true)}
          >
            <Plus size={20} />
            Adicionar Torneio
          </button>
        </div>

        {tournaments.length > 0 ? (
          <div className="tournaments-list">
            {tournaments.map((tournament) => (
              <div key={tournament._id} className="tournament-item">
                <div className="tournament-info">
                  <h3>{tournament.name}</h3>
                  <span className="tournament-date">
                    {new Date(tournament.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="tournament-values">
                  <span className="buy-in">Buy-in: {formatCurrency(tournament.buyIn)}</span>
                  <span className="cash-out">Cash-out: {formatCurrency(tournament.cashOut)}</span>
                  <span className={`profit ${tournament.cashOut - tournament.buyIn >= 0 ? 'positive' : 'negative'}`}>
                    {tournament.cashOut - tournament.buyIn >= 0 ? '+' : ''}
                    {formatCurrency(tournament.cashOut - tournament.buyIn)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Trophy size={48} />
            <p>Nenhum torneio registrado ainda</p>
            <button 
              className="action-button"
              onClick={() => setShowAddTournament(true)}
            >
              Adicionar seu primeiro torneio
            </button>
          </div>
        )}
      </div>

      {/* Modal Adicionar Torneio */}
      {showAddTournament && (
        <div className="modal-overlay" onClick={() => setShowAddTournament(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Torneio</h2>
            <form onSubmit={handleAddTournament}>
              <div className="form-group">
                <label>Nome do Torneio</label>
                <input
                  type="text"
                  value={tournamentForm.name}
                  onChange={(e) => setTournamentForm({...tournamentForm, name: e.target.value})}
                  required
                  placeholder="Ex: Sunday Million"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Buy-in (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tournamentForm.buyIn}
                    onChange={(e) => setTournamentForm({...tournamentForm, buyIn: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Cash-out (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tournamentForm.cashOut}
                    onChange={(e) => setTournamentForm({...tournamentForm, cashOut: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowAddTournament(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Definir Banca */}
      {showSetBankroll && (
        <div className="modal-overlay" onClick={() => setShowSetBankroll(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Definir Banca Inicial</h2>
            <form onSubmit={handleSetBankroll}>
              <div className="form-group">
                <label>Valor da Banca (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bankrollForm.saldoInicial}
                  onChange={(e) => setBankrollForm({...bankrollForm, saldoInicial: e.target.value})}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowSetBankroll(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Definir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
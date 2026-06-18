-- PolyAlpha Lab schema (Postgres/Supabase). Generated from src/lib/db/schema.ts.
-- Research tool only. Paper trading only. Not financial advice.

CREATE TABLE IF NOT EXISTS experiment_runs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'RUNNING',
  starting_bankroll REAL NOT NULL,
  start_at TEXT NOT NULL,
  planned_end_at TEXT NOT NULL,
  ended_at TEXT,
  current_day INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS api_health_checks (
  id TEXT PRIMARY KEY,
  host TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  ok INTEGER NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  error TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cron_heartbeats (
  id TEXT PRIMARY KEY,
  job TEXT NOT NULL,
  ok INTEGER NOT NULL,
  duration_ms INTEGER,
  detail TEXT,
  source TEXT NOT NULL DEFAULT 'cron',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  slug TEXT,
  question TEXT NOT NULL,
  category TEXT,
  yes_token_id TEXT,
  no_token_id TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  closed INTEGER NOT NULL DEFAULT 0,
  end_date TEXT,
  volume REAL,
  liquidity REAL,
  source TEXT NOT NULL DEFAULT 'gamma',
  data_quality_score REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS market_snapshots (
  id TEXT PRIMARY KEY,
  market_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  yes_price REAL,
  best_bid REAL,
  best_ask REAL,
  spread REAL,
  volume REAL,
  liquidity REAL,
  active INTEGER,
  closed INTEGER,
  source TEXT NOT NULL DEFAULT 'gamma',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS market_prices (
  id TEXT PRIMARY KEY,
  market_id TEXT NOT NULL,
  token_id TEXT,
  ts INTEGER NOT NULL,
  price REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'clob',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS market_orderbooks (
  id TEXT PRIMARY KEY,
  market_id TEXT NOT NULL,
  token_id TEXT,
  ts TEXT NOT NULL,
  best_bid REAL,
  best_ask REAL,
  midpoint REAL,
  spread REAL,
  bid_depth REAL,
  ask_depth REAL,
  book_json TEXT,
  source TEXT NOT NULL DEFAULT 'clob',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS market_relationships (
  id TEXT PRIMARY KEY,
  market_a TEXT NOT NULL,
  market_b TEXT NOT NULL,
  relation TEXT NOT NULL,
  strength REAL,
  source TEXT NOT NULL DEFAULT 'derived',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS traders (
  id TEXT PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  handle TEXT,
  rank INTEGER,
  pnl REAL,
  volume REAL,
  source TEXT NOT NULL DEFAULT 'leaderboard',
  data_quality_score REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS trader_snapshots (
  id TEXT PRIMARY KEY,
  trader_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  rank INTEGER,
  pnl REAL,
  volume REAL,
  source TEXT NOT NULL DEFAULT 'leaderboard',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trader_positions (
  id TEXT PRIMARY KEY,
  trader_id TEXT NOT NULL,
  market_id TEXT NOT NULL,
  side TEXT,
  size REAL,
  avg_price REAL,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'data-api',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trader_activity (
  id TEXT PRIMARY KEY,
  trader_id TEXT NOT NULL,
  market_id TEXT,
  type TEXT,
  side TEXT,
  size REAL,
  price REAL,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'data-api',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallet_scores (
  id TEXT PRIMARY KEY,
  trader_id TEXT NOT NULL,
  address TEXT NOT NULL,
  score REAL NOT NULL,
  hit_rate REAL,
  avg_forward_return REAL,
  sample_size INTEGER,
  diversity REAL,
  drawdown REAL,
  recency REAL,
  consistency REAL,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'derived',
  data_quality_score REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS strategy_signals (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  strategy TEXT NOT NULL,
  market_id TEXT NOT NULL,
  side TEXT NOT NULL,
  score REAL NOT NULL,
  confidence REAL NOT NULL,
  rationale TEXT,
  evidence TEXT,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'strategy-engine',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ensemble_signals (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  market_id TEXT NOT NULL,
  side TEXT NOT NULL,
  ensemble_score REAL NOT NULL,
  top_strategy TEXT,
  eligible INTEGER NOT NULL,
  reasons TEXT,
  contributions TEXT,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'ensemble',
  data_quality_score REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paper_positions (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  strategy TEXT NOT NULL,
  market_id TEXT NOT NULL,
  question TEXT,
  category TEXT,
  side TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  entry_price REAL NOT NULL,
  shares REAL NOT NULL,
  cost REAL NOT NULL,
  entry_spread REAL,
  entry_slippage REAL,
  entry_liquidity REAL,
  signal_score REAL,
  risk_score REAL,
  peak_value REAL,
  stop_price REAL,
  take_price REAL,
  current_price REAL,
  current_value REAL,
  unrealized_pl REAL,
  realized_pl REAL,
  exit_price REAL,
  exit_reason TEXT,
  evidence TEXT,
  opened_at TEXT NOT NULL,
  closed_at TEXT,
  source TEXT NOT NULL DEFAULT 'paper-engine',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS paper_trade_events (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  position_id TEXT NOT NULL,
  type TEXT NOT NULL,
  price REAL,
  shares REAL,
  pl REAL,
  reason TEXT,
  detail TEXT,
  ts TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'paper-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_snapshots (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  exposure_pct REAL,
  category_exposure TEXT,
  correlated_exposure REAL,
  worst_case_loss REAL,
  drawdown_pct REAL,
  limits_ok INTEGER,
  detail TEXT,
  source TEXT NOT NULL DEFAULT 'risk-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  cash REAL NOT NULL,
  open_value REAL NOT NULL,
  total_value REAL NOT NULL,
  realized_pl REAL NOT NULL,
  unrealized_pl REAL NOT NULL,
  open_positions INTEGER NOT NULL,
  exposure_pct REAL NOT NULL,
  total_return_pct REAL NOT NULL,
  max_drawdown_pct REAL NOT NULL,
  win_rate REAL NOT NULL,
  sharpe_like REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'paper-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS baseline_positions (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  baseline TEXT NOT NULL,
  market_id TEXT,
  side TEXT,
  entry_price REAL,
  shares REAL,
  cost REAL,
  status TEXT DEFAULT 'OPEN',
  exit_price REAL,
  realized_pl REAL,
  opened_at TEXT NOT NULL,
  closed_at TEXT,
  source TEXT NOT NULL DEFAULT 'baseline-engine',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS baseline_snapshots (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  baseline TEXT NOT NULL,
  ts TEXT NOT NULL,
  total_value REAL NOT NULL,
  total_return_pct REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'baseline-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_reports (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  day INTEGER NOT NULL,
  ts TEXT NOT NULL,
  summary TEXT,
  metrics TEXT,
  source TEXT NOT NULL DEFAULT 'report-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS final_reports (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  verdict TEXT,
  summary TEXT,
  metrics TEXT,
  lessons TEXT,
  v2_roadmap TEXT,
  source TEXT NOT NULL DEFAULT 'report-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS self_learning_updates (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  strategy TEXT,
  field TEXT NOT NULL,
  old_value REAL,
  new_value REAL,
  reason TEXT,
  sample_size INTEGER,
  source TEXT NOT NULL DEFAULT 'learning-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_state (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  strategy TEXT NOT NULL,
  weight REAL NOT NULL,
  threshold REAL NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  trades INTEGER NOT NULL DEFAULT 0,
  realized_pl REAL NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT,
  source TEXT NOT NULL DEFAULT 'learning-engine',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS system_logs (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  scope TEXT,
  message TEXT NOT NULL,
  detail TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_market_snapshots_market ON market_snapshots(market_id, ts);
CREATE INDEX IF NOT EXISTS idx_market_prices_market ON market_prices(market_id, ts);
CREATE INDEX IF NOT EXISTS idx_orderbooks_market ON market_orderbooks(market_id, ts);
CREATE INDEX IF NOT EXISTS idx_strategy_signals_exp ON strategy_signals(experiment_id, ts);
CREATE INDEX IF NOT EXISTS idx_ensemble_signals_exp ON ensemble_signals(experiment_id, ts);
CREATE INDEX IF NOT EXISTS idx_paper_positions_exp ON paper_positions(experiment_id, status);
CREATE INDEX IF NOT EXISTS idx_trade_events_pos ON paper_trade_events(position_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_snap_exp ON portfolio_snapshots(experiment_id, ts);
CREATE INDEX IF NOT EXISTS idx_baseline_snap_exp ON baseline_snapshots(experiment_id, baseline, ts);
CREATE INDEX IF NOT EXISTS idx_strategy_state_exp ON strategy_state(experiment_id, strategy);
CREATE INDEX IF NOT EXISTS idx_logs_created ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_heartbeats_job ON cron_heartbeats(job, created_at);

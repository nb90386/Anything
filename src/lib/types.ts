/** Domain types for PolyAlpha Lab. Paper trading only. Not financial advice. */

export type StrategyId =
  | "TOP_TRADER_CONSENSUS"
  | "SMART_WALLET_MOMENTUM"
  | "ORDERBOOK_IMBALANCE"
  | "MOMENTUM_BREAKOUT"
  | "MEAN_REVERSION"
  | "RESOLUTION_DRIFT"
  | "CROSS_MARKET_CONSISTENCY"
  | "LIQUIDITY_SPREAD_FADE"
  | "NEWS_EVENT_REACTION"
  | "ENSEMBLE";

export const STRATEGIES: StrategyId[] = [
  "TOP_TRADER_CONSENSUS",
  "SMART_WALLET_MOMENTUM",
  "ORDERBOOK_IMBALANCE",
  "MOMENTUM_BREAKOUT",
  "MEAN_REVERSION",
  "RESOLUTION_DRIFT",
  "CROSS_MARKET_CONSISTENCY",
  "LIQUIDITY_SPREAD_FADE",
  "NEWS_EVENT_REACTION",
];

export const STRATEGY_META: Record<StrategyId, { label: string; short: string }> = {
  TOP_TRADER_CONSENSUS: { label: "Top-Trader Consensus", short: "Consensus" },
  SMART_WALLET_MOMENTUM: { label: "Smart-Wallet Momentum", short: "SmartWallet" },
  ORDERBOOK_IMBALANCE: { label: "Order-Book Imbalance", short: "BookImbal" },
  MOMENTUM_BREAKOUT: { label: "Momentum / Breakout", short: "Momentum" },
  MEAN_REVERSION: { label: "Mean Reversion", short: "MeanRev" },
  RESOLUTION_DRIFT: { label: "Resolution Drift", short: "ResDrift" },
  CROSS_MARKET_CONSISTENCY: { label: "Cross-Market Consistency", short: "CrossMkt" },
  LIQUIDITY_SPREAD_FADE: { label: "Liquidity / Spread Fade", short: "SpreadFade" },
  NEWS_EVENT_REACTION: { label: "News / Event Reaction", short: "NewsReact" },
  ENSEMBLE: { label: "Ensemble Meta-Strategy", short: "Ensemble" },
};

export type Side = "YES" | "NO";

export interface NormalizedMarket {
  id: string; // conditionId or gamma id
  question: string;
  slug: string;
  category: string;
  yesTokenId: string | null;
  noTokenId: string | null;
  active: boolean;
  closed: boolean;
  endDate: string | null;
  volume: number;
  liquidity: number;
  // microstructure snapshot
  yesPrice: number | null; // midpoint of YES [0..1]
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
  source: string;
  dataQuality: number; // 0..1
}

export interface OrderBookLevel {
  price: number;
  size: number;
}
export interface NormalizedBook {
  tokenId: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestBid: number | null;
  bestAsk: number | null;
  midpoint: number | null;
  spread: number | null;
  bidDepth: number;
  askDepth: number;
  source: string;
  dataQuality: number;
}

export interface PricePoint {
  t: number; // unix seconds
  p: number; // price [0..1]
}

export interface StrategySignal {
  strategy: StrategyId;
  marketId: string;
  side: Side;
  score: number; // 0..1 raw strategy conviction
  confidence: number; // 0..1
  evidence: Record<string, unknown>;
  rationale: string;
}

export interface EnsembleSignal {
  marketId: string;
  side: Side;
  ensembleScore: number; // 0..1 weighted blend
  contributions: { strategy: StrategyId; weight: number; score: number }[];
  eligible: boolean;
  reasons: string[]; // accept/reject reasons
  topStrategy: StrategyId;
}

export type PositionStatus = "OPEN" | "CLOSED";
export type ExitReason =
  | "MARKET_RESOLVED"
  | "STOP_LOSS"
  | "TAKE_PROFIT"
  | "TRAILING_STOP"
  | "SIGNAL_DECAY"
  | "STALE_DATA"
  | "LIQUIDITY_GONE"
  | "STRATEGY_DISABLED"
  | "EXPERIMENT_END"
  | "MANUAL";

export interface PaperPosition {
  id: string;
  experiment_id: string;
  strategy: StrategyId | "ENSEMBLE";
  market_id: string;
  question: string;
  category: string;
  side: Side;
  status: PositionStatus;
  entry_price: number;
  shares: number;
  cost: number; // entry_price * shares (paper USD deployed)
  entry_spread: number;
  entry_slippage: number;
  entry_liquidity: number;
  signal_score: number;
  risk_score: number;
  peak_value: number;
  stop_price: number;
  take_price: number;
  current_price: number | null;
  current_value: number | null;
  unrealized_pl: number | null;
  realized_pl: number | null;
  exit_price: number | null;
  exit_reason: ExitReason | null;
  evidence: string; // JSON
  opened_at: string;
  closed_at: string | null;
  source: string;
}

export interface PortfolioSnapshot {
  experiment_id: string;
  ts: string;
  cash: number;
  open_value: number;
  total_value: number;
  realized_pl: number;
  unrealized_pl: number;
  open_positions: number;
  exposure_pct: number;
  total_return_pct: number;
  max_drawdown_pct: number;
  win_rate: number;
  sharpe_like: number;
}

export interface ExperimentRun {
  id: string;
  status: "RUNNING" | "PAUSED" | "COMPLETED";
  starting_bankroll: number;
  start_at: string;
  planned_end_at: string;
  ended_at: string | null;
  current_day: number;
  source: string;
}

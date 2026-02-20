const marketsBySport = {
  Football: ['home', 'draw', 'away'],
  Basketball: ['home', 'away'],
  Tennis: ['home', 'away']
};

const MIN_ODD = 1.01;
const MAX_ODD = 15;

function nextOdd(currentValue) {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const step = (Math.floor(Math.random() * 9) + 1) / 100;
  const nextValue = currentValue + direction * step;
  return Math.max(MIN_ODD, Math.min(MAX_ODD, Number(nextValue.toFixed(2))));
}

export function startMockOddsStream({ matches, onUpdate, intervalMs = 1400, onDisconnect }) {
  const timerId = globalThis.setInterval(() => {
    if (!Array.isArray(matches) || matches.length === 0) {
      return;
    }

    const match = matches[Math.floor(Math.random() * matches.length)];
    const markets = marketsBySport[match.sport] ?? ['home', 'away'];
    const market = markets[Math.floor(Math.random() * markets.length)];

    onUpdate({
      matchId: match.id,
      market,
      value: nextOdd(match.odds[market])
    });
  }, intervalMs);

  return () => {
    globalThis.clearInterval(timerId);
    if (typeof onDisconnect === 'function') {
      onDisconnect();
    }
  };
}

export function buildWeeklyInsights(dailyRows = [], sessionRows = []) {
  const totalScore = dailyRows.reduce((sum, day) => sum + day.total_score, 0);
  const activeDays = dailyRows.filter((day) => day.total_score > 0).length;

  const bestDay = dailyRows.reduce(
    (best, day) => (day.total_score > (best?.total_score ?? -1) ? day : best),
    null
  );

  const categoryMap = sessionRows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalScore,
    activeDays,
    consistencyScore: Math.round((activeDays / 7) * 100),
    bestDay: bestDay
      ? {
          date: bestDay.score_date,
          score: bestDay.total_score
        }
      : null,
    topCategory
  };
}

export function buildCategoryBreakdown(sessionRows = []) {
  const byCategory = sessionRows.reduce((acc, row) => {
    const cat = row.category || "custom";
    if (!acc[cat]) acc[cat] = { count: 0, minutes: 0 };
    acc[cat].count += 1;
    acc[cat].minutes += row.duration_minutes || 0;
    return acc;
  }, {});

  return Object.entries(byCategory)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function buildContributionForecast(currentScore, projectedSessionScore) {
  const projectedTotal = currentScore + projectedSessionScore;
  let projectedLevel = 0;
  if (projectedTotal > 0) projectedLevel = 1;
  if (projectedTotal > 2) projectedLevel = 2;
  if (projectedTotal > 5) projectedLevel = 3;
  if (projectedTotal > 8) projectedLevel = 4;

  return {
    projectedTotal,
    projectedLevel
  };
}

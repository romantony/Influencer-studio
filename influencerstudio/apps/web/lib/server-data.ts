export async function getDashboardSummary() {
  // Mock summary for now; in real app we would call Convex functions.
  return {
    metrics: [
      { label: 'Followers gained', value: '1.2k', trend: '+12% vs last week' },
      { label: 'Avg. engagement', value: '5.4%', trend: '+1.1% vs benchmark' },
      { label: 'Scheduled posts', value: 8, trend: 'Next publish in 2h' },
      { label: 'Avatar variants', value: 12, trend: '3 new this week' }
    ]
  };
}

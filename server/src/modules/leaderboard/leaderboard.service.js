import { prisma } from '../../prisma/client.js';

function badgeFor(rank) {
  if (rank === 1) return 'Gold';
  if (rank === 2) return 'Silver';
  if (rank === 3) return 'Bronze';
  return 'Hero';
}

export async function getLeaderboard(currentUser) {
  const grouped = await prisma.complaint.groupBy({
    by: ['citizenId'],
    _count: { id: true },
    where: { status: { in: ['RESOLVED', 'CLOSED'] } },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((item) => item.citizenId) } },
    select: { id: true, name: true },
  });
  const userById = new Map(users.map((user) => [user.id, user]));

  const leaders = grouped.map((item, index) => ({
    rank: index + 1,
    userId: item.citizenId,
    name: userById.get(item.citizenId)?.name || 'Citizen',
    reports: item._count.id,
    points: item._count.id * 100,
    badge: badgeFor(index + 1),
  }));

  const current = leaders.find((leader) => leader.userId === currentUser.id);
  return {
    leaders,
    me: current || { rank: null, points: 0, reports: 0, badge: 'Starter' },
  };
}

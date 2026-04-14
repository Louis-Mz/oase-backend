export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const topUsers = await prisma.users.findMany({
      orderBy: { u_score: 'desc' },
      take: limit,
      select: {
        u_id: true,
        u_name: true,
        u_score: true
      }
    });

    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req: any, res: any, next: any) => {
  const auth = req.get && req.get('authorization');
  if (!auth) return res.status(401).json({ error: 'No se proporcionó token' });
  const parts = (auth as string).split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });
  const token = parts[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    (req as any).userId = payload.id;
    next();
  } catch (err) {
  res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export default authMiddleware;

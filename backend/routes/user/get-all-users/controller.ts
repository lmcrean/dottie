import { Response } from 'express';
import User from '../../../models/user/User.js';
import { AuthenticatedRequest } from '../../types.js';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.getAll();

    // Remove sensitive information from all users
    const sanitizedUsers = users.map((user: any) => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export default { getAllUsers };


import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

export const signup = async (req: Request, res: Response) => {
  try {
    const { phone_number, full_name, password, role } = req.body;
    
    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Default role is farmer
    const userRole = role === 'agronomist' ? 'agronomist' : 'farmer';

    const newUser = await query(
      'INSERT INTO users (phone_number, full_name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, phone_number, role',
      [phone_number, full_name, hashedPassword, userRole]
    );

    // In a real app, send OTP here via SMS provider
    console.log(`OTP sent to ${phone_number}: 123456 (MOCKED)`);

    res.status(201).json({ message: 'User created. Please verify OTP.', userId: newUser.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone_number, otp } = req.body;
  
  // Mock OTP verification
  if (otp !== '123456') return res.status(400).json({ error: 'Invalid OTP' });

  try {
    const result = await query(
      'UPDATE users SET is_verified = TRUE WHERE phone_number = $1 RETURNING id, role, full_name',
      [phone_number]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone_number, password } = req.body;
    const result = await query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);

    if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = result.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });

    if (!user.is_verified) return res.status(403).json({ error: 'Account not verified' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, full_name: user.full_name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

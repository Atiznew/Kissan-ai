
import express from 'express';
import { signup, verifyOtp, login } from '../controllers/authController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { query } from '../config/db';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // In prod, use memoryStorage and pipe to GCS

// Auth Routes
router.post('/auth/signup', signup);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/login', login);

// Fields Routes
router.get('/fields', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM fields WHERE user_id = $1', [req.user?.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error fetching fields' }); }
});

router.post('/fields', authenticateToken, async (req, res) => {
  const { name, location_lat, location_lng, area_acres, soil_type, irrigation_source } = req.body;
  try {
    const result = await query(
      'INSERT INTO fields (user_id, name, location_lat, location_lng, area_acres, soil_type, irrigation_source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user?.id, name, location_lat, location_lng, area_acres, soil_type, irrigation_source]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error adding field' }); }
});

// Observations (Image Upload)
router.post('/fields/:fieldId/observations', authenticateToken, upload.single('image'), async (req, res) => {
  const { fieldId } = req.params;
  // In a real implementation: Upload req.file to GCS/S3 here and get URL
  const imageUrl = `https://storage.googleapis.com/krishi-bucket/mock-image-${Date.now()}.jpg`; 
  
  try {
    const result = await query(
      'INSERT INTO observations (field_id, image_url, status) VALUES ($1, $2, $3) RETURNING *',
      [fieldId, imageUrl, 'pending']
    );
    // Trigger Async AI Job here (e.g. PubSub message)
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error saving observation' }); }
});

// Market Prices (Public)
router.get('/market-prices', async (req, res) => {
  try {
    const result = await query('SELECT * FROM market_prices ORDER BY date DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error fetching prices' }); }
});

export default router;


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import apiRoutes from './routes/api';

const app = express();
const swaggerDocument = yaml.load('./openapi.yaml');

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1', apiRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

export default app;

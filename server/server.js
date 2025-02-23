// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Form } from './models/Form.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            workspaces: [{ name: 'My First Workspace' }]
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                workspaces: user.workspaces
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                workspaces: user.workspaces
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Form Routes
app.post('/api/forms', authenticateToken, async (req, res) => {
    try {
        const formData = {
            ...req.body,
            userId: req.user.userId,
            id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const form = new Form(formData);
        await form.save();

        res.status(201).json(form);
    } catch (error) {
        console.error('Form creation error:', error);
        res.status(500).json({ message: 'Error creating form', error: error.message });
    }
});

app.get('/api/forms', authenticateToken, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user.userId });
        res.json(forms);
    } catch (error) {
        console.error('Forms fetch error:', error);
        res.status(500).json({ message: 'Error fetching forms', error: error.message });
    }
});

app.get('/api/forms/:id', authenticateToken, async (req, res) => {
    try {
        const form = await Form.findOne({
            id: req.params.id,
            userId: req.user.userId
        });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Form fetch error:', error);
        res.status(500).json({ message: 'Error fetching form', error: error.message });
    }
});

app.put('/api/forms/:id', authenticateToken, async (req, res) => {
    try {
        const form = await Form.findOneAndUpdate(
            { id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Form update error:', error);
        res.status(500).json({ message: 'Error updating form', error: error.message });
    }
});

app.delete('/api/forms/:id', authenticateToken, async (req, res) => {
    try {
        const form = await Form.findOneAndDelete({
            id: req.params.id,
            userId: req.user.userId
        });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Form deletion error:', error);
        res.status(500).json({ message: 'Error deleting form', error: error.message });
    }
});

// Public form access
app.get('/api/public/forms/:shareableLink', async (req, res) => {
    try {
        const form = await Form.findOne({
            shareableLink: req.params.shareableLink,
            status: 'published'
        });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Public form fetch error:', error);
        res.status(500).json({ message: 'Error fetching form', error: error.message });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running properly' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});
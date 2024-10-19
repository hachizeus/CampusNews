const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MotalkNews'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Middleware to verify JWT or Google token
async function verifyAuthToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    const googleToken = req.body.token;

    // Check for Google token in the request body
    if (googleToken) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            req.googleUser = payload; // Save Google user information
            req.userId = payload.sub; // Google 'sub' is the user ID
            return next(); // Proceed to the next middleware
        } catch (error) {
            return res.status(403).json({ message: 'Invalid Google token' });
        }
    }

    // Check for JWT in the Authorization header
    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            } else {
                req.authData = authData; // Attach the decoded JWT data
                req.userId = authData.userId; // Attach userId from JWT
                return next(); // Proceed to the next middleware
            }
        });
    } else {
        // If no token is provided, return a 403 status
        return res.status(403).json({ message: 'Token is required' });
    }
}


// Signup route
app.post('/signup', async (req, res) => {
    const { full_name, email, password, role = 'user' } = req.body; // Default role is 'user'

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)', 
        [full_name, email, hashedPassword, role], 
        (error, results) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1h', // Adjust the expiration time as needed
                });
                res.json({ message: 'Login successful', user, token });
            } else {
                res.status(400).json({ message: 'Invalid password' });
            }
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Google Login route
app.post('/google-login', verifyAuthToken, (req, res) => {
    const { email, sub } = req.googleUser;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(400).json({ error: 'Database error' });
        }
    
        console.log('Database results:', results); // Log results from the database query
    
        if (results.length === 0) {
            console.warn('No user found with this email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        const user = results[0];
        console.log('User found:', user); // Log the user object
    
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.warn('Password does not match for user:', user.email);
                return res.status(401).json({ message: 'Invalid email or password' });
            }
    
            // Generate JWT token
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Send a filtered version of the user object with relevant fields
            const { id, email, role } = user; // Destructure to get specific fields
    
            
    
            res.status(200).json({ message: 'Login successful', token, user: { id, email, role } });
        } catch (err) {
            console.error('Password comparison error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
    
});



// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.100.23:${PORT}`);
});

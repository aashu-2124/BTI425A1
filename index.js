/********************************************************************************* 
 * BTI425 – Assignment 1** I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *  Name: Aastha Kalpeshkumar Patel Student ID: 118841220 Date: 18 January 2024
 * Published URL: https://colorful-tuna-outfit.cyclic.app/
 *********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ListingsDB = require('./modules/listingsDB.js');

dotenv.config(); //Loads enviorment variables from .env file

const app = express();
const HTTP_PORT = 3000;

//MiddleWare
app.use(cors());  // to get resource from a different origin or url
app.use(express.json()); // Enablesparsing of JSON in the request body

const db = new ListingsDB();

//Routes
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        // Routes
        // POST /api/listings
        app.post('/api/listings', async (req, res) => {
            try {
                const newListing = await db.addNewListing(req.body);
                res.status(201).json(newListing);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // GET /api/listings
        app.get('/api/listings', async (req, res) => {
            try {
                const { page, perPage, name } = req.query;
                const listings = await db.getAllListings(page, perPage, name);
                res.json(listings);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // GET /api/listings/:id
        app.get('/api/listings/:id', async (req, res) => {
            try {
                const listing = await db.getListingById(req.params.id);
                if (!listing) {
                    res.status(404).json({ error: 'Listing not found' });
                } else {
                    res.json(listing);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // PUT /api/listings/:id
        app.put('/api/listings/:id', async (req, res) => {
            try {
                const updatedListing = await db.updateListingById(req.body, req.params.id);
                if (!updatedListing) {
                    res.status(404).json({ error: 'Listing not found' });
                } else {
                    res.json({ message: 'Listing updated successfully' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        // DELETE /api/listings/:id
        app.delete('/api/listings/:id', async (req, res) => {
            try {
                const result = await db.deleteListingById(req.params.id);
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: 'Listing not found' });
                } else {
                    res.status(204).json({ message: 'Listing deleted successfully' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        //default route
        app.get('/', (req, res) => {
            res.json({ message: 'API Listening' });
        });
        //Start the server
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on http://localhost:${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1); // Exit with a non-zero code to indicate an error
    });

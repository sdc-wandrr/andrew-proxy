const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('newrelic');

const {carouselServiceURL, descriptionServiceURL, reviewServiceURL} = require('./services_config.js');
const app = express();
const PORT = 3030;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(`serving ${req.method} request for ${req.url}`);
  next();
});

// Initial index.html
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/hostels/:hostel_id', express.static(path.join(__dirname, '../public')));

// ReRoutes

// Image Carousel Service
app.use('/images/bundle.js', createProxyMiddleware({ target: carouselServiceURL, changeOrigin: true }));
app.use('/api/hostels/:hostel_id/images', createProxyMiddleware({ target: carouselServiceURL, changeOrigin: true }));

// Info Service
app.use('/info/bundle.js', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));
app.use('/api/house/:id/hostel', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));
app.use('/api/house/:id/description', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));
app.use('/api/house/:id/rules', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));
app.use('/api/house/:id/address', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));
app.use('/api/house/:id', createProxyMiddleware({ target: descriptionServiceURL, changeOrigin: true }));

// Reviews Service
app.use('/reviews/dist/bundle.js', createProxyMiddleware({ target: reviewServiceURL, changeOrigin: true }));
app.use('/hostels/:id/api/reviews', createProxyMiddleware({ target: reviewServiceURL, changeOrigin: true }));
app.use('/api/reviews', createProxyMiddleware({ target: reviewServiceURL, changeOrigin: true }));
app.use('/api/reviews/:id', createProxyMiddleware({ target: reviewServiceURL, changeOrigin: true }));

// availability service
// app.use('/api/hostel/:hostelId/rooms', createProxyMiddleware({ target: 'http://localhost:3009', changeOrigin: true }));

app.listen(PORT, () => console.log('Proxy Server listening on port ', PORT));

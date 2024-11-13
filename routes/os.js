var express = require('express');
var router = express.Router();
var os = require('os');

// Route to display OS information
router.get('/', function(req, res) {
  res.json({
    platform: os.platform(),
    architecture: os.arch(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    type: os.type()
  });
});

// Route to display CPU information
router.get('/cpus', function(req, res) {
    const cpus = os.cpus(); // Get CPU information
    res.json(cpus); // Send CPU info in JSON format
});

// Route to display information about a specific CPU by ID
router.get('/cpus/:id', function(req, res) {
    const cpus = os.cpus(); // Get CPU information
    const cpuId = parseInt(req.params.id); // Parse the ID from the URL
  
    // Check if the CPU ID is valid
    if (cpuId >= 0 && cpuId < cpus.length) {
      res.json(cpus[cpuId]); // Send the specific CPU info in JSON format
    } else {
      res.status(404).json({ error: 'CPU not found' }); // Handle invalid ID
    }
});

module.exports = router;
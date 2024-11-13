var express = require('express');
var router = express.Router();
var os = require('os');

// Route to display OS information
router.get('/', function(req, res) {
  res.json({
    platform: os.platform(),
    architecture: os.arch(),
    hostname: os.hostname(),
    uptime: os.uptime()
  });
});

module.exports = router;
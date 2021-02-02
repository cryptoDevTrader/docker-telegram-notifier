module.exports = {
  getEnvVar: function(varName) {
    let value = process.env[varName];
    if (typeof value == 'undefined') {
      value = "";
    }

    return value;
  },

  getHostDetails: function() {
    let hostDetails = "";
    if (module.exports.getEnvVar("DOCKER_HOSTNAME").length > 0) {
      hostDetails = `${module.exports.getEnvVar("DOCKER_HOSTNAME")} `;
    }
  
    if (module.exports.getEnvVar("DOCKER_IP_ADDRESS").length > 0) {
      hostDetails += `at ${module.exports.getEnvVar("DOCKER_IP_ADDRESS")}`;
    }

    return hostDetails.trim();
  }
}

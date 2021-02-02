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
    if (getEnvVar("DOCKER_HOSTNAME").length > 0) {
      hostDetails = `${getEnvVar("DOCKER_HOSTNAME")} `;
    }
  
    if (getEnvVar("DOCKER_IP_ADDRESS").length > 0) {
      hostDetails += `at ${getEnvVar("DOCKER_IP_ADDRESS")}`;
    }

    return hostDetails.trim();
  }
}

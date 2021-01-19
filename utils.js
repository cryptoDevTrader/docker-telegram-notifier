module.exports = {
  getEnvVar: function(varName) {
    let value = process.env[varName];
    if (typeof value == 'undefined') {
      value = "";
    }

    return value;
  }
}

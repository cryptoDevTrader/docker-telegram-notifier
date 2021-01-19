module.exports = {
    container_start: e =>
        `<b>Host:</b> ${dockerHost}\n<b>IP:</b> ${dockerIp}\n<b>Container:</b>$ {e.Actor.Attributes.name}\n<b>Image:</b> ${e.Actor.Attributes.image}\n</b>Has been started</b>`,

    container_die: e =>
        `<b>Host:</b> ${dockerHost}\n<b>IP:</b> ${dockerIp}\n<b>Container:</b>$ {e.Actor.Attributes.name}\n<b>Image:</b> ${e.Actor.Attributes.image}\n</b>Has been stopped</b>\n<b>Exit Code:</b> ${e.Actor.Attributes.exitCode}`,

    'container_health_status: healthy': e =>
        `Status <b>Healthy</b> for <b>${e.Actor.Attributes.name} (${e.Actor.Attributes.image})</b>`,

    'container_health_status: unhealthy': e =>
        `Status <b>Unhealthy</b> for <b>${e.Actor.Attributes.name} (${e.Actor.Attributes.image})</b>`,
};

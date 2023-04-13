const utils = require('./utils');
const Docker = require('dockerode');
const TelegramClient = require('./telegram');
const JSONStream = require('JSONStream');
const templates = require('./templates');

const { ONLY_WHITELIST } = process.env;
const docker = new Docker();
const telegram = new TelegramClient();

async function sendEvent(event) {
  // console.debug(event);
  const template = templates[`${event.Type}_${event.Action}`];
  if (template) {
    const label = event.Actor && event.Actor.Attributes && event.Actor.Attributes['telegram-notifier.monitor'];
    const shouldMonitor = label === undefined ? undefined : label.toLowerCase().trim() !== 'false';
    if (shouldMonitor || !ONLY_WHITELIST && shouldMonitor !== false) {
      const attachment = template(event);
      console.log(attachment, "\n");
      await telegram.send(attachment)
    }
  }
}

async function sendEventStream() {
  const eventStream = await docker.getEvents();
  eventStream.pipe(JSONStream.parse())
    .on('data', event => sendEvent(event).catch(handleError))
    .on('error', handleError);
}

async function sendVersion() {
  const version = await docker.version();

  let hostDetails = utils.getHostDetails();
  if (hostDetails.length > 0) {
    hostDetails += ` with docker `;
  }

  const text = `Connected to ${hostDetails}${version.Version} ${version.Arch}`;
  console.log(text, "\n");

  await telegram.send(text);
}

async function main() {
  await sendVersion();
  await sendEventStream();
}

async function healthcheck() {
  try {
    await docker.version();
  } catch (e) {
    console.error(e);
    console.error(`${utils.getHostDetails()}: Docker is unavailable`);
    process.exit(101);
  }

  try {
    console.log(await telegram.check());
  } catch (e) {
    console.error(e);
    console.error(`${utils.getHostDetails()}: Telegram API is unavailable`);
    process.exit(102);
  }

  console.log("OK");
  process.exit(0);
}

function handleError(e) {
  console.error(`${utils.getHostDetails()}: ${e}`);
  telegram.sendError(e).catch(console.error);
}

if (process.argv.includes("healthcheck")) {
  healthcheck();
} else {
  main().catch(handleError);
}

const exitCodes = {};

async function handleExit(exitCode) {
  if (!exitCodes[exitCode]) {
    exitCodes[exitCode] = true;
  } else {
    // Don't process same exit code more than once
    return;
  }

  if (exitCode || exitCode === 0) {
      if (exitCode.stack) {
          console.error(exitCode.stack);
      } else {
          console.error(`Shutting down: ${exitCode}`);
      }
  }

  const version = await docker.version();

  let hostDetails = utils.getHostDetails();
  if (hostDetails.length > 0) {
    hostDetails += ` with docker `;
  }

  const text = `Shutting down ${hostDetails}${version.Version} ${version.Arch}. Received ${exitCode}.`;
  console.log(text, "\n");

  await telegram.send(text);

  process.exit(0);
}

// Exit gracefully
process.on('exit', handleExit.bind(this));
process.on('SIGINT', handleExit.bind(this));
process.on('SIGUSR1', handleExit.bind(this));
process.on('SIGUSR2', handleExit.bind(this));
process.on('uncaughtException', handleExit.bind(this));
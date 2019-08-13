'use strict';

const log = require('npmlog');
const LogEntry = require('../utils/log-entry');

module.exports = function toResult(launcherId, err, code, runnerProcess, config, testContext) {
  let logs = [];
  let message = '';
  testContext = testContext ? testContext : {};

  if (err) {
    logs.push(
      new LogEntry('error', err.toString())
    );

    message += err + '\n';
  }

  if (testContext.name) {
    logs.push(
      new LogEntry('error', `Error while executing test: ${testContext.name}`)
    );

    message += `Error while executing test: ${testContext.name}\n`;
  }

  if (code !== 0) {
    logs.push(
      new LogEntry('error', `Non-zero exit code: ${code}`)
    );

    message += 'Non-zero exit code: ' + code + '\n';
  }

  if (runnerProcess && runnerProcess.stderr) {
    logs.push(
      new LogEntry('error', runnerProcess.stderr)
    );

    message += 'Stderr: \n ' + runnerProcess.stderr + '\n';
  }

  if (runnerProcess && runnerProcess.stdout) {
    logs.push(
      new LogEntry('log', runnerProcess.stdout)
    );

    message += 'Stdout: \n ' + runnerProcess.stdout + '\n';
  }

  if (config && config.get('debug')) {
    log.info(runnerProcess.name + '.stdout', runnerProcess.stdout);
    log.info(runnerProcess.name + '.stderr', runnerProcess.stderr);
  }

  let result = {
    failed: code === 0 && !err ? 0 : 1,
    passed: code === 0 && !err ? 1 : 0,
    name: 'error',
    testContext: testContext,
    launcherId: launcherId,
    logs: logs
  };
  if (!result.passed) {
    result.error = {
      message: message
    };
  }

  return result;
};

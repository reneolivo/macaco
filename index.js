const csvToJson = require('csvtojson');
const fs = require('fs');
const _ = require('lodash');
const nodemailer = require('nodemailer');

main().catch(console.error);

/**
 * Reads a list of email data stored in the emails.csv file, uses the index.html
 * file as a template, and sends an email to each one of the recipients defined
 * in the CSV file using the template file.
 */
async function main() {
  const config = getJsonContent('./config.json');
  const csvEmailsData = await getCsvRows('./emails.csv');
  const transporter = nodemailer.createTransport(config.smtp);
  const composedEmailData = getComposedEmailData(csvEmailsData, config);

  for (const [index, emailData] of composedEmailData.entries()) {
    try {
      const sendMailResponse = await transporter.sendMail(emailData);

      console.log(`✅ Success: ${emailData.to}`);
    } catch(exception) {
      console.log(`🚫 Failed: ${emailData.to}`);

      if (config.stopOnFailure) {
        process.exit();
      }
    }

    await sleep(config.delay);
  }
}

/**
 * Returns a list where each entry can be used for sending an email as expected by
 * Node Mailer. The following transformations are applied:
 *
 * - For the HTML field we use the `index.html` file as a template. The data coming
 *   from the CSV file serves as the variables for the template. If we define a "best_friend"
 *   header for the CSV file, we can use this as <%= best_friend => on the template. Refer to
 *   lodash templates.
 * - The subject is taken from the options, but it also accepts variable replacements
 *   coming from the CSV file.
 * - For the HTML message we automatically replace new lines with the BR HTML element.
 *
 * @param {object[]} emailsData a list of recipient data coming from the CSV file.
 * @param {object} options Some extra options like the subject template string and
 *   the To field used when sending the email.
 * @returns {object[]}
 */
function getComposedEmailData(emailsData, options) {
  const emailTemplate = fs.readFileSync('./index.html');
  const subjectTemplate = _.template(options.subject);

  return emailsData.map((emailData) => {
    const subject = subjectTemplate(emailData);
    const text = `${emailData.name} ${emailData.message}`;
    const htmlMessage = getNlToBr(emailData.message);
    const html = _.template(emailTemplate)({
      ...emailData,
      message: htmlMessage,
    });

    return {
      from: options.from,
      to: emailData.to,
      subject,
      text,
      html,
    };
  });
}

/**
 * Given a CSV file path, it returns a list of objects for each row.
 *
 * @param {string} csvPath Path to a CSV file.
 * @returns {object[]} a list of CSV rows defined as objects.
 */
function getCsvRows(csvPath) {
  return csvToJson()
    .fromFile(csvPath);
}

/**
 * Given a JSON file path, it returns a JSON object.
 *
 * @param {string} jsonPath Path to JSON file.
 * @returns {object} a JSON object.
 */
function getJsonContent(jsonPath) {
  const rawJson = fs.readFileSync(jsonPath);

  return JSON.parse(rawJson);
}

/**
 * Given a message string, it converts all new line characters into
 * BR HTML elements.
 *
 * @param {string} message The message to parse.
 * @return {string}
 */
function getNlToBr(message) {
  return (message || '').replace(/(?:\r\n|\r|\n)/g, '<br>');
}

/**
 * Returns a promise that is automatically resolved after the given delay number
 * has passed.
 *
 * @param {number} delay A delay number in milliseconds.
 * @return {Promise}
 */
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

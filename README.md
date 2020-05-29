# Macaco

!(Macaco)[./Macaco.png]

Macaco allows you to send emails to multiple contacts defined in a CSV
and use an HTML file as a template to send a custom message to each one of them.

## How to use

1 - Clone this repo.
2 - Run `npm install`. Make sure you are used the right NodeJS version. If you are
using [NVM](https://github.com/nvm-sh/nvm), you only need to run `nvm install` and `nvm use` to use the right version.
3 - Update the [emails.csv](./emails.csv) file to include the list of recipients.
Make sure to have a CSV header.
4 - Update the [config.json](./config.json) file with the right configuration for
your SMTP server information, etc.:
```json
{
  "delay": 3000, // Number of milliseconds to wait before sending a new email.
  "from": "Macaco 🐵 <macaco@example.com>", // The FROM email the users will see.
  "stopOnFailure": true, // Will stop sending emails if one of them fails.
  "subject": "Hey <%= name %>! you got news!", // A subject template.
  "smtp": { // SMTP host information. See Node Mailer for more information.
    "host": "smtp.gmail.com",
    "port": 465,
    "secure": true,
    "auth": {
      "user": "gmail@example.com",
      "pass": "12345678"
    }
  }
}
```
If you are using Gmail, make sure to read [Node Mailer guide](https://nodemailer.com/usage/using-gmail/).
5 - Update the [index.html](./index.html) template file to your liking. A good guide for HTML email templates can be found at [Mailchimp](https://templates.mailchimp.com/getting-started/html-email-basics/).
6 - Run `npm start` and watch it unfold.

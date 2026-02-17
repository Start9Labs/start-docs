---
title: "SMTP"
description: "Configure SMTP email credentials on StartOS so services can send notifications."
section: "startos/user-manual"
type: "guide"
keywords: ["smtp", "email", "notifications", "gmail", "amazon ses"]
---

# SMTP

> [!WARNING]
> This guide is _not_ for using StartOS as an email server. It is for granting StartOS the simple ability to _send_ emails through a 3rd party SMTP server.

## Use Case

Adding SMTP credentials to StartOS makes it possible for certain services to send email notifications. Many services, such as NextCloud, Vaultwarden, Gitea, and others expect to send emails and require SMTP credentials to send them.

## Getting SMTP Credentials

The guides below are for using Gmail, Amazon SES, or Proton Mail for SMTP, but you may also use another third party provider of your choice.

{{#tabs global="smtp-provider"}}

{{#tab name="Gmail"}}

1. Access your Google 2-step verification settings: https://myaccount.google.com/signinoptions/two-step-verification.

1. Enable 2-Step verification if not already.

1. Under "App Passwords" (bottom), add a new App Password.

1. Choose a name for the new App Password. You may call it anything, such as "SMTP", then click "Create".

1. A random 16-character password will be created and shown to you. This is your app password. Save it somewhere secure, such as your Vaultwarden password manager, then click "Done".

1. Now you can use this SMTP account for any service that has the capability to send an email. The table below shows all the details you may need:

   | Parameter  | Value                          |
   | ---------- | ------------------------------ |
   | Host       | smtp.gmail.com                 |
   | Port       | 587                            |
   | Encryption | TLS                            |
   | Username   | your-username@gmail.com        |
   | Password   | your App Password (from above) |

{{#endtab}}

{{#tab name="Amazon SES"}}

To use Amazon SES you will need:

- An Amazon Web Services (AWS) account. If you don't have one, you can [register here](https://aws.amazon.com/) for free.
- To set up Amazon Simple Email Service (SES) on AWS, from [inside your AWS](https://aws.amazon.com/ses) console, also free for a time within [certain limits](https://aws.amazon.com/ses/pricing/).
- Optional: To purchase your own domain name to send emails from, then add the domain records Amazon provides you. This will allow you to request 'Production Access' to send emails to unverified addresses (i.e. to more than just your own email address).

You can then refer to the [Amazon SES docs](https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html) to create a SMTP user.

{{#endtab}}

{{#tab name="Proton Mail"}}

Access to Proton Mail's SMTP settings is currently only made available by Proton to their customers with **Proton for Business**, as well as certain higher tier individual and family plans (**Proton Duo**, **Proton Family** – both with "SMTP Submission" as a listed feature), and then only when you point a custom domain to your account.

To set up Proton Mail for SMTP you will need:

- To purchase and point a domain name from a domain registrar to Proton's servers by following this guide here: [Custom Domain](https://proton.me/support/custom-domain)
- To follow the steps in the section **How to set up SMTP** in the guide here: [SMTP Submission](https://proton.me/support/smtp-submission)

{{#endtab}}

{{#endtabs}}

## Configuring StartOS

1. Navigate to `System > SMTP`

1. Enter your SMTP credentials and hit "Save".

1. On the same page, send yourself a test email. Remember to check your spam folder. If the email goes to spam, mark it as not spam.

1. For each service you want to use the credentials to send emails, go to the dashboard of that service, click "Actions", and locate the relevant action.

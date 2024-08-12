# Shift-Tracker

## Getting Started

Install dependencies, and run the development server:

```bash
npm ci
# process.env works without dotenv package & without NEXT_ prefix (in server side code)
# !!IMP : check .env.example on instructions about which variables
# you need to setup and naming convention
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pre-requisite knowledge

Bare minimum technology you need to familiar with:

- React.js (how the rendering cycle works)
- Async nature of javascript
- Optional Asset: if you're familar with Typescript & weird nature of Javascript
- Next.js : You need to be familiar with page/layout/default.tsx ..etc naming conventions of Nextjs.
- Git, somewhat basic knowledge of the workflow even if you're not familiar with Git-CLI
- Optional Tiny Asset: if you know the difference and relation between Git & Github.

### Recommended learning material

#### Nextjs
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

#### Git, and everything else

This paragraph is optional reading, if you want free good learning resources as a student.

For this, you'll need to connet your Github Account with your University provided email.
Also, if you're using an account made using University Email, make sure to add a secondary email (which can be your gmail/[proton-mail](https://proton.me/mail) account).
Basically have two email on your Github Accont (personal and university provided).

If you're a student, sigin to your Github Education Pack account, [signup if you don't have one](https://education.github.com/pack/join).
You'll need some form of validating your status as a student (more details on Github Website).

- Signup for Github Education Pack
- Signup for FrontEnd Masters, would reommend the whole platform but especially watch [The Hard Parts of Asynchronous JavaScript
 by Will Sentance](https://frontendmasters.com/courses/javascript-new-hard-parts/)


Next := Currently working on Deployment w/ Vercel
## Deployment Information (deployed on Vercel)
Each push in the branch pushes a deployment.
- There are 3 branches in this Github project, which have corresponding URLs that each branch pushes changes to.
- Format :`git-branch` : `{subdomain}.chiefjanitorial.com`(deployed url e.g. `staging.chiefjanitorial.com`) : purpose
- `dev`: `dev.chiefjanitorial.com` : For quick iterations when developing.
- `staging` : `staging.chiefjanitorial.com` : For sending final preview changes to client or anyone intermediatery - { 🚧 might be redundant with dev }

- `main` : 🚨PRODUCTION🚨 : `employeeshifts.chiefjanitorial.com` : Real users can access this URL

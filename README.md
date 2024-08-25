# Shift-Tracker

## Getting Started

**Primary Goal**: Give a playground for students to learn and then contribute.

*_Secondary goal_*: 
Learn your tools and AI tools for rapid deployment/development.

Hence I've also provided the resources helped me learn and build this project faster. Hopefully they'll help you as well. Now lets get started.

---

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
- Signup for FrontEnd Masters (whole platform is amazing🔥), but still recommendations below,
  - [The Hard Parts of Asynchronous JavaScript by Will Sentance](https://frontendmasters.com/courses/javascript-new-hard-parts/)


## Git Branches & Deploy Info (deployed on Vercel)

- `STAGING` branch - push to this branch when you want to test your changes outside localhost.
- STAGING URL [staging.chiefjanitorial.com](https://employeeshifts.chiefjanitorial.com/)


- 🚨DO NOT PUSH ANYTHING TO MAIN BRANCH🚨that isn't completed yet. 
  - Completed defined as, adds some functionality without breaking anything (i.e. you've tested it manually - until better solution)🚨
- 🚨BASICALLY `MAIN` branch - `keep this clean🥲`🚨



### BEFORE PUSHING
Make sure you can successfully run - `npm run build`<sup>[1]</sup>. 
_Especially_, if you want to see the changes in testing/staging URL.

<sup>[^1]</sup>Optional reading for Why provided below

Why? Well this is the "source code" - which is written using react/next so the browser/server can not understand this "coding-language(react)".
This source code needs to be converted to good old - HTML, CSS, JS(will use web-code to refer) so machine can understand.
The step to create this web-code is to run command `npm run build`.
After the web-code is created - this is put on the vercel server to run, and this becomes your website.
Which means - this steps needs to be successful.

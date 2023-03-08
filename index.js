#!/usr/bin/env node

import inquirer from "inquirer";
import shell from "shelljs";
import chalk from "chalk";
import fs from "fs";
import ProgressBar from "progress";

inquirer
  .prompt([
    {
      type: "list",
      name: "framework",
      message: "Which framework do you want to use?",
      choices: ["React"],
    },
  ])
  .then((answers) => {
    console.log(
      chalk.yellow(`Installing TailwindCSS for ${answers.framework}...`)
    );

    // Install TailwindCSS using npm with the  flag to suppress output
    shell.exec("npm install -D tailwindcss postcss autoprefixer ", {
      async: true,
      silent: true,
    });

    // Generate the config file
    shell.exec("npx tailwindcss init -p", { silent: true });

    // Add Tailwind directives to the CSS
    switch (answers.framework) {
      case "React":
        initReact();
        break;
      default:
        break;
    }

    console.log(chalk.green(`TailwindCSS has been successfully installed!`));
  });

const initReact = () => {
  const file = "src/App.css";
  const content = `@tailwind base;\n@tailwind components;\n@tailwind utilities;`;
  fs.writeFileSync(file, content);
  console.log(chalk.green(`TailwindCSS directives have been added to App.css`));
  const configPath = "tailwind.config.js";
  const config = fs.readFileSync(configPath, "utf8");
  const newConfig = config.replace(
    "content: []",
    `content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html']`
  );
  fs.writeFileSync(configPath, newConfig);
  console.log(
    chalk.green(
      `Added the paths to all  template files in tailwind.config.js file.`
    )
  );
};

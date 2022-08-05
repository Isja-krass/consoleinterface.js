> If you want things ramped up very quickly, this page might be interesting for you.
> This is a quickstart-guide i put together in fashion of an "step by step reference".
> But this is only the tip of the iceberg. If you want to dive deeper and learn about the possibilities
>  this module has to offer, i encourage you to read though the full wiki.
> I am quite new to this documentation thing, so pleas contact me if i missed something or it is written
> to complicated to understand.

**⚠️ NOTE**: A large part o the documentation has been rewritten but a small amount is still undocumented and will be added later.

 ! YOU WILL NEED BASIC UNDERSTANDING OF [NODE.js](https://nodejs.org/en/) AND [NPM](https://www.npmjs.com/) TO FOLLOW THIS GUIDE !

# STEP I - INSTALLATION PROCESS
There are two different ways to integrate this module into your project:

**⚠️ NOTE**: Due to technical issues with NPM, it is __currently not possible__ to run the well known
`npm install consoleinterface`. You had to install it manually.

#### METHOD 1: manual installation (into an NPM package structure)
1) Head over to the current project folder. For example: `cd /home/isja_krass/documents/your-project`
2) Move to the `node_modules` sub folder. For example: `cd ./node_modules`
3) Download-zip this repository and unzip it in this specific folder or clone it via the terminal: `git clone https://github.com/Isja-krass/consoleinterface`
4) Once the module is placed in the `node_modules` subfolder, go back to your peoject folder ans open the `package.json`
   with any text editor. Search for the `dependencies` entry and add the following line:
   ```json
    "consoleinterface": "^0.0.1",
   ```
5) Now open the file names `package-lock.json`, find the `packages` and `dependencies` entry.
   now add to each entry the following lines:
   ```json
    "consoleinterface": {
        "version": "^0.0.1"
    }
   ```

Now NPM should automaticly detect this module, and you can use it as usualy with the `require("consoleinterface")` syntax.
Remeber you need to update everything your self if a new version of this module is released!

#### METHOD 2: manual instalation (node project with custom structure)
1) Move to your current project folder. For example: `cd /home/isja_krass/documents/your-project`
2) Head over to whatever place you keep external modules. in my case: `cd ./src`
3) Download-zip this repository and unzip it in this speziffic folder or clone it via the terminal: `git clone https://github.com/Isja-krass/consoleinterface`

Now you should be able to use the module in this file.
Remeber you need to update everything your self if a new version of this module is released!


# STEP II - EMBED THE CONSOLE INTERFACE

The basic architecture of the module is a large class. If you installed the module correctly,
you can require the class with the `require()` syntax:

For the installation in a custom location:
```js
const consoleinterface = require("/path/to/the/module/consoleinterface.js");
```
**⚠️ NOTE**: This is only an example path!

For the NPM package structure:
```js
const consoleinterface = require("consoleinterface");
```

If you put one of this lines corresponding to your installation method in the top
region of your cuttent project index file (mostly named `index.js`), you shod be able to
access the class.


# STEP III - USING THE CONSOLE INTERFACE

#### Basic usage
As mentioned before, the whole module is a big class. To make a new console interface by creating an instance from
the `consoleinterface` class as shown below:
```js
const consoleinterface = require("consoleinterface"); // Require the module 
const interface0 = new consoleinterface();

```

We mow established the creation of a new `consoleinterface` named `interface0`. As the constructor has no 
parameters, default values will be passed to the new console interface.

To set options and alter behavior use this syntax to create a new instance:
`new consoleinterface(object:options)`The `options` parameter represents an object full of parameters, witch will override the defaults

for example:
```js
const consoleinterface = require("consoleinterface"); // Require the module 
const interface0 = new consoleinterface({
  useFormatting: false, // disable the use of ANSI-escape-code
  globalLogLevel: "warning", // set the global log level to Warning
});
```
There is quite a diversity of options. I recommend to have a look at the corresponding wiki article.

#### Basic Input / Output

Let's assume you want to output an simple text. In this example, a message that says, that the system was stared
successfully. You can do this by using the `log(*:mesage)` function from the `interface0`. This function is often used
to display simple messages and also write them to the log. If you don't want the written output to
appear in the log, use the `write(*message)` function.

In practice this could look like this
```js
interface0.log("System was stared successfully");
```

For gathering input from the console interface, there are three different functions.
- `getInputString()` For requesting a text input
- `getInputBool()` For requesting a boolean input (yes/no)
- `getInputInt()` For requesting a numeric input.

If any of this functions are called, a prompt in the console will show up and requesting the operator, to give an input.
The input will be the return value of the function

**⚠️ NOTE**: The whole consoleinterface process will halt, until an input is provided or the operation is aborted.
 



#### Visualization Elements


#### Working with Webhooks and Logfiles


# GOING FURTHER







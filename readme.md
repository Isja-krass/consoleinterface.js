> THE GITHUB REPO IS CURRENTLY AHEAD OF THE NPM-PACKAGE.

# CONSOLEINTERFACE

## WHAT DOES, IT AND HOW TO USE IT?
#### Orign
The consoleinterface++ was originally part of the PAUL (**P**roject **A**utomated **U**ser **L**ibary) Toolkit.
This modules purpose was to provide, a simple, termial-style interface for the user to read error, warning
and status messages or providing some input.

However this module, natively written in [c++](https://cplusplus.com/), was ported to javascript to work with
[Node.js](https://nodejs.org/en/)-based applications and packages. Also some new functions were added, such as logging into a 
text file or working with webhooks.

#### Features and capabilities
This module is desinged to:
- 💻 Display simple warning, error and status messages on the screen
- 📊 log-levels and classes to keep track of the iportant things and ignore the junk
- 🪨 be minimal, using less dependencies as possible
- 📁 logging into text files
- 🎨 progress-bars, headers and other visualisation (WIP)
- 👤 User iput prompts
- ... to be continued >> 

also worth mentioning:
- 📑 [JS-doc](https://jsdoc.app/) awayabel for every function, clases and parmeters
- ⚙️ customizable behaviour (nearly everything is variable)
- 🌈 Colors and markedup text for better visualisation via [ANSI-escape-code](https://en.wikipedia.org/wiki/ANSI_escape_code)

> **⚠️ NOTE**: The color and markdown featues may not work a Windows and IOS operating systems.
> You may required to enable the [virtual terminal mode](https://docs.microsoft.com/en/windows/console/console-virtual-terminal-sequences) for this.

## TESTING, BUG-REPORTS AND FEATURE REQUESTS

#### Bug-reports
This code was created and tested on GNU/Linux Devices only. So there my be some issues on other operating systems.
This is a side project that i mainly develop and maintain in my freetime. So there is a changse that you encounter
an problem or edge case that i could not test or simply not noticed.

If you find sutch a problem or anything that seems off, please open a new [issue on github](https://github.com/Isja-krass/consoleinterface/issues).
If you familiar with the code and already figured out a possible solution simply add a [merge request](https://github.com/Isja-krass/consoleinterface/pulls).
I will review any issue as soon as i can.

> **⚠️ NOTE**: Please check the repository first, before creating a new issue. There my be a simelar problem alredy known and on the
> way to be fixed.

#### Request a new feature
I only have my speziffic point of view over this project. So if you think a new functionality or feature will by handy, pleas head over to
[issue on github](https://github.com/Isja-krass/consoleinterface/issues) to request a feature.
If you already have a branch ready to merge, please create a [merge request](https://github.com/Isja-krass/consoleinterface/pulls).
I am thankfull of any help i can get.

#### Testing
As said before, i only have the possibility to test on GNU/Linux devices. So i am thankfull of any feedback i can get from
other plattforms and operating systems. When you using this module on larger projects, it would be greatfully when you can
give me a short feedback how well it works. Especially becaus this module was only used for smaller internal projects.


## DOCUMENTION AND EXAMPELS

This is a small module, but it has more documentation as expected, so the documentation has been moved to  the [WIKI](https://github.com/Isja-krass/consoleinterface/wiki).
There are also diversity of examples to start from.

> **⚠️ NOTE**: A large part o the documentation has been rewritten but a small amount is still undocumented and will be added later.
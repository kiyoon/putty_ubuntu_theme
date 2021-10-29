# putty Ubuntu theme
Apply Ubuntu theme with one script.

![putty Ubuntu theme demo](https://user-images.githubusercontent.com/12980409/139436785-28d1ef26-c72c-4fca-bb82-3bea425f8ab7.png)

Original script from [putty-color-themes](https://github.com/AlexAkulov/putty-color-themes) but added Ubuntu theme from [PuTTY-Ubuntu-Theme](https://github.com/wlvchandler/PuTTY-Ubuntu-Theme) and changing of font (not just colours).


# Usage
## Before you use
First install [`UbuntuMono-Regular.ttf`](https://fonts.google.com/specimen/Ubuntu+Mono) font.

## Change default settings to Ubuntu style
1. Open Putty, click "Default Settings" under "Saved Sessions", and click Save.
    - This creates default settings in the registry.
2. Run `putty-ubuntu.reg`.
    - This will modify the default settings that was created in the previous step.

## Change all saved sessions to Ubuntu style
1. (optional) If you also want the default to change, open Putty, click "Default Settings" under "Saved Sessions", and click Save.
2. Drag the `putty-ubuntu.reg` and drop it on `_puttycolor.js`

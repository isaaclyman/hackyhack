# Hacky hack

**Script a Hollywood-style hacking scene that runs in your browser.**

Hacky hack is a web application that makes it look like you're hacking a computer network in an action-packed TV show. You write the script and you decide what happens.

- [Hacky hack](#hacky-hack)
  - [Setup](#setup)
  - [Example](#example)
  - [Commands](#commands)
    - [ANIMATE-SHAPE](#animate-shape)
    - [ANIMATE-TEXT](#animate-text)
    - [CLEAR](#clear)
    - [CLOSE](#close)
    - [FAKE-CODE](#fake-code)
    - [GO-TO](#go-to)
    - [HERE-IS](#here-is)
    - [IF](#if)
    - [POPUP](#popup)
    - [PROGRESS](#progress)
    - [PROMPT](#prompt)
    - [RESET-CONTEXT](#reset-context)
    - [SET-COLOR](#set-color)
    - [SET $VARIABLE](#set-variable)
    - [SLEEP](#sleep)
    - [TEXT](#text)
    - [USE-SHAPE](#use-shape)
    - [USE "name"](#use-name)
  - [Understanding context and layers](#understanding-context-and-layers)
  - [Special text](#special-text)
  - [Wishlist](#wishlist)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
  - [Learn More](#learn-more)

## Setup

A hacking scene is set up with a text file (the format is known as [KDL](https://kdl.dev/)). The file is executed in order from top to bottom.

## Example

```kdl
ANIMATE-TEXT {
    TYPING
}

ANIMATE-SHAPE {
    GROW
}

USE-SHAPE {
    RECTANGLE-ROUNDED
    NAME "left"
    TOP 0
    LEFT 0
    WIDTH 49
    HEIGHT 100
}

RESET-CONTEXT
USE-SHAPE {
    RECTANGLE-ROUNDED
    NAME "right"
    TOP 0
    LEFT 51
    WIDTH 49
    HEIGHT 100
}

USE "left"
FAKE-CODE 25

SLEEP 3000

USE "right"
FAKE-CODE 40
TEXT "
Hacking global spy network...
"

SLEEP 5000

PROMPT "Enter password"
PROMPT "Incorrect! 2 attempts remaining"
PROMPT "Incorrect! 1 attempt remaining"
TEXT "Logging in..."

POPUP {
    MESSAGE "Sysadmin alert. Begin detection avoidance algorithm?"
    BUTTON "Yes" {
        SET $avoidDetection="yes"
    }
    BUTTON "No" {
        SET $avoidDetection="no"
    }
}

IF "$avoidDetection" EQUALS="yes" {
    RESET-CONTEXT
    USE-SHAPE {
        BLANK
        LAYER 10
        NAME "detection avoidance"
        LEFT 0
        TOP 0
        WIDTH 100
        HEIGHT 100
        TRANSPARENT 40
    }

    ANIMATE-TEXT {
        LINE
    }

    TEXT "Beginning detection avoidance..."
    SLEEP 500
    TEXT "Routing network traffic..."
    SLEEP 500
    TEXT "Hijacking IoT devices..."
    SLEEP 800
    TEXT "DDOS attack begun."
    SLEEP 200
    TEXT "Traffic obfuscated."
    SLEEP 200
    TEXT "Trojan horse planted."
    SLEEP 200
    TEXT "Detection eluded! 45 seconds until next network scan."
    SLEEP 500
}

USE "left"
CLEAR
ANIMATE-TEXT {
    TYPE
}

PROMPT "Found private files. Download vault code?" "$downloadVaultCode"

IF "$downloadVaultCode" CONTAINS="yes" {
    TEXT "Downloading vault code..."
    PROGRESS {
        TIME 4000
        SUCCESS
    }
    TEXT "Vault code downloaded."
}

HERE-IS "download files"
PROMPT "Search for other private file:" "$searchFile"

IF "$searchFile" "NOT-EMPTY" {
    TEXT "Downloading $searchFile..."
    PROGRESS {
        TIME 2000
        SUCCESS
    }
    TEXT "Download complete."
    GO-TO "download files"
}

USE "right"
CLEAR

TEXT "Intrusion detected. Traceless disconnect in 3..."
SLEEP 1000
TEXT "2..."
SLEEP 1000
TEXT "1..."
SLEEP 1000
TEXT "Disconnected."
```

## Commands

### ANIMATE-SHAPE

```kdl
ANIMATE-SHAPE {
    GROW 250
}
```

Sets the shape animation style for the current context.

Available `SHAPE` animations:

- `"NONE"`: all shapes appear instantly.
- `"FADE 250"`: shapes fade in, taking 250 milliseconds by default.
- `"GROW 250"`: shapes grow from their top left corner to full size, taking 250 milliseconds by default.

### ANIMATE-TEXT

```kdl
ANIMATE-TEXT {
    LINE 100
}
```

Sets the text animation style for the current context.

Available `TEXT` animations:

- `"NONE"`: all text appears instantly.
- `"LINE 100"`: text appears one line at a time with a default 100 millisecond delay between lines.
- `"TYPE 10"`: text appears one character at a time, as though someone were typing it, with a default 10 millisecond delay between characters. When one line is finished typing, the next line will begin.
- `"LINE-TYPE 100 10"`: a combination of `LINE` and `TYPE`. In this case each character will take 10 milliseconds to type and each line will begin typing 100 milliseconds apart, even if the previous line isn't finished. This allows multiple lines to type out at the same time.

### CLEAR

```kdl
CLEAR
```

Deletes all content from the current context.

### CLOSE

```kdl
CLOSE-LAYER 0
```

Closes a layer, shape, or popup.

- `CLOSE-ALL` closes every layer, shape, and popup in the entire scene.
- `CLOSE-LAYER` closes an entire layer (including any shapes or popups it has) using its number.
- `CLOSE-SHAPE` closes a shape by name, e.g. `CLOSE SHAPE "top left quadrant"`.
- `CLOSE-ALL-SHAPES` closes all shapes.
- `CLOSE-POPUP` closes a popup by name, e.g. `CLOSE POPUP "my cool prompt"`.
- `CLOSE-ALL-POPUPS` closes all popups.

### FAKE-CODE

```kdl
FAKE-CODE 5
```

Produces lines of fake code within a context. The number is how many lines of code should be shown. The context will scroll down as code overflows it.

### GO-TO

```kdl
GO-TO "bug sequence"
```

Immediately jumps to the matching `HERE-IS` statement.

### HERE-IS

```kdl
HERE-IS "bug sequence"
```

Doesn't do anything right away, but places a marker for a spot you might want to go back to (or jump ahead to). See `GO-TO`.

### IF

```kdl
IF "$someVariable" CONTAINS="text" {
    ...
}
```

Lets you set a condition for a set of commands. Each operator needs a quoted value before it, and the first four also need a quoted value afterward:

- `EQUALS=`
- `NOT-EQUALS=`
- `CONTAINS=`
- `NOT-CONTAINS=`
- `"EMPTY"`
- `"NOT-EMPTY"`

### POPUP

```kdl
POPUP {
    NAME "my cool prompt"
    LAYER 9000
    TITLE "popup"
    MESSAGE "hello"
    POSITION "CENTER"
    BUTTON "OK" {
        ...
    }
    BUTTON "Cancel"
    PROMPT "$textResponse"
    WAIT
}
```

Shows a popup box (like a dialog or modal). If you use the `POPUP` command without options, it will show a popup with a warning icon and an X button in the corner to close it.

- `LAYER` sets the stacking layer of the popup. The default is 9000, because usually prompts are shown above everything else on the screen.
- `TITLE` sets the title of the popup. If no title is provided, the title bar won't be shown.
- `MESSAGE` sets the message in the popup.
- `POSITION` sets the position of the popup. By default it's shown in the center of the screen. Options are:
  - `"CENTER"`: vertically and horizontally centered.
  - `"CENTER TOP"`: horizontally centered at the top of the screen.
  - `"CENTER BOTTOM"`: horizontally centered at the bottom of the screen.
  - `"LEFT CENTER"`: vertically centered at the left side of the screen.
  - `"RIGHT CENTER"`: vertically centered at the right side of the screen.
  - `"LEFT TOP"`, `"RIGHT TOP"`, `"LEFT BOTTOM"`, `"RIGHT BOTTOM"`: you get the idea.
- `BUTTON` creates a button the user can click. Multiple buttons are allowed. By default, the button will close the popup and continue the script. You can also use `{}` braces to add commands that will be executed if the user clicks the button. Once the commands are complete, the popup will close and the script will continue.
- `PROMPT` creates a text entry box for the user to type into. Whatever they type will be set as the value of the variable you provide, in this case `$textResponse`.
- `WAIT` means that the script should wait for the user to click a button before continuing. This is the default behavior, so you don't ever have to use this option.
- `NOWAIT` means that the script should continue without waiting for the user to click a button. The popup will close automatically when the user clicks a button _or_ when you close it with the `CLOSE` command.

A popup cannot be a context for other commands.

### PROGRESS

```kdl
PROGRESS {
    MAX 80
    TIME 4000
    WARNING
}
```

Shows a text-based progress bar that starts at 0% and progresses toward 100%.

- `MAX` is the maximum percent you want the progress bar to reach.
- `TIME` is how long it should take (in milliseconds) for the progress bar to complete.
- The following describe the result of the progress bar, shown to the right once it completes:
  - `WARNING` shows a warning icon.
  - `ERROR` shows an error icon.
  - `SUCCESS` shows a check mark icon.
  - `TEXT "custom text"` shows custom text.

### PROMPT

```kdl
PROMPT "Enter password" "$passwordResponse"
```

Shows a text prompt. You can provide the prompt message in quotes, followed by the variable you want to put the user's response in. You don't have to provide a variable name if you don't care about the user's response.

### RESET-CONTEXT

Resets the context. Commands after this will happen inside the screen, not any specific shape.

### SET-COLOR

Sets the color of text and icons in the current context. The default is cyberpunk blue (#4696f1). You can choose any [CSS color keyword](https://www.w3.org/wiki/CSS/Properties/color/keywords) or a color written in RGB `rgb(255, 255, 255)`, HSL `hsl(0, 100%, 100%)`, or hex `#FFFFFF`.

### SET $VARIABLE

```kdl
SET $varname="value"
```

Creates or sets a variable named `$varname` to contain the text `value`. All variables names must start with a dollar sign `$`.

### SLEEP

```kdl
SLEEP 1000
```

Waits 1000 milliseconds (= one second) before continuing to the next command. If no value is provided, the default is 250 ms.

### TEXT

```kdl
TEXT r"
Opening C:\Users\Agent K\Private\Documents...
Full system access granted!
Deleting hard drive...
"
```

Creates lines of text within a context. 

- Text that's only letters, numbers and spaces can be in `"plain quotes"`.
- If you want to use special characters (like backslashes) in your text, use `r"raw \quotes"`.
- If you want to use quotes in your text, use `r#"disambiguated "quotes" like this"#`

### USE-SHAPE

```kdl
USE-SHAPE {
    RECTANGLE
    NAME "top left quadrant"
    LAYER 0
    LEFT 0
    TOP 0
    WIDTH 50
    HEIGHT 50
    TRANSPARENT 30
}
```

Creates a shape that can have content or other shapes inside of it. 

- `RECTANGLE` is the shape that should be drawn. Options are:
  - `RECTANGLE` is a shape with flat sides and 90 degree corners.
  - `RECTANGLE-ROUNDED` is a rectangle with rounded corners.
  - `RECTANGLE-BLANK` or `BLANK` is a rectangle with no visible border.
  - `OVAL` is a round shape.
- `NAME` gives a name to this context so you can refer to it later. See `USE`.
- `LAYER` is used to place elements above each other. LAYER 1 would appear above LAYER 0 if they overlap. If two overlapping elements are drawn on LAYER 0, it's uncertain which one will be on top (undefined behavior).
- `LEFT` (required) is used to set the distance (as a percent) from the left edge of the screen. 0 means it starts at the left edge; 50 means it starts halfway across the screen.
- `TOP` (required) is used to set the distance (as a percent) from the top edge of the screen. 0 means it starts at the top; 50 means it starts halfway down the screen.
- `WIDTH` (required) sets the width of the shape. 50 means it covers half the width of the screen.
- `HEIGHT` (required) sets the height of the shape. 50 means it covers half the height of the screen.
- `TRANSPARENT` sets the background transparency of the shape. By default it's completely opaque. 30 would make it 30% transparent. 100 would make anything underneath it fully visible (except where this shape has content).

Anything that comes after a `USE-SHAPE` command will happen inside of the shape. The shape is its _context._

### USE "name"

Sets the context to a specific shape. Commands after this will happen inside of the shape whose name was used.

## Understanding context and layers

A *context* (which is usually the same thing as a *shape*) is an area on the screen where things happen. A context has its own settings (inherited from the context where it was created) and its own internal layers. The `USE` and `USE-SHAPE` commands change the context.

A *layer* is the depth of something within a context. If two things are in the same context and they overlap, the one with the higher layer will "win" (it will be in front).

A layer can't win over a layer in a higher context! For example, if Context A is on Layer 10 and Context B is on Layer 20, nothing inside of Context A can ever be in front of something in Context B.

## Special text

You can use the following in any text:

- `$variable` uses the value of a variable you've previously set.
- `:icon:` shows the corresponding icon. Available icons:
  - `:info:`
  - `:warning:`
  - `:error:`
  - `:bug:`
  - `:lightning:`

## Wishlist

- rotating globe with geolocated pins and tags
- flat map of a country with geolocated pins/tags
- file picker (sets a variable with the name of the chosen file)
- file download animation

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

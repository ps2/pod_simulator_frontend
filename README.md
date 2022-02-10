# Getting Started the Pod Simulator UI

This is a UI frontend for the raspberry pi based [pod simulator](https://github.com/LoopKit/pod). You will need to have an instance of that running before you can use this UI.

## Configuration

You will need to point this UI to the network address or name of the raspberry pi your pod emulator is running on. To do this, edit the `src/api/index.js` file and replace the hostname with either a locally resolvable name, or an ip address.

```
var socket = new WebSocket("ws://rpi.local:8080/ws");
```

In the above example, `rpi.local` is the network name of my raspberry pi.

## Startup

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

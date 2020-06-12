console.log("Initializing");
const Group = require("./Hue/Group");
const Light = require("./Hue/Light");
const WebSocket = require('ws');
const ws = new WebSocket("ws://universe-server.crichard.fr:3657");
ws.onerror = error => {
  console.log(`WebSocket error: ${error.message}`);
}

ws.onopen = () => {
	console.log("connection opened");
}

ws.onmessage = message => {
    console.log("Received: " + message.data);
    const data = JSON.parse(message.data);
    if (data.event === "ask" && data.state === "lights") {
      console.log("asked lights");
      Light.list({
        callback: res => {
          res = Object.entries(res.body).map(e => {
            return { id: e[0], name: e[1].name, state: e[1].state };
          });
          ws.send(
            JSON.stringify({ event: "answer", sensor: "lights", state: res })
          );
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "yellow" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { scene: "HMo26dDghL9iHal" },
        callback: res => {
          console.log(res.raw_body);
          Light.list({
            callback: res => {
              res = Object.entries(res.body).map(e => {
                return { id: e[0], name: e[1].name, state: e[1].state };
              });
              ws.send(
                JSON.stringify({
                  event: "answer",
                  sensor: "lights",
                  state: res
                })
              );
            }
          });
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "black" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { on: false, bri: 0 },
        callback: res => {
          console.log(res.raw_body);
          Light.list({
            callback: res => {
              res = Object.entries(res.body).map(e => {
                return { id: e[0], name: e[1].name, state: e[1].state };
              });
              ws.send(
                JSON.stringify({
                  event: "answer",
                  sensor: "lights",
                  state: res
                })
              );
            }
          });
        }
      });
    }
    if (
      data.event === "button" &&
      data.sensor === "white" &&
      data.state === "on"
    ) {
      Group.action(0, {
        body: { on: true, bri: 255, xy: [0.3, 0.3] },
        callback: res => {
          console.log(res.raw_body);
          Light.list({
            callback: res => {
              res = Object.entries(res.body).map(e => {
                return { id: e[0], name: e[1].name, state: e[1].state };
              });
              ws.send(
                JSON.stringify({
                  event: "answer",
                  sensor: "lights",
                  state: res
                })
              );
            }
          });
        }
      });
    }
}
console.log("Listening");

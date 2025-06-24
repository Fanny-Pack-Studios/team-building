# TeamHub

TeamHub is a Decentraland project designed to facilitate team-building activities and virtual meetings in the metaverse.

## Try it out

Make sure you have the [Decentraland Client](https://decentraland.org/download/)

Paste this into a your browser (e.g. Mozilla, Internet Explorer, Chrome):
```
decentraland://?position=0,0&realm=hagane.dcl.eth
```
or, if you are in decentraland, run `/goto hagane.dcl.eth`


### Prerequisites
- Node.js (v16 or higher recommended)
- NPM (v8 or higher)

### Running Locally

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the local development server:
   ```
   npm run start-new-explorer
   ```

### Deployment

To deploy the project to the configured Decentraland world:

```
npm run deploy -- --target-content https://worlds-content-server.decentraland.org/
```

The world where this scene is deployed is configured in the `scene.json` file.

## Development

TeamHub is built using the [Decentraland SDK7](https://docs.decentraland.org/creator/development-guide/sdk7/)

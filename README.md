# dictaweb

Web-based form that can be filled out and downloaded as a PDF.
Full dictation available via direct encrypted connection to any smartphone.

Entirely serverless - 

Services:
* [Pusher](pusher.com) for WebSocket infrastructure
* [AWS Lambda](https://aws.amazon.com/lambda/) for auth token generation
* [Sentry.io](sentry.io) for error monitoring
* [libsodium.js](https://github.com/jedisct1/libsodium.js/) for shared secret end-to-end encryption

Secure:
* Dictated data is never stored, all operations are performed in browser
* PDF is generated in-browser
* Data is encrypted for transit between phone<->desktop
* Error monitoring service scrubs any dictated data from crash reports

## Project setup
```
npm install
```
Add a `.env` with the following keys:

```bash
# Pusher credentials
VUE_APP_PUSHER_APP_ID=******
VUE_APP_PUSHER_KEY=******
VUE_APP_PUSHER_CLUSTER=******

# Public URL for a Lambda used for signing Pusher tokens
# Such as https://github.com/AnalyzePlatypus/pusher-auth-lambda
VUE_APP_PUSHER_AUTH_ENDPOINT=******

# Sentry.io DSN
# Find it at https://sentry.io/settings/{username}/projects/${project_name}/keys/
VUE_APP_SENTRY_DATA_SOURCE_NAME_URL=******
```

## Development
```
npm run serve # Compiles and hot-reloads for development
npm run build # Compiles and minifies for production
```

## Deployment

Configure a new Netlify deploy at [netlify.com](netlify.com).
Point it at this repo, then choose `npm run build` as the build command.
Finally, run `git push origin master` to trigger a deploy.

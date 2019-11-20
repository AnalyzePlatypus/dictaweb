import Vue from 'vue';

async function installSentry() {
  const Sentry = await import(/* webpackChunkName: 'sentry' */'@sentry/browser');
  const Integrations = await import(/* webpackChunkName: 'sentry' */'@sentry/integrations');
  
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DATA_SOURCE_NAME_URL,
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  });  
}

export default installSentry;
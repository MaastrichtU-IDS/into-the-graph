/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts(
  "/into-the-graph/precache-manifest.81873a6ab13fd9b6368672291778e698.js"
);

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/into-the-graph/index.html", {
  
  blacklist: [/^\/_/,/\/[^/]+\.[^/]+$/],
});

workbox.routing.registerRoute(/^https?.*/, workbox.strategies.networkFirst({ "cacheName":"offlineCache", plugins: [new workbox.expiration.Plugin({"maxEntries":200,"purgeOnQuotaError":false})] }), 'GET');
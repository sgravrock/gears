# A bicycle gear ratio calculator

Inspired by https://www.sheldonbrown.com/gear-calc.html

## Running locally

Configure any web server to serve this directory. (Running `npx serve` is an
easy way to do that). Then access index.html in your browser.

## Running tests

With your web server running, access test/SpecRunner.html in your browser.

## Deployment

Copy index.html, app.mjs, config.mjs, app.css, and the vendor directory to your server.

If the server you're deploing to isn't already configured to serve .mjs files 
with the application/javascript MIME type, you'll need to do that. For Apache,
create a .htaccess file in the same directory as index.html with the following
contents, and make it world-readable:

```
AddType application/javascript .mjs
```

## Updating dependencies

Edit `deps/package.json`. Then run `./install` in the `deps` directory to
install and vendor the new versions.
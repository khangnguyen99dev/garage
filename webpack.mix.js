const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').react();
mix.sass('resources/sass/app.scss', 'public/css');

const path = require('path');
mix.webpackConfig({ resolve: { alias: { '@': path.join(__dirname, './resources/js') } } });
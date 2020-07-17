const mix = require('laravel-mix');
const fs = require('fs');
const bs = require('browser-sync').create();
const HtmlWebpackPlugin = require('html-webpack-plugin');

if (process.env.NODE_ENV === 'watch') {
  bs.watch('dist/*.html').on('change', bs.reload);
  bs.watch('dist/css/*.css').on('change', bs.reload);
  bs.watch('dist/js/*.js').on('change', bs.reload);
}

const htmlFiles = fs.readdirSync('src')
  .filter(file => file.slice(-5) === '.html')
  .map((file) => {
    return new HtmlWebpackPlugin({
      template: 'src/' + file,
      filename: file,
      inject: false,
      minify: false
    });
  }) || [];

mix
  .setPublicPath('dist')
  .copy('src/images', 'dist/images')
  .js('src/js/app.js', 'dist/js/app.js')
  .postCss('src/css/app.css', 'dist/css/app.css', [
    require('tailwindcss'),
  ])
  .options({
    processCssUrls: false,
  })
  .webpackConfig({
    plugins: htmlFiles
  }).then(() => {
    if (process.env.NODE_ENV === 'watch') {
      bs.init({server: "dist"});
    }
  });

// Disable mix-manifest.json generation.
Mix.manifest.refresh = _ => void 0

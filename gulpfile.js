var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

/**
 * $ gulp server
 * Description: Launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill()

  node = spawn('node', ['app.js'], {stdio: 'inherit'})

  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

/**
 * $ gulp default
 * Description: Start the development environment.
 * If a change occurs in app.js. or public directory then livereload
 */
gulp.task('default', ['server'], function() {
  gulp.watch(['./app.js', './public/'], ['server']);
});

/**
 * Clean up if an error goes unhandled.
 */
process.on('exit', function() {
    if (node) node.kill()
})

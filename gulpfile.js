let env = 'prod';
const { series, parallel, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const babel = require('gulp-babel');
var uglify = require('gulp-uglify');

function sassTask(cb) {
	src('assets/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'})
	.on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(dest('./css'));
	cb();
}

function javascript(cb) {
	if(env === 'development') {
		src('assets/js/**/*.js')
		.pipe(dest('js/'));
		cb();
	} else {
	src('assets/js/**/*.js')
  .pipe(sourcemaps.init())
	.pipe(babel({
	presets: ['@babel/env']
	}))
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(dest('js/'));
	cb();
	}
}

function watchFiles() {
	watch("./assets/**/**/*", parallel('sassTask', 'javascript'));
}

module.exports = {
	default: watchFiles,
	sassTask,
	watchFiles,
	javascript
}

let env = 'production';
const { series, parallel, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
var uglify = require('gulp-uglify');

function sassTask(cb) {
	if(env === 'development') {
		src('assets/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'})
		.on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(dest('./css'));
		cb();
	} else {
		src('assets/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.on('error', sass.logError)
		.pipe(sourcemaps.write())
		.pipe(dest('./css'));
		cb();
	}
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
	// .pipe(uglify())
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

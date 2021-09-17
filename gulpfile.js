const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');


const scssFiles = [
	'./assets/sass/template.scss'
]

// const jsFiles = [
// 	'./src/js/template.js'
// ]

function styles() {
	return gulp.src(scssFiles)

	.pipe(sourcemaps.init())

	.pipe(sass({
		errorLogToConsole: true
	}))

	.on('error', console.error.bind(console))

	.pipe(concat('template.min.css'))

	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleanCSS())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./assets/css'))
	.pipe(browserSync.stream());
}

// function scripts() {
// 	return gulp.src(jsFiles)
// 	.pipe(concat('template.min.js')) // Конкатенируем в один файл
// 	.pipe(uglify()) // Сжимаем JavaScript
// 	.pipe(gulp.dest('./assets/js')) // Выгружаем готовый файл в папку назначения
// 	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
// }

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

	gulp.watch('./assets/sass/**/*.scss', styles);
	// gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('watch', watch);


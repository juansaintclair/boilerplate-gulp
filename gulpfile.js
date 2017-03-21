var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean'); //exclui os arquivos, neste caso vai ser executado pra excluir os antigos e add os novos
var concat = require('gulp-concat'); //concatena os arquivos em um só
var uglify = require('gulp-uglify'); //minifica
var es = require('event-stream'); //Possilita o merge de dois gulp.src
var uglifycss = require('gulp-uglifycss'); //minifica css
var copy = require("copy");
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');


//o return torna a função asincrona no gulp.

gulp.task('clean', function () {
	return gulp.src('dist/')
		.pipe(clean());
});

gulp.task('jshint', function () {
	return gulp.src('js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('uglify', ['clean'], function () {
	return es.merge([
		gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js']),
		gulp.src('js/**/*.js').pipe(concat('scripts.js')).pipe(uglify())
	])
		.pipe(concat('scripts-min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('uglifycss', ['clean'], function () {
	return es.merge([
		gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'])
		//gulp.src('css/**/*.css').pipe(concat('estilos.css')).pipe(uglifycss())
	])
		.pipe(concat('frameworks-min.css'))
		.pipe(gulp.dest('dist/css'));
});


gulp.task('copy', ['clean'], function (cb) {
		return copy('index.html', 'dist/', cb)
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', ['uglifycss', 'copy'], function() {
    return gulp.src("css/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['jshint', 'sass', 'uglify'],  function() {

    browserSync.init({
        server: "dist/"
    });

    gulp.watch("css/*.scss", ['jshint', 'sass', 'uglify', 'copy']);

	gulp.watch("js/*.js", ['jshint', 'sass', 'uglify', 'copy']);

	gulp.watch("*.html", ['jshint', 'sass', 'uglify', 'copy', browserSync.reload]);
});

gulp.task('default', ['serve']);
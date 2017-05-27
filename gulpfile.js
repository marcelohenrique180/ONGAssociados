/**
 * Created by Marcelo Henrique on 26/05/2017.
 */

var gulp = require("gulp");
var babel = require("gulp-babel");
var watch = require('gulp-watch');

gulp.task("default", function () {
    return watch("assets/**/*.js", function () {
        return gulp.src("assets/js/compare.js")
            .pipe(babel())
            .pipe(gulp.dest("deploy/js"));
    })
});
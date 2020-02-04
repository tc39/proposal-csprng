const del = require("del");
const gulp = require("gulp");
const emu = require("gulp-emu");
const gls = require("gulp-live-server");

const clean = () => del("docs/**/*");
gulp.task("clean", clean);

const build = () => gulp
    .src(["spec/index.html"])
    .pipe(emu())
    .pipe(gulp.dest("docs"));
gulp.task("build", build);

const watch = () => gulp
    .watch(["spec/**/*"], build);
gulp.task("watch", watch);

const start = () => {
    const server = gls.static("docs", 8080);
    const promise = server.start();
    gulp.watch(["docs/**/*"], file => server.notify(file));
    return promise;
};
gulp.task("start", gulp.parallel(watch, start));

gulp.task("default", build);
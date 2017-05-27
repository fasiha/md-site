"use strict";

var fs = require('fs');
var spawnSync = require('child_process').spawnSync;

var css = fs.readFileSync('modest.css', 'utf8');

// pandoc --no-highlight -f markdown_github-hard_line_breaks -t html5 README.md
function buildOneMarkdown(filepath) {
  var outfile = filepath.replace(/md$/, 'html');
  var html =
      spawnSync(
          'pandoc',
          [
            '--filter', 'filter.js', '--no-highlight', '-f',
            'markdown_github-hard_line_breaks+implicit_figures+yaml_metadata_block',
            '-t', 'html5', filepath
          ],
          {input : undefined, encoding : 'utf8'})
          .stdout;
  fs.writeFileSync(outfile, '');
  fs.appendFileSync(outfile, '<head>\n<style>\n');
  fs.appendFileSync(outfile, css);
  fs.appendFileSync(outfile, '\n</style>\n</head>\n');

  fs.appendFileSync(outfile, html);
}

buildOneMarkdown('index.md')
buildOneMarkdown('post/texshade/index.md')

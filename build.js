"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var spawnSync = require('child_process').spawnSync;

var css = '<style>' + fs.readFileSync('modest.css', 'utf8') + '</style>\n';

var defaultMeta = {
  title : 'Insight≠Numbers',
  description : 'A blog by Ahmed Fasih',
  date : new Date(),
  dateUpdated : new Date(),
  banner : 'glen-helen.jpg',
  socialBanner : '',
  tags : [],
  draft : false,
};

function buildOneMarkdown(filepath) {
  var outfile = filepath.replace(/md$/, 'html');
  var contents = fs.readFileSync(filepath, 'utf8');
  var meta = {};
  if (contents.indexOf('---\n') === 0) {
    meta = yaml.safeLoad(contents.substring(4, contents.indexOf('\n---\n', 4)));
  }
  var html = spawnSync('pandoc',
                       [
                         '--filter', 'filter.js', '--no-highlight', '-f',
                         'markdown_github-hard_line_breaks+yaml_metadata_block',
                         '-t', 'html5', filepath
                       ],
                       {input : undefined, encoding : 'utf8'})
                 .stdout;

  var head = '<head><meta charset="utf-8" />\n';
  head += `<title>${meta.title || defaultMeta.title}</title>\n`
  head += social(outfile, meta.title || defaultMeta.title,
                 meta.description || defaultMeta.description,
                 meta.socialBanner || meta.banner || defaultMeta.banner);
  head += css;
  head += '\n</head>\n';
  head += meta.banner ? banner(meta.banner) : '';
  head += headline(meta.title || defaultMeta.title);
  fs.writeFileSync(outfile, '');
  fs.appendFileSync(outfile, head);
  fs.appendFileSync(outfile, html);
}

function banner(url) {
  return `<figure class=""><img src="${url}"></figure>`;
  return `<figure class="full-width no-top"><img src="${url}"></figure>`;
}
function headline(title) { return `<h1>${title}</h1>`; }

function social(url, title, description, banner) {
  return `<meta name="description" content="${description}" />
<meta name="twitter:card" value="summary">
<meta property="og:title" content="${title}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${banner}" />
<meta property="og:description" content="${description}" />\n`;
}

buildOneMarkdown('index.md')
buildOneMarkdown('post/texshade/index.md')

"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
// var Promise = require("bluebird");
var find = require('find');
var spawnSync = require('child_process').spawnSync;

var PREPATH = ''; // i.e., if site lives at foo.edu/~me, RELPATH='~me'.

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

var articles = new Map([]);

function gatherIntel(filepath) {
  var meta = fileToMeta(filepath);
  articles.set(filepath, meta);
}

find.file(/\.md$/, '.', md => {
  md = md.filter(s => s.indexOf('node_modules') !== 0);
  md.forEach(gatherIntel);
  var metas = Array.from(articles.values()).sort((a, b) => a.date - b.date);

  var postMetas = metas.filter(meta => meta.filepath.indexOf('post/') === 0);
  var nonpostMetas = metas.filter(meta => meta.filepath.indexOf('post/') !== 0);

  var tagsToMetas = groupBys(postMetas, meta => meta.tags);

  postMetas.forEach((meta, midx) => {
    buildOneMarkdown(meta, postMetas[midx - 1], postMetas[midx + 1], postMetas,
                     tagsToMetas);
  });
  nonpostMetas.forEach((meta, midx) => {
    buildOneMarkdown(meta, null, null, metas, tagsToMetas);
  });
});

// Build posts: have next/prev/tags + header
// Build non-posts: have header
// Build tags: have header

function buildOneMarkdown(meta, prevMeta, nextMeta, metas, tagsToMetas) {
  var filepath = meta.filepath;
  var outfile = meta.outfile;
  var html =
      spawnSync(
          'pandoc',
          [
            '--filter', 'filter.js', '--no-highlight', '-f',
            'markdown_github-hard_line_breaks+yaml_metadata_block+markdown_in_html_blocks',
            '-t', 'html5', filepath
          ],
          {input : undefined, encoding : 'utf8'})
          .stdout;

  var head = '<head><meta charset="utf-8" />\n';
  head += `<title>${meta.title}</title>\n`
  head += social(outfile, meta.title, meta.description,
                 meta.socialBanner || meta.banner);
  head += css;
  head += '\n</head>\n';
  head += meta.banner ? banner(meta.banner) : '';
  head += headline(meta.title);
  head += subline(meta.date, meta.tags);

  fs.writeFileSync(outfile, '');
  fs.appendFileSync(outfile, head);
  fs.appendFileSync(outfile, html);

  var foothtml = prevNextToFoot(prevMeta, nextMeta);
  if (foothtml) {
    fs.appendFileSync(outfile, foothtml);
  }
}

var path = require('path');
function filepathToAbspath(filepath) {
  return path.resolve('/', PREPATH, filepath).replace(/index.html$/, '');
}
function prevNextToFoot(prevMeta, nextMeta) {
  if (prevMeta || nextMeta) {
    // console.log(prevMeta, nextMeta);
    var foot = `<p><small>`;
    if (prevMeta) {
      foot += `Previous:
[${prevMeta.title}](${filepathToAbspath(prevMeta.outfile)})<br>`;
    }
    if (nextMeta) {
      foot += `Next:
[${nextMeta.title}](${filepathToAbspath(nextMeta.outfile)})`;
    }
    foot += '</small></p>'
    var foothtml =
        spawnSync('pandoc',
                  [
                    '-f',
                    'markdown_github-hard_line_breaks+markdown_in_html_blocks',
                    '-t', 'html5'
                  ],
                  {input : foot, encoding : 'utf8'})
            .stdout;
    return foothtml;
  }
  return '';
}

function fileToMeta(filepath) {
  var contents = fs.readFileSync(filepath, 'utf8');
  var outfile = filepath.replace(/md$/, 'html');
  var meta = Object.assign({}, defaultMeta, {filepath, outfile});
  if (contents.indexOf('---\n') === 0) {
    meta = Object.assign(
        {}, meta,
        yaml.safeLoad(contents.substring(4, contents.indexOf('\n---\n', 4))));
    if (meta.date) {
      meta.date = new Date(meta.date);
    }
    if (meta.dateUpdated) {
      meta.dateUpdated = new Date(meta.dateUpdated);
    }
  }
  return meta;
}

function subline(date, tags) {
  var text = '';
  var tagtext = tags.map(s => `‘${s}’`).join('—');
  if (date && (tags && tags.length)) {
    text = `Updated on ${date.toUTCString()}, tagged with ${tagtext}.`;
  } else if (date) {
    text = `Updated on ${date.toUTCString()}.`;
  } else if (tags && tags.length) {
    text = `Tagged with ${tagtext}.`
  }
  return text ? `<p><em>${text}</em></p>` : '';
}

function banner(url) {
  // return `<figure class=""><img src="${url}"></figure>`;
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

function groupBys(collection, keysfn) {
  var db = {};
  for (let val of collection) {
    for (let key of keysfn(val)) {
      if (db[key]) {
        db[key].push(val);
      } else {
        db[key] = [ val ];
      }
    }
  }
  return db;
}

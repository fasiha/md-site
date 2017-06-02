"use strict";

var jsdom = require("jsdom");
var {JSDOM} = jsdom;

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var find = require('find');
var spawnSync = require('child_process').spawnSync;

var URL = 'https://fasiha.github.io';
var PREPATH = 'md-site'; // i.e., if site lives at foo.edu/~me, RELPATH='~me'.
function filepathToAbspath(filepath) {
  return path.resolve('/', PREPATH, filepath).replace(/index.html$/, '');
}
function filepathToURL(filepath) { return URL + filepathToAbspath(filepath); }

var css =
    '<style>' + fs.readFileSync('assets/modest.css', 'utf8') + '</style>\n';

var plotlyPreamble =
    `<script src="${
                    filepathToAbspath('assets/plotly-basic-1.27.1.min.js')
                  }" charset="utf-8"></script>\n`;

var mathjaxPreamble = `<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } },
});
</script>
<script type="text/javascript" async charset="utf-8"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML">
</script>
`;

var hl = fs.readFileSync('assets/highlight.pack.js', 'utf8');
var hlcss = '<style>' +
            fs.readFileSync('assets/tomorrow-night-eighties.css', 'utf8') +
            '</style>\n';

var defaultMeta = {
  title : 'Insight≠Numbers',
  description : 'A blog by Ahmed Fasih',
  date : new Date(),
  dateUpdated : null,
  banner : 'glen-helen.jpg',
  socialBanner : '',
  tags : [],
  author : 'Ahmed Fasih',
  plotly : false,
  mathjax : false,
};

var articles = new Map([]);

function gatherIntel(filepath) {
  var meta = fileToMeta(filepath);
  articles.set(filepath, meta);
}

var Feed = require('feed');

find.file(/\.md$/, '.', md => {
  md = md.filter(s => s.indexOf('node_modules') !== 0);
  md.forEach(gatherIntel);
  var metas = Array.from(articles.values())
                  .sort((a, b) => -((a.dateUpdated || a.date) -
                                    (b.dateUpdated || b.date)));

  var postMetas = metas.filter(meta => meta.filepath.indexOf('post/') === 0);
  var nonpostMetas = metas.filter(meta => meta.filepath.indexOf('post/') !== 0);

  var tagsToMetas = groupBys(postMetas, meta => meta.tags);

  postMetas.forEach((meta, midx) => {
    buildOneMarkdown(meta, postMetas[midx + 1], postMetas[midx - 1], postMetas,
                     tagsToMetas);
  });
  nonpostMetas.forEach((meta, midx) => {
    buildOneMarkdown(meta, null, null, postMetas, tagsToMetas);
  });

  // Atom feed!
  var feed = new Feed({
    title : defaultMeta.title,
    description : defaultMeta.description,
    id : filepathToURL(''),
    link : filepathToURL(''),
    image : filepathToURL(defaultMeta.banner),
    copyright :
        'Unless otherwise noted, released into the public domain under CC0.',
    updated : new Date(postMetas[0].dateUpdated || postMetas[0].date),
    author : {name : defaultMeta.author, link : filepathToURL(`#contact`)}
  });
  postMetas.forEach(post => {
    feed.addItem({
      title : post.title,
      id : filepathToURL(post.outfile),
      link : filepathToURL(post.outfile),
      description : post.description,
      author : [
        {name : post.author, link : `${filepathToURL('')}/#contact`},
      ],
      contributor : [],
      date : post.dateUpdated || post.date,
      image : post.socialBanner || post.banner
    });
  });
  Object.keys(tagsToMetas).sort().forEach(tag => feed.addCategory(tag));
  fs.writeFileSync('atom.xml', feed.atom1());
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
  if (meta.mathjax) {
    html = html.replace(/\\&amp;/g, '&');
  }
  var tohighlight = html.search(/<pre[^<]*<code/) >= 0;
  if (tohighlight) {
    let window = (new JSDOM(html, {runScripts : "outside-only"})).window;
    window.eval(hl);
    window.eval(`hljs.initHighlighting();`)
    html = window.document.body.innerHTML;
  }

  var head = '<!doctype html>\n<head><meta charset="utf-8" />\n';
  head += `<title>${meta.title}</title>\n`;
  head += `<link href="${
                         filepathToAbspath('atom.xml')
                       }" type="application/atom+xml" rel="alternate" />\n`;
  head += social(outfile, meta.title, meta.description,
                 meta.socialBanner || meta.banner);
  head += css;
  if (tohighlight) {
    head += hlcss;
  }
  if (meta.plotly) {
    head += plotlyPreamble;
  }
  if (meta.mathjax) {
    head += mathjaxPreamble;
  }
  head += '\n</head>\n';

  // HEAD DONE!!!
  var ispost = prevMeta || nextMeta;

  head += meta.banner ? banner(meta.banner) : '';
  if (ispost) {
    head += topnav();
  }
  head += headline(meta.title);
  if (ispost) {
    head += subline(meta);
  }
  if (filepath === 'index.md') {
    head += postIndex(metas);
  }

  // ALL STRINGS BUILT!

  fs.writeFileSync(outfile, '');
  fs.appendFileSync(outfile, head);
  fs.appendFileSync(outfile, html);

  var foothtml = prevNextToFoot(prevMeta, nextMeta);
  if (foothtml) {
    fs.appendFileSync(outfile, foothtml);
  }
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

function shortDate(d) {
  return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}
function postIndex(metas) {
  var md =
      '## All posts\n' +
      metas
          .map(meta => `- [${meta.title}](${
                                            filepathToAbspath(meta.outfile)
                                          }) (${
                                                shortDate(meta.date)
                                              }, ${meta.tags.join('/')})\n`)
          .join('');
  var index =
      spawnSync('pandoc',
                [
                  '-f',
                  'markdown_github-hard_line_breaks+markdown_in_html_blocks',
                  '-t', 'html5'
                ],
                {input : md, encoding : 'utf8'})
          .stdout;
  return index;
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

function topnav(){return `  <ul class="top-nav">
    <li><a href="${filepathToAbspath('')}">Blog</a></li>
    <li><a href="${filepathToAbspath('#contact')}">Contact</a></li>
    <li><a href="${filepathToAbspath('atom.xml')}">Feed</a></li>
  </ul>`} function subline(meta) {
  var t = filepathToAbspath('');
  var text = ``;
  var tagtext = meta.tags.map(s => `‘${s}’`).join('—');
  if (meta.date && (meta.tags && meta.tags.length)) {
    text += `Updated on ${meta.date.toUTCString()}, tagged with ${tagtext}.`;
  } else if (meta.date) {
    text += `Updated on ${meta.date.toUTCString()}.`;
  } else if (meta.tags && meta.tags.length) {
    text += `Tagged with ${tagtext}.`
  }
  return `<p><em>${text}</em></p>`;
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

#!/usr/local/bin/node

/*

This pandoc filter is written in Node.js and uses the `pandoc-filter` npm
package. To use this, you have to [install Node.js](https://nodejs.org), then
initialize an npm project in your current directory, like so:

$ npm init -y

or, if you already know about and use yarn,

$ yarn init -y # if you use yarn

Next, ask npm (or yarn) to install pandoc-filter:

$ npm install --save pandoc-filter # or, if you use yarn: yarn add pandoc-filter

On mac/Unix, make this script executable if you intend to give it to pandoc:

$ chmod u+x filter.js

Finally, invoke Pandoc: there are two ways to do this:

$ cat test.md | pandoc -t json <YOUR FLAGS> | node filter.js | pandoc -f json <MORE FLAGS>

This might not be the best way because it forces you to break up your flags into
two separate sets, so a better way might be:

$ cat test.md | pandoc <ALL FLAGS HERE> --filter filter.js

This requires `filter.sh` to be executable (that `chmod` invokation above).

*/

var pandoc = require('pandoc-filter');

var emptyAttr = [ "", [], [] ];

function action(type, value, format, meta) {
  if (type === 'Para' && value.length === 1 && value[0].t === 'Image') {
    // console.error('type', type, 'value', value);
    var img = pandoc.Image(...value[0].c);
    var captioncontents = value[0].c[1].slice();

    var ret = [];
    var figstart = pandoc.RawBlock("html", "<figure>");
    ret.push(figstart);
    var link = pandoc.Link(emptyAttr, [img], [ img.c[2][0], "" ]);
    var plainimg = pandoc.Plain([link]);
    ret.push(plainimg);
    var captionstart = pandoc.RawBlock("html", "<figcaption>");
    ret.push(captionstart);
    var caption = pandoc.Plain(captioncontents);
    ret.push(caption);
    var captionend = pandoc.RawBlock("html", "</figcaption>");
    ret.push(captionend);
    var figend = pandoc.RawBlock("html", "</figure>");
    ret.push(figend);
    return ret;
  }
}

pandoc.stdio(action);

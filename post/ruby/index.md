---
date: '2016-10-13T19:18:41-04:00'
title: 'Make Ruby HTML tags'
description: 'If you can’t remember “ruby” vs “rp” vs “rt”, you’re in luck.'
banner: 'hiroshige.jpg'
tags: ["tech"]
---

I <ruby>😍<rt>love</rt></ruby> Ruby characters—you know, HTML `<ruby></ruby>`, usually seen giving the reading of East Asian characters. I often forget the raw HTML, so here you go, self, you’re welcome:

**Base text**
<input oninput="process()" placeholder="学生" type="text" id="base">

**Ruby text (annotation)**
<input oninput="process()" placeholder="がくせい" type="text" id="ruby">

**Optional: parentheses**
<input oninput="process()" placeholder="[" type="text" id="left">
<input oninput="process()" placeholder="]" type="text" id="right">

**HTML** <code id="code-out"></code>

**Result** <span id="out"></span>

And if anyone scolds you for abusing Ruby tags, you can always go on [@kosamari](https://twitter.com/kosamari/status/743473313184419845) 😇!

(Banner credit: Hiroshige’s color woodcut, *Mount Fuji seen through the waves at Manazato no hama, in the Izu Penisula, south of the mountain*, 1852. [Wikimedia](https://commons.wikimedia.org/wiki/File:Mount_Fuji_seen_through_the_waves_at_Manazato_no_hama,_in_the_Izu_Penisula,_south_of_the_mountain._Colour_woodcut_by_Hiroshige,_1852.jpg).)

<script>
function makeRubyString(base, ruby, left, right) {
  return '<ruby>' + base +
         (left && right ? '<rp>' + left + '</rp>' : '') +
         '<rt>' + ruby + '</rt>' +
         (left && right ? '<rp>' + right + '</rp>' : '') +
         '</ruby>';
}
function process() {
  const base = document.getElementById('base').value;
  const ruby = document.getElementById('ruby').value;
  const left = document.getElementById('left').value;
  const right = document.getElementById('right').value;
  const result = makeRubyString(base, ruby, left, right);
  document.getElementById('code-out').innerText = result;
  document.getElementById('out').innerHTML = result;
}
</script>

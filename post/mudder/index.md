---
date: '2017-06-01T02:17:23-04:00'
title: 'Announcing: Mudder.js'
description: 'Generate lexicographically-spaced strings. And for fun, encode numbers in arbitrary-base number systems.'
banner: 'flame.jpg'
tags: ["tech", "math"]
---

*(This post started as a “Work In Progress”-kind of post, but writing out apologies for why it wasn’t finished pushed me to publish it.)*

I’m happy to announce the publication of a fun, potentially even useful, library I worked on over September 2016.

[**Mudder.js**](https://github.com/fasiha/mudderjs) is a JavaScript library that lets you create lexicographically-evenly-spaced strings. That is, you can ask for the ten strings that lexicographically sort between two input strings.

As a fun bonus, it simplifies converting between JavaScript numbers and their stringy representations in arbitrary bases (non-base-ten) and using arbitrary symbols.

**Fun** First things first. We can specify a base-214 number system that uses the 214 Kangxi radicals used by the Chinese to organize Chinese characters, i.e., 0 through 20 is 一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕. One billion is 疋亠鼠尢 in this number system, while one-billion-plus-one is 疋亠鼠尸. Confucius’ name is written <ruby>孔<rt>kǒng</rt></ruby><ruby>子<rt>zǐ</rt></ruby> and consists of the radicals 子乚子, which in this Kangxi number system is 8170—maybe that has some cosmic significance?

**Business** This numerology actually was an unexpected stepping stone to a more serious use. In NoSQL databases like CouchDB or Redis, entries are indexed by stringy keys and I needed a way to reliably insert, delete, and reorder entries to maintain an external ordering without knowing ahead of time how many entries or how they would be ordered. Mudder.js makes it easy to ask for three strings that are lexicographically between, say, 'anhui' and 'azazel', using only the 26 lower-case letters:
```js
console.log(mudder.alphabet.mudder('anhui', 'azazel', 3))
// [ 'aq', 'at', 'aw' ]
```
With Mudder.js, I can always call `mudder` (i.e., “midder”) to get one or more strings lexicographically between any two stringy keys. Feel free to edit the code above—the results should update instantaneously thanks to the magical [Klipse](http://blog.klipse.tech/klipse/2017/03/28/klipse-explained.html) plugin.

(I’ve been referring to “lexicographic” ordering, i.e., a sort order on functions. In other words, a function of two strings that says whether the first is “less than”, “equal to”, or “greater than” the second. Java’s [`String.compareTo`](http://docs.oracle.com/javase/8/docs/api/java/lang/String.html#compareTo-java.lang.String-) docs are quite clear.)

Most of the complete details are in the [literate source](https://github.com/fasiha/mudderjs), which is actually very verbose 🙄. As usual, the literate methodology, of explaining in prose what I was doing and then showing code that did it, enormously decreased the activation energy to refactoring bad code—it’s more painful to contort one’s prose explanations to positively spin bad design than just to refactor.

Near the end though, I tapered off with the literate code because I needed to get on with Real Life and use the library. I didn’t publish the library for this reason, but I’m happy to complete several tests, fix several bugs, and write up the API documentation to publish it now. Feel free to play with it below.

```js
var kangxi = `一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士
              夂夊夕大女子宀寸小尢尸屮山川工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴
              文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘
              生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自
              至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆
              里金長門阜隶隹雨青非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿
              麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠`.replace(/\s/g, '');
var rad = new mudder.SymbolTable(kangxi);
console.log('Confucius: ', rad.stringToNumber('子乚子'));
console.log('Billion:', rad.numberToString(1e9));
```

---

Perhaps I can note here that I might have had a small role to play in introducing to Klipse’s Yehonathan Sharvit ([@viebel](https://twitter.com/viebel)) the role *he* could play in giving voice once again to Alan Kay’s expectation of interactive computing. In [“A new way of blogging about javascript”](http://blog.klipse.tech/javascript/2016/06/20/blog-javascript.html#alan-kays-vision), @viebel quotes an [interview](http://www.drdobbs.com/architecture-and-design/interview-with-alan-kay/240003442?pgno=2) where Kay uses Wikipedia to illustrate how unambitious our vision for learning and interacting with computers is:

> go to the article on Logo, can you write and execute Logo programs? Are there examples? No. The Wikipedia people didn’t even imagine that, in spite of the fact that they’re on a computer.

Kay’s own [presentations](https://youtu.be/Eg_ToU7m1MI?t=2m15s), of course created and executed in Smalltalk VM, provided me with a visceral feeling of this disappointing lack of vision. For him, it’s obvious that we should illustrate our thinking right there, with examples in the same medium as the prose that expresses it. No, it does not make any sense to have to install a program, switch to a command-line, or open a new browser tab to try a programming language, or verify a numerical fact, or test an optical illusion as Kay does here.

I see immediately-interactive code is the sister to literate programming. In the last couple of projects (e.g., [Ebisu](../ebisu)) I’ve worked out a very opinionated, personalized workflow for the latter. In this webpage, I’m happy to acknowledge the fantastic work Klipse has done in making [interactive JavaScript blogs](http://blog.klipse.tech/klipse/2017/03/28/klipse-explained.html) dead-simple. Kudos, Klipse!

(That said, the Klipse plugin does weigh in at 1.1 MB minified (225 kB minified+gzipped). In case its download was blocked, the much smaller Mudder.js has been loaded into this window, and should be available in your browser’s JavaScript Console.)

(Banner credit: self, with Gimp’s Flame effect.)

<script src="mudder.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">
<script>
window.klipse_settings = {
  selector_eval_js: '.javascript',
  };
</script>
<script src="https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>

---
date: '2016-12-29T20:08:29-05:00'
title: 'A UTF-8 mini-refresher'
description: 'Recalling some of the nitty-gritty details of UTF-8 decoding, with Rust sample code.'
banner: 'linear-b.jpg'
tags: ["tech"]
---


Aficionados of information theory will recognize UTF-8 as a self-synchronizing prefix-free code—where “code” means a way to encode letters of an alphabet with bits. The alphabet consists of the tens of thousands of Unicode code points, or symbols, each of which is a “letter” in this alphabet.

Going off of [this highly-voted StackOverflow answer](http://stackoverflow.com/a/1543616/500207) and the [Base-122](http://blog.kevinalbs.com/base122) writeup, here’s how UTF-8 works. If the first half-byte of a byte (the first hexadecimal digit) is:

- between 0x0 and 0x7, this byte encodes a one-byte code point (ASCII). Seven bits are used for the actual code point, which can be between U+0 and U+7F.
- 0xC or 0xD (12 or 13), this is the start of a two-byte code point. 5+6 or eleven bits (of sixteen) are used for the actual code point, which lives in [U+080, U+7FF].
- 0xE (14), this is the start of a three-byte code point. 4+6+6 or sixteen bits (of twenty-four) are used for the actual code point, which lives in [U+800, U+FFFF].
- 0xF (15) and the *second* half-byte is ≤0x7, this is the start of a four-byte code point. 3+6+6+6 or twenty-one bits (of thirty-two) are used for the actual code point, which lives in [U+10000, U+10FFFF].

(In the above, whenever I’ve said, e.g., “3+6+6+6” bits, each of those numbers represent how many bits of each byte combine to yield the code point. And those bits are from the least significant end—the most significant bits of each byte is taken up by a prelude.)

So, for example:

| character | UTF-8 bytes | Unicode code point |
|---|---|---|
| x | 78 | \U{[78](http://www.fileformat.info/info/unicode/char/0078/index.htm)} |
| Å | C3 85 | \U{[C5](http://www.fileformat.info/info/unicode/char/00C5/index.htm)} |
| 月 | E6 9C 88 | \U{[6708](http://www.fileformat.info/info/unicode/char/6708/index.htm)} |
| 😊 | F0 9F 98 8A | \U{[1F60A](http://www.fileformat.info/info/unicode/char/1F60A/index.htm)} |
| Ā̂ | C4 80 CC 82 | \U{[100](http://www.fileformat.info/info/unicode/char/0100/index.htm)}\U{[302](http://www.fileformat.info/info/unicode/char/0302/index.htm)} |
| 👍 | F0 9F 91 8D | \U{[1F44D](http://www.fileformat.info/info/unicode/char/1F44D/index.htm)} |
| 👍🏽️ | F0 9F 91 8D F0 9F 8F BD EF B8 8F | \U{[1F44D](http://www.fileformat.info/info/unicode/char/1F44D/index.htm)}\U{[1F3FD](http://www.fileformat.info/info/unicode/char/1F3FD/index.htm)}\U{[FE0F](http://www.fileformat.info/info/unicode/char/FE0F/index.htm)} |

(Experiment with the code that generated this at the [Rust Playground](https://is.gd/YUiDHj)!)

The first four rows show examples of code points that, in UTF-8, take up 1–4 bytes. The rest show that Unicode is more complicated than can be expressed in this gist 😜.

(Banner credit: Jeremy Keith, *Linear B*, tablet at Oxford’s Ashmolean Museum, London, England. [Flickr](https://www.flickr.com/photos/adactio/26567747536).)

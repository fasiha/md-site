---
date: '2017-01-05T09:52:39-05:00'
title: 'How Rust slays brittle indexing logic.'
description: 'A newbie’s response to Steve Klabnik’s question: what does Rust solve for me?'
banner: 'hematite.jpg'
tags: ["tech"]
---

*(Originally posted on [Gist](https://gist.github.com/fasiha/886302b75e480d4b4e4e31f3eba055bb).)*

In writing one’s own [Base64](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding) codec for the [Cryptopals Crypto Challenge](https://cryptopals.com/sets/1/challenges/1) in Rust (see my [multilingual code here](https://github.com/fasiha/rosetta-cryptopals)!), one gets to a point where every chunk of *four* adjacent elements in an input vector has to be transformed into a chunk of *three* elements in an output vector.

> That is, the string `SSdt` containing four ASCII bytes becomes the string `I'm` containing three ASCII bytes, and `IGtp` becomes ` ki`, and so on, so that `SSdt IGtp bGxp bmcg eW91 ciBi cmFp biBs aWtl IGEg cG9p c29u b3Vz IG11 c2hy b29t` is decoded to `I'm killing your brain like a poisonous mushroom`.

I had a function to do this four-to-three downconversion but looping over the two arrays, lining up the indexes, the keeping track of magic threes and magic fours in my code gave me a headache as I worked through writing the following:
```rust
pub fn decode(s: &[u8]) -> Vec<u8> {
    let mut out: Vec<u8> = vec![0; s.len() / 4 * 3];
    for i in 0..out.len() / 3 {
        let v = &s[i * 4..i * 4 + 4];
        &out[i * 3..i * 3 + 3].copy_from_slice(&quad2triplet(v[0], v[1], v[2], v[3]));
    }
    out
}
```
I thought Rust was just C with safety and type inference, so keeping track of indexes like this is just how it was done.

(Caveat, the code above is a tiny bit wrong—it’ll compile and give you the right answer but might pad it with one or two bytes that need trimming if the input ended in `=`.)

After Rusting a few more Cryptopals challenges, and binge-reading the standard library’s documentation on [iterators](https://doc.rust-lang.org/std/iter/trait.Iterator.html) and [slices](https://doc.rust-lang.org/std/primitive.slice.html), I finally realized this decoder could be written entirely without brittle magic-numbered indexing arithmetic:
```rust
pub fn decode0(s: &[u8]) -> Vec<u8> {
    let mut out: Vec<u8> = vec![0; s.len() / 4 * 3];
    for (v, vo) in s.chunks(4).zip(out.as_mut_slice().chunks_mut(3)) {
        vo.copy_from_slice(&quad2triplet(v[0], v[1], v[2], v[3]))
    }
    out
}
```

Just to emphasize the crucial lines—before:
```rust
// BEFORE: 🤞
for i in 0..out.len() / 3 {                            // (🏸)
    let v = &s[i * 4..i * 4 + 4];                      // (🏑)
    &out[i * 3..i * 3 + 3].copy_from_slice(/*...*/);   // (🏏)
}
```
and after:
```rust
// AFTER: 🙌
for (v, vo) in s.chunks(4).zip(out.as_mut_slice().chunks_mut(3)) {
    vo.copy_from_slice(/*...*/)
}
```
At first glance, the changes might look insignificant, but I reiterate.

*No* **more** ***indexing***.

This is big. Before coding, the idea in one’s mind is, “take four-chunks, transform them into three-chunks”.

Then one labors for a few seconds–minutes ironing out three separate indexes: (🏸) how many 3-chunks in the output, each corresponding to (🏑) which chunk of the input, each going to (🏏) which chunk of the output.

And now, Rust—*Rust*, billed as a safe systems-level language, which I interpreted to mean “C with type inference”—lets us quite literally express our *initial* idea: we talk about `chunks(4)` of the input, and `chunks_mut(3)` of the output, and that’s it.

This, my friends, is much bigger than safety or systems programming. This is about ML-grade expressivity in a non-garbage-collected, compiled language.

(N.B. And it’s not just this example. I’m compiling a list of functions where I thought, “Wow, this is Clojure-clear”. Which is a compliment to Rust.)

(PS. The full code is here: [base64decode.rs](https://github.com/fasiha/rosetta-cryptopals/blob/0b72f2dfc658b0c103b60aa4becf21289386cf05/cryptobasics/src/base64decode.rs#L24-L39). Also, many thanks to Michael Gattozzi’s [“Rust is it’s community”](https://mgattozzi.com/rust-is) and [“Why you should be blogging about Rust”](https://mgattozzi.com/blog-about-rust) for prodding me to write this brief note.)

(Banner image credit: Didier Descouens ([User:Archaeodontosaurus](https://commons.wikimedia.org/wiki/User:Archaeodontosaurus)), *Hematite Iron-Rose*, from Ouro Preto, in Minas Gerais, Brazil. [Wikimedia](https://en.wikipedia.org/wiki/File:H%C3%A9matite_Rose_de_Fer.jpg).)

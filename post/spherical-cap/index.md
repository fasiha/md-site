---
date: '2016-08-19T00:59:34-04:00'
title: 'Random points on a spherical cap'
description: 'An adventure in ES2015, spherical caps, and random sampling.'
banner: 'jupiter-aurora.jpg'
tags: ["math", "tech"]
---

**tl;dr** [JavaScript](https://github.com/fasiha/sphere-cap-random) (and [Matlab](https://stackoverflow.com/a/39003745/500207)) library to draw random samples from arbitrary spherical caps.

<figure><div id="divPlot"></div>
<figcaption>Interactive 3D scatterplot of samples from three spherical caps. [Screenshot](screenshot.png)</figcaption>
</figure>
<script src="cap-random.min.js"></script>
<script src="plotly-gl3d-1.27.1.min.js" charset="utf8"></script>
<script src="demo.js"></script>

@Pedro77 [posted](http://stackoverflow.com/q/38997302/500207) their approach to generating random points on the surface of a sphere contained in a cone emanating from the middle of the sphere—a cone pointing in a specified direction and with a specified angular extent.

In other words, they wanted a way to randomly sample points from the *spherical cap* ([Mathworld](http://mathworld.wolfram.com/SphericalCap.html), [Wikipedia](https://en.wikipedia.org/wiki/Spherical_cap)) parameterized by

- an angle, rather than a height, and
- a specific direction, in terms of a 3D vector, rather than assuming the cap was centered on the sphere’s North Pole.

@Pedro77’s technique used *rejection sampling* (generating random points on the sphere’s surface until one was found that met the criteria).

I was able to [cobble together](http://stackoverflow.com/a/39003745/500207) an implementation of a deterministic algorithm (in 😭Matlab😭) using the insights from [@joriki](http://math.stackexchange.com/a/205589/81266) and [@Jim Belk](http://math.stackexchange.com/a/44691/81266)—see these to learn some surprising facts about the surface areas of cuts of cylinders and spheres (they’re the same!).

In order to more easily visualize samples from spherical caps, and to get a feel for [*scijs*](http://scijs.net/packages/) and modern JavaScript as exemplified by [d3 4.0](https://github.com/d3/d3#installing) (“D3 is written using *ES2015 modules* … create a custom bundle using *Rollup*…”), I put together an ES2015 package to generate points on such directed spherical caps, [sphere-cap-random](https://github.com/fasiha/sphere-cap-random), which can run in the browser or in Node.

Here’s a taste of what that looks like (here’s [the rest](https://github.com/fasiha/sphere-cap-random/blob/gh-pages/src/capRandom.js)):
```javascript
export default function sampleSphericalCap(params) {
  params = params == null ? {N : 1, z : 0} : params;

  const π = Math.PI;
  const π2 = 2 * π;
  const radPerDeg = π / 180;

  const minZ =
      (params.z ? +params.z
                : (params.deg ? Math.cos(+params.deg * radPerDeg)
                              : (params.rad ? Math.cos(+params.rad) : 0)));
  const N = params.N ? +params.N : 1;
  return pack(Array.from({length : N}, _ => {
           const z = Math.random() * (1 - minZ) + minZ;
           const r = Math.sqrt(1 - z * z);
           const θ = Math.random() * π2;
           const x = r * Math.cos(θ);
           const y = r * Math.sin(θ);
           return [ x, y, z ];
         })).transpose(1, 0);
}
```

(N.B. These days, i.e., May 2017, I have converged to using Node-style modules, Browserify, and Google Closure Compiler’s JavaScript port. Node modules and Browserify are dead-simple. Google Closure Compiler brings the heavy magic, with proper dead-code elimination and whole-program optimization—and is [also](https://www.npmjs.com/package/google-closure-compiler) dead-simple to use!)

The 3D scatter plot above, courtesy of [*plotly.js*](https://plot.ly/javascript/3d-scatter-plots/), shows random samples from three spherical caps:

- the 30° spherical cap at the North Pole,
- the 30° spherical cap pointing towards the middle of the first octant, `[1, 1, 1]`, and
- the 110° spherical cap, which looks like a Dymaxion dome, at the South Pole.


(Banner image: Hubble Space Telescope image of Juputer, dated 2016 June 29, NASA Goddard Space Flight Center, Greenbelt, Maryland, USA. Official [Flickr](https://www.flickr.com/photos/gsfc/28000029525/). [Wikimedia](https://commons.wikimedia.org/wiki/File:Hubble_Captures_Vivid_Auroras_in_Jupiter%E2%80%99s_Atmosphere_(28000029525).jpg).)

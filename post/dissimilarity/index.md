---
date: '2016-10-22T00:40:30-04:00'
description: 'Biblical criticism and Bayes theorem. What could go wrong?'
title: 'Conditional probability and the criterion of dissimilarity'
banner: 'wilderness.jpg'
tags: ["math", "history"]
plotly: true
mathjax: true
---

## Introduction

I wasn’t familiar with *the criterion of dissimilarity* when I read
about it in Bart Ehrman’s *Did Jesus Exist?* (2013; the answer to the
question is “yes” in case you were wondering
[npr.org](http://www.npr.org/2012/04/01/149462376/did-jesus-exist-a-historian-makes-his-case)):

> when we encounter a story about Jesus that does not support an early
> Christian agenda or that seems to run contrary to what the early
> Christians would have wanted to say about Jesus, … the story is more
> likely to be historically reliable since it is less likely to have
> been made up. (Chapter 8)

The technique sounds like a legitimized use of ad hominem attacks. An ad
hominem attack is the (usually fallacious) rhetorical–logical–cognitive
shortcut where, instead of evaluating someone’s statement for
correctness, you assume it’s wrong if you dislike the person, or right
if you like them. I always think of the following example: “Elected
officials are not paid enough,” says your Senator or Member of
Parliament or Diet member. You reply, “*Of course* you’d say that—you’re
an elected official and want a higher salary.” The statement may be
true, but instead of evaluating it properly, you conclude it’s false
because of who said it.

(Ad hominem attacks are found in lists of cognitive fallacies, but the
technique is often a very good heuristic. As Nassim Taleb says, “Don’t
ask a barber if you need a haircut.”)

The criterion is used by historians when there are unreliable sources
for an event. When an ancient writer makes a claim that they would want
to be true, i.e., that serves their agenda, then we ought to be less
inclined to believe it to be true.

This is apparently a controversial tool among historians. To me, someone
who is not a professional historian, but who has taken a few statistics
courses in grad school, this seemed like something to which we could
apply conditional probability. I know that conditional probability often
gives very counterintuitive results (the classic case is the confusion
among doctors about medical tests due to the interplay between the
probability of false alarm versus probability of missed detection), so
perhaps there’s a numeric angle to the controversy.

## A simplified example: telling the truth

I tried writing out Bayes rule for events like “useful if true” and
“made up”, but it was difficult for me to be sure these events were
really random variables. It’s easy to misapply conditional probability
and Bayes rule for real world problems (i.e., outside statistics
classes) because probability is so subtle and difficult to get right.

So here’s a simplified example that I came up with to understand the
problem a little better: imagine a psychological experiment on lying.

A participant is asked to predict whether a coin will land heads or
tails, and then asked for flip it and tell us whether it came heads or
tails. The participant is maybe rewarded for correct “predictions” but
we don’t ask to see the coin, so the participant can lie to us. Unknown
to them, though, we have a secret camera recording the actual results,
so we can ask the question: assuming the participant predicted heads
before flipping the coin, what’s the probability that it actually landed
heads if they said “heads”? What is
\\[ p(\\text{heads } | \\text{ says heads}) ?\\]
(In this notation, \\(p(A | B)\\) is read “probability of
event A given we know event B happened”.) This is straightforward Bayes
rule, which says
\\[\\begin{equation} p(A | B) = \\frac{p(B | A)
\\cdot p(A)}{p(B)}. \\label{eq:bayes} \\end{equation}
\\]
I know some
people’s eyes glaze over when they see a string of mathematical
gibberish like this—mine certainly do, and my eyes skip it to see if the
prose discussion below the equation will let me get away with not trying
to parse and understand the equation. I will try very hard to give
meaningful prose explanations of each mathematical equation that give
you the courage to return the math and slay it. In this case, however,
it may be easier to plug in actual events instead of \\(A\\) and \\(B\\)
before explaining anything:
\\[
\\begin{align}
p(\\text{H } | \\text{says H})
\\&=
\\frac{ p(\\text{says H } | \\text{ H}) \\cdot p(\\text{H}) }{p(\\text{says H})} \\label{eq:bayes-heads}
\\\\
\\&=
\\frac{ p(\\text{says H } | \\text{ H}) \\cdot p(\\text{H}) }{p(\\text{says H } | \\text{ H}) \\cdot p(\\text{H}) + p(\\text{says H } | \\text{ T}) \\cdot p(\\text{T}) }.
\\label{eq:total-prob-heads}
\\end{align}
\\]
Hmm, that might be even more impenetrable than with
abstract \\(A\\)s and \\(B\\)s, but it’ll be easier to explain. Things
to note:

- We use \\(H\\) to mean “heads” or “heads actually landed”.
- In \\eqref{eq:bayes-heads}, we’ve just plugged in \\((A = \\text{H})\\) and \\((B = \\text{says H})\\) into the original Bayes rule equation \\eqref{eq:bayes}.
- \\eqref{eq:total-prob-heads} has the same numerator as
  \\eqref{eq:bayes-heads}. *But* the denominator has expanded via the
  [law of total
  probability](https://en.wikipedia.org/wiki/Law_of_total_probability).
  I did this because, eventually, we’ll want to replace these
  probabilities with numbers, and I have no idea what the raw
  probability is that someone will say “heads” assuming nothing other
  than that they’ve predicted heads. But using total probability, we
  can express \\(p(\\text{says H})\\) in terms of conditional
  probabilities and coin-flip probabilities—I can actually assign
  reasonable numbers to all the probabilities in
  \\eqref{eq:total-prob-heads}, but couldn’t in
  \\eqref{eq:bayes-heads}.

Assuming \\eqref{eq:total-prob-heads} is legitimate, we can say the
following:

- \\(p(\\text{H}) = p(\\text{T}) = 0.5\\), that is, the probability of heads or tails is 0.5 for this fair coin.
- \\(p(\\text{says H } | \\text{ H}) = 1\\). This means that if heads
  actually came up, the participant is guaranteed to say “heads came
  up”. (Recall that we’re assuming they predicted “heads will come up”
  before flipping the coin.) The participant won’t lie if it’ll harm
  them.
- The last probability, \\(p(\\text{says H } | \\text{ T}) =
  p\_{\\text{lie}}\\), is the probability of a lie. This means the
  participant predicted heads, flipped tails, but lied and said
  “heads”. \\(p\_{\\text{lie}}\\) we’ll leave as a variable.
  \\(p\_{\\text{lie}} = 0\\) means this participant is hyper-truthful.
  \\(p\_{\\text{lie}} = 1\\) when a participant is a compulsive liar.

With these algebraic machinations, we can answer the question at the
beginning of this section. The probability that a coin actually landed
heads given the participant said heads (recall we assume they predicted
heads beforehand) is
\\[
\\begin{equation}
p(\\text{H } | \\text{ says H}) = \\frac{0.5}{0.5 + 0.5 p\_{\\text{lie}}} = \\frac{1}{1 + p\_{\\text{lie}}}.
\\end{equation}
\\]
For a hyper-truthful person,
\\(p\_{\\text{lie}} = 0\\) so we can be 100% sure that if they say
“heads came up,” heads really did come up: \\(p(\\text{H } | \\text{
says H}) = 1\\). For a compulsive liar, \\(p\_{\\text{lie}} = 1\\), and
the odds are 50-50 that the coin actually came up heads when they say it
did: \\(p(\\text{H } | \\text{ says H}) = 0.5\\) which is also the prior
probability of heads coming down—just ignore anything an inveterate liar
says.

## A more complicated example: believing a historic event

The case above, lying about coin flips, is simpler than fabricating
stories. But it turns out we can adapt the total probability equation of
\\eqref{eq:total-prob-heads} to this more general problem quite nicely.
Let “H” mean “a historic event H *actually* happened”. Let “says H” mean
“a historic source says a historic event H happened”. Then we want to
know \\(p(\\text{H } | \\text{ says H})\\): we have read a story H about
a historic person, and we want to know the probability that it actually
happened.

Rewrite Bayes rule with total probability of
\\eqref{eq:total-prob-heads}:
\\[
\\begin{equation}
p(\\text{H } | \\text{ says H}) = \\frac{ p(\\text{says H } | \\text{ H}) \\cdot p(\\text{H}) }{ p(\\text{says H } | \\text{ H}) \\cdot p(\\text{H}) +
p(\\text{says H } | \\text{ not H}) \\cdot p(\\text{not H}) }.
\\label{eq:tp2}
\\end{equation}
\\]
All that’s changed from
\\eqref{eq:total-prob-heads} to \\eqref{eq:tp2} is that insted of “T” we
have “not H”, which means “historic event H didn’t really happen”, i.e.,
it was fabricated if anyone says it did happen. All four probabilities
here are free in this more general case, since we have historic events
instead of coin flips:

a.  \\(p(\\text{says H } | \\text{ H}) = p\_\\text{useful}\\) is the
    probability that, given an event H actually happened, that H would
    be recorded. I call this the “probability of usefulness”—if H is the
    event that Christ ate figs for lunch on Passover, 32 C.E., it’s
    unlikely to be recorded by any contemporary source:
    \\(p\_\\text{useful}\\) would be close to 0 for this H. However,
    \\(p\_\\text{useful}\\) may be closer to 1 for the event H that
    Christ entered Jerusalem days before the crucifixion. It depends on
    what H is.
b.  \\(p(\\text{H}) = p\_\\text{plausible}\\) is the probability that
    event H truly happened, independent of whether it was recorded or
    who recorded it. By the complement rule of probability,
    \\(p(\\text{not H}) = 1- p\_\\text{plausible}\\). This is a little
    abstract, and as we’ll see, the number assigned to this probability
    doesn’t really affect our conclusion about the criterion of
    dissimilarity, but I take this probability to mean how plausible the
    event H is on general principles, based on what we know about the
    time period, about science, etc.
c.  Finally, \\(p(\\text{says H } | \\text{ not H}) = p\_\\text{lie}\\),
    is the probability that the event H was fabricated. H here might be
    Luke’s claim that “Christ was born in Bethlehem”. Assuming we know
    that Christ was born in Nazareth (“a tiny hamlet riddled with
    poverty” via Ehrman) independent of Luke, what is the probability
    that Luke would say otherwise? Possibly non-zero if he wanted his
    narrative to fit Micah’s earlier predictions regarding the
    birthplace of the savior. It is in this probability that we encode
    ad hominem beliefs about what Luke *would* say. **Note well** that
    \\(p(\\text{says H } | \\text{ not H})\\) is *not* the complement of
    \\(p(\\text{says H } | \\text{ H})\\). These two numbers are totally
    independent and capture separate aspects of the problem—the latter
    speaks to how likely a true event is written down, the former how
    likely a fabrication is made.

These three probabilities specify three different aspects of the
underlying model. If we can come up with numbers for all three, we can
answer the burning question: what are the odds that a story about Christ
is true?
\\[
\\begin{equation}
p(\\text{H } | \\text{ says H}) =
\\frac{ p\_\\text{useful} \\cdot p\_\\text{plausible} }{ p\_\\text{useful} \\cdot p\_\\text{plausible} + p\_\\text{lie} \\cdot (1 - p\_\\text{plausible}) }.
\\label{eq:tp3}
\\end{equation}
\\]

Said this way it’s not clear how valid the dissimilarity criterion is.
But after looking at the behavior of \\eqref{eq:tp3} for various
combinations of

-   \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H})\\),
-   \\(p\_\\text{plausible} = p(\\text{H}) \\), and
-   \\(p\_\\text{lie} = p(\\text{says H } | \\text{ not H})\\),

I convinced myself of its validity. We can’t visualize this function of
three dimensions easily, but here’s a sequence of charts that I think
will convince you.

Let \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H}) = 1\\), that
is, let’s assume H is the kind of story that, assuming it really
happened, would definitely be worth recording accurately. Let’s see the
behavior of the ultimate probability \\(p(\\text{H } | \\text{ says
H})\\), of whether to believe a historical source saying H, as we vary
\\(p\_\\text{lie}\\) and \\(p\_\\text{plausible}\\):

<div id="myDiv" style="width: 90%; height: 400px;">
</div>

What matters here is not the individual numbers, or an individual point
along one of these lines, but rather the observation that, for *all*
plausibility probabilities, the ultimate probability of whether to
believe H or not goes down as the probability of fabrication,
\\(p\_\\text{lie}\\) goes up. The highest and lowest lines, of
\\(p\_\\text{lie} = 0\\) (incorruptible authors) and \\(p\_\\text{lie} =
1\\) (fiction writers) are meant only to bound the space of allowable
results. If there’s even a suspicion that \\(p\_\\text{lie} =
p(\\text{says H } | \\text{ not H}) &lt; 1\\), that a historical author
may have written down something, H, that didn’t happen, like Luke
regarding the birthplace of Christ, that will decrease our belief in H.
If H is already implausible, i.e., \\(p\_\\text{plausible} \\ll 1 \\),
our belief drops a ton. If H is neither plausible nor implausible,
\\(p\_\\text{plausible} \\approx 0.5\\), our belief drops a middling
amount. If H is quite plausible, \\(p\_\\text{plausible} ≲ 1\\), our
belief drops a miniscule amount. The point is that it drops—the
historians can argue about how much it drops (i.e., what
\\(p\_\\text{plausible}\\) really is).

(A technical note not of interest to the general reader: note that for
\\(p\_\\text{lie} = p(\\text{says H } | \\text{ not H}) = 1\\), implying
the historical source is a complete fiction, our ultimate probability of
believing H \\(p(\\text{H } | \\text{ says H}) =
p\_\\text{plausible}\\). Our belief in H is unchanged by knowing that an
inveterate liar said H is true. Again, this is a technical sanity
check—I doubt any historical writer lies at this point.)

That was for \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H}) =
1\\). What about less useful stories H, which assuming are true were
less likely to be recorded?

<div id="myDiv-2" style="width: 90%; height: 400px;">
</div>

Above, I’ve shown the ultimate probability of believing H when
\\(p\_\\text{useful} = p(\\text{says H } | \\text{ H}) = 0.5\\), meaning
H is mundane enough that a contemporary may or may not record it. This
lower usefulness probability depresses all the curves (except for the
hyper-truthful assumption of \\(p\_\\text{lie} = 0\\)), but the basic
trend from before holds here: if there is any possibility that a
historic source might fabricate an event H, our belief in that event
should decrease.

(Another technical note of no interest to the general reader: as
\\(p\_\\text{useful}\\) drops, the lower bound on our ultimate
probability \\(p(\\text{H } | \\text{ says H}) <
p\_\\text{plausible}\\). Even if event H is 50% plausible, i.e., \\(p(H)
= 0.5\\), and reported by a compulsive liar (\\(p\_\\text{lie} =
p(\\text{says H } | \\text{ not H}) = 1\\)), our belief in H’s accuracy
is less than 50%, because it was not very likely to have been recorded
in the first place.)

As an extreme case, consider \\(p\_\\text{useful} = p(\\text{says H } |
\\text{ H}) = 0.1\\), i.e., the situation where Christ ate figs for
lunch on Passover 32 C.E.—intended to be a very mundane fact that a
contemporary is very unlikely to record (sorry if that example turns out
to be actually highly useful). Let’s just confirm that the same
principle holds: that our belief in the event H should drop if there’s
any likelihood of the author inventing H.

<div id="myDiv-3" style="width: 90%; height: 400px;">
</div>

Indeed this is the case.

This proved a tidy point but I now must ask myself—did I really need
Bayes rule to tell me (slightly) disbelieve something the (occasional)
liar wrote? Well, conditional probability is very tricky and can yield
surprising results sometimes, but not here—the math agrees with common
sense. But now I realize that \\(p\_\\text{lie} = p(\\text{says H } |
\\text{ not H})\\), the likelihood of the author inventing H, and
\\(p(\\text{H } | \\text{ says H})\\), whether we should believe the
event or not, don’t quite match up with Ehrman’s statement of the
dissimilarity criterion. Paraphrasing the quote at the top—if H is
something that the author would *want* to be true, then the criterion
advises more disbelief. Our probability model doesn’t consider whether H
is “helpful” to the author or not.

## The final example: the dissimilarity criterion

Above, in \\eqref{eq:tp3}, we expressed \\(p(\\text{H } | \\text{ says
H})\\), the probability that event H is true given that a historic
source reports it as truth, as a function of three variables:

-   \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H})\\), the
    likelihood that assuming H *is* true, the author would have recorded
    it;
-   \\(p\_\\text{plausible} = p(\\text{H}) \\), the likelihood that H
    could have happened even if we never read about H in a historical
    source; and
-   \\(p\_\\text{lie} = p(\\text{says H } | \\text{ not H})\\), the
    probability that, even though H was untrue, the author wrote it as
    truth anyway.

We can add the notion of whether H “helps” the author’s case or not be
expanding the belief probability \\(p(\\text{H } | \\text{ says H})\\):
\\[
\\begin{align}
p(\\text{H } | \\text{ says H}) = \\begin{cases}
\\cfrac{ p\_\\text{useful} \\cdot p\_\\text{plausible} }{p\_\\text{useful} \\cdot p\_\\text{plausible} + p\_\\text{lie} \\cdot (1 - p\_\\text{plausible}) }
\\&
\\text{assuming H helps}
\\\\
\\cfrac{
p\_\\text{useful}' \\cdot p\_\\text{plausible} }{ p\_\\text{useful}'
\\cdot p\_\\text{plausible} + p\_\\text{lie}' \\cdot (1 - p\_\\text{plausible}) }
\\&
\\text{assuming H doesn’t help}. \\end{cases}
\\end{align}
\\]
In words, the \\(p(\\text{H } | \\text{ says H})\\),
the probability that H is actually true given we read it in a historic
source, as given in \\eqref{eq:tp3} above corresponds only to the “H
helps” case. Now, that \\(p(\\text{H } | \\text{ says H})\\) depends on
whether H helps the author or not. The difference between the two cases
is that we replaced two probabilities with primed versions,

-   \\(p\_\\text{useful}\\) ⟹ \\(p\_\\text{useful}'\\) (note the prime,
    or apostrophe, to the upper-right of “p”), and
-   \\(p\_\\text{lie}\\) ⟹ \\(p\_\\text{lie}'\\).

Here are the formal definitions for these four probabilities:

-   \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H, H helps})\\)
-   \\(p\_\\text{useful}' = p(\\text{says H } | \\text{ H, H doesn’t
    help})\\)
-   \\(p\_\\text{lie} = p(\\text{says H } | \\text{ not H, H helps})\\)
-   \\(p\_\\text{lie}' = p(\\text{says H } | \\text{ not H, H doesn’t
    help})\\)

Although “H helps” and its complement (its opposite) “H doesn’t help”
are to the right of the bar, meaning they are taken as given in the
respective cases, I want to treat them as deterministic knowns. That is,
for any H, I think we can say whether H helps the author or not. You
could treat this as another random variable (like we do with “says H”
and “H”), then express \\(p(\\text{H } | \\text{ says H})\\) using total
probability, but I believe that won’t change the conclusion about the
dissimilarity criterion.

Separating \\(p(\\text{H } | \\text{ says H})\\) into two branches, with
different sets of \\(p\_\\text{useful}\\)s and \\(p\_\\text{lie}\\)s, is
nice because we can state two inequalities about the primed and unprimed
version of these probabilities:

-   \\(p\_\\text{useful} ≥ p\_\\text{useful}'\\), implying that, for an
    event H that actually happened, it’s more likely to be recorded if
    it helps the author than not; and
-   \\(p\_\\text{lie} ≥ p\_\\text{lie}'\\), since a fabrication that’s
    helpful is more likely to be written down than a fabrication that’s
    not.

In fact, if we make horrifically rough approximations, we could maybe
say:

-   \\(p\_\\text{useful} ≈ 1\\): if H is both true and helpful to the
    author, it’s highly likely they’ll record it; also,
-   \\(p\_\\text{lie}' ≈ 0\\): if H isn’t true and it doesn’t help the
    author, it wouldn’t have been written.

*If* these grotesque approximations were legitimate, then observe how
\\eqref{eq:2branch} simplifies:
\\[
\\begin{align}
p(\\text{H } | \\text{ says H}) ≈
\\begin{cases}
\\cfrac{ p\_\\text{plausible} }{p\_\\text{plausible} + p\_\\text{lie} \\cdot (1 - p\_\\text{plausible})} ≤ 1
\\&
\\text{assuming H helps}
\\\\
\\hfil 1 \\hfil
\\&
\\text{assuming H doesn’t help}.
\\end{cases}
\\label{eq:2branch}
\\end{align}
\\]
Hey! This is exactly the statement of the criterion of dissimilarity: our
belief in H, assuming it helps the author, is *less than or equal to*
when H doesn’t help the author. The two branches of this approximation
are only *equal* when \\(p\_\\text{lie} = 0\\), which we can probably
all agree is never the case—historic authors are likely to lie at least
occasionally.

But we don’t want to rely on such ghastly approximations. We can
corroborate the dissimilarity criterion without them by algebraic
massaging of both branches of \\(p(\\text{H } | \\text{ says H})\\),
depending on whether H helps the author or not. We can do this by
adapting the two reasonable inequalities mentioned above:

-   \\(p\_\\text{useful} ≥ p\_\\text{useful}'\\) ⟹
    \\(\\cfrac{p\_\\text{useful}}{p\_\\text{useful}'} =
    n\_\\text{useful} ≥ 1\\), and
-   \\(p\_\\text{lie} ≥ p\_\\text{lie}'\\) ⟹ \\(
    \\cfrac{p\_\\text{lie}}{p\_\\text{lie}'} = n\_\\text{lie} ≥ 1\\).

With these two variables, we can look at the ratio between the two
branches of \\eqref{eq:2branch}, because this ration will be less than
1, then the probability of believing a helpful H is *less than* an
unhelpful H. I hope I get this algebra right:
\\[
\\begin{align}
\\frac{ p(\\text{H } | \\text{ says H, H is helpful})}{ p(\\text{H } | \\text{ says H, H unhelpful}) }
\\&=
\\frac{p\_\\text{useful}}{p\_\\text{useful}'} \\cdot \\frac{ p\_\\text{useful}' \\cdot p\_\\text{plausible} + p\_\\text{lie}' \\cdot (1 - p\_\\text{plausible}) }{ p\_\\text{useful} \\cdot p\_\\text{plausible} + p\_\\text{lie} \\cdot (1 - p\_\\text{plausible})}
\\\\
\\&=
n\_\\text{useful} \\cdot \\frac{\\frac{p\_\\text{useful}}{n\_\\text{useful}} \\cdot p\_\\text{plausible} + \\frac{p\_\\text{lie}}{n\_\\text{lie}} \\cdot (1 - p\_\\text{plausible}) }{ p\_\\text{useful} \\cdot p\_\\text{plausible} + p\_\\text{lie} \\cdot (1 - p\_\\text{plausible}) }
\\\\
\\&=
\\frac{ a + b \\cdot \\left( \\cfrac{n\_\\text{useful}}{n\_\\text{lie}} \\right) }{ a + b } = n
\\end{align}
\\]
In the last step, I replaced bigger
expressions with simple variables, for aesthetic purposes—it helps us
see what comes next:

-   \\(a = p\_\\text{useful} \\cdot p\_\\text{plausible}\\), and
-   \\(b = p\_\\text{lie} \\cdot (1 - p\_\\text{plausible})\\), and
-   the ratio of the two branches’ probabilities is called \\(n\\).

Then it’s algebraically apparent that,

-   first,
    -   if \\(n\_\\text{useful} &lt; n\_\\text{lie}\\),
    -   then \\(n &lt; 1\\),
    -   so \\(p(\\text{H } | \\text{ says H, H is helpful}) &lt;
        p(\\text{H } | \\text{ says H, H unhelpful}),\\)
    -   which is equivalent to the dissimilarity criterion. 😄!
-   But,
    -   if \\(n\_\\text{useful} ≥ n\_\\text{lie}\\),
    -   then the dissimilarity criterion is contradicted.

We’ve just obtained a very simple requirement for the dissimilarity
criterion to hold: \\(n\_\\text{useful} &lt; n\_\\text{lie}\\). What
does this requirement really mean though? And when is it met?

Expand this requirement algebraically, and then I promise I’ll explain
it in prose.
\\[
\\begin{align}
\\Big( n\_\\text{useful} \\&< n\_\\text{lie} \\Big)
\\\\
\\Bigg( \\frac{ p\_\\text{useful} }{p\_\\text{useful}' } \\&< \\frac{ p\_\\text{lie} }{ p\_\\text{lie}' }\\Bigg)
\\\\
\\frac{ p(\\text{says H } | \\text{ H, H is helpful}) }{p(\\text{says H } | \\text{ H, H unhelpful}) } \\&< \\frac{p(\\text{says H } | \\text{ not H, H is helpful}) }{ p(\\text{says H } | \\text{ not H, H unhelpful}) }.
\\end{align}
\\]
Now in words: the criterion of dissimilarity is applicable when

-   a *helpful* true event is closer in probability to an *unhelpful*
    true event than
-   a *helpful* fabrication to an *unhelpful* fabrication.

(Conversely… the criterion of dissimilarity does *not* apply if this condition isn’t met.)

Now by way of example: imagine for a given H we’ve

-   selected numbers for
    -   \\(p\_\\text{useful} = p(\\text{says H } | \\text{ H, H is
        helpful})\\) and
    -   \\(p\_\\text{lie} = p(\\text{says H } | \\text{ not H, H is
        helpful})\\),
-   and we want to pick reasonable numbers for
    -   \\(p\_\\text{useful}' = p(\\text{says H } | \\text{ H, H
        unhelpful})\\) and
    -   \\(p\_\\text{lie}' = p(\\text{says H } | \\text{ not H, H
        unhelpful})\\).

The probability of an unhelpful truth getting recorded,
\\(p\_{useful}'\\), will be smaller than a helpful truth’s probability
of getting recorded \\(p\_{useful}\\). But how much smaller? Perhaps we
can say it won’t be very much smaller, say \\(p\_{useful} / p\_{useful}'
= 10\\), because after all, writers through the ages are prone to
recording truths because they find them interesting and not because they
further their agenda—“unhelpful” in our model. (Titus Livy remarked on
this, at the beginning of the Christian Era, when recounting a
then-four-hundred-year-old combat between Titus Manlius Torquatus and a
Gaulish giant who “in his stupid glee thrust his tongue out in
derision—for the ancients have thought even this worth mentioning”. This
was of course the fight in which the young tribune got that agnomen
“Torquatus”. From [The History of
Rome](http://www.perseus.tufts.edu/hopper/text?doc=Liv.%207.10.5),
translated by Benjamin Oliver Foster, book 7, chapter 10, though
Torquatus’ story begins at chapter 4 of that book.)

Similarly, the probability of an unhelpful *fabrication* getting
recorded, \\(p\_{lie}'\\), is less than the probability of a helpful
fabrication, \\(p\_{lie}\\)—again, “helpful” here means “helps the
author further their agenda” and is a quantification of the legitimacy
of an ad hominem attack. But perhaps, unlike the case of
\\(p\_{useful}'\\) above, we can say it is *very* unlikely that an
unhelpful fabrication is recorded, compared to the probability of a
helpful one, e.g., \\(p\_{lie} / p\_{lie}' = 100\\)?, because why would
a historical writer make something up if it didn’t further their cause,
unless they were an inveterate Marco Polo (or rather, Rustichello of
Pisa)?

So. **If** this relationship holds, where

-   a *helpful* true event is closer in probability to an *unhelpful*
    true event than
-   a *helpful* fabrication is to an *unhelpful* one,

then the criterion of dissimilarity is valid, and encourages us to
discount events that help an author further their agenda.

## Epilogue

Conditional probability is *really* tricky. By law, professors are
required to lecture on (or assign) the Monty Hall problem to their
probability classes—the same problem that Paul Erdős, the prodigious
traveling mathematician, who died twenty years ago on this day
[\[osu.edu\]](https://people.math.osu.edu/nevai.1/AT/ERDOS/erdos_washington_post.html),
got wrong but insisted otherwise, until they showed him proof by Monte
Carlo
[\[mwsug.org\]](http://www.mwsug.org/proceedings/2010/stats/MWSUG-2010-87.pdf),
although in his defense, most mathematicians who haven’t heard of the
puzzler get it wrong too
[\[wired.com\]](https://www.wired.com/2014/11/monty-hall-erdos-limited-minds/).

> For fun, an implementation of Monty Hall’s game is included in the
source of this webpage: if a thousand players use the “switch” strategy,
<span id="monty-hall-switchers">66.1</span>% of them win the car 🚗. If a thousand
players use the “stay” strategy, only <span id="monty-hall-stayers">34.1</span>% win
the car 🚗.
<button onclick="monteCarlo();">Click to recalculate.</button>

I say all this because, for me, the criterion of dissimilarity is an
interesting idea from “the wild” to which I could try to apply some of
my book learning. Book learning is usually not readily applied to
problems from the wild, and in my case, it’s terrifically hard. Add the
hyperfine subtleties of probability and I could very well have made
mistakes above. If you’re a historian, please don’t use this for your
Real Work, at least until you talk to someone you trust.

(Banner credit: Leonardo da Vinci’s *St John in the Wilderness*, circa 1510–1515, today in the Louvre, Paris, France. Reproduction via [Art and the Bible](http://www.artbible.info/art/large/704.html).)

<script src="dissim.compat.js" async></script>

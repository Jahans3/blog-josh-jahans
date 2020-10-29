---
title: Algorithmic Complexity for the Front End Dev
date: '2020-11-03'
---

Algorithmic complexity, runtime complexity, asymptotic complexity analysis and Big-O notation. Chances are
you've heard these terms before, whether it was as an undergraduate studying computer science or simply
while [reading the React documentation](https://reactjs.org/docs/reconciliation.html).

In this post I'll go over why this is a contentious issue in the front end community, as well as going over the fundamentals
before moving onto some more complicated examples.

## The Debate

Describing the complexity of algorithms mathematically using Big-O notation is a hot-button topic in front end
circles. Despite moves from some big players, [like Facebook](https://twitter.com/dan_abramov/status/1095133998584602626),
to shift away from rigorous testing of algorithms for front end engineer candidates it still plays a pivotal role in many
interview pipelines.

The main point of contention is that many consider these interviews to be academic snobbery, as well as a form of gate-keeping designed
to keep out those without a degree in mathematics or computer science. However, if you were to ask a machine learning engineer
they may respond by telling you runtime complexity is so fundamental to writing efficient code you would be mad to disregard
it.

So which argument is correct? Well, both are. Kind of. It is of course true one could build a great app without knowing the complexity
of bubble sort, but the importance of time complexity becomes apparent as the size of data sets increases.

What does this all mean? It means a large portion of software engineers regard it as fundamental to writing good code,
so chances are you will be tested on the subject multiple times throughout your career, even if it's only in interviews.

Bottom line: if you want to work at the hottest start-ups or a prestigious tech giant, you're probably going to want to
learn what's been causing all the fuss.

## What is Big O?

Enough about why we need to learn this, lets talk about what Big O is.

Big O is a mathematical description of the complexity of our algorithms. Say we have a function that takes an array as
input and iterates over that array one time for each element in the array, then our complexity would be directly proportional
to the size of the given array.

```javascript
function doSomething(arr) {
  for (let i = 0; i < arr.length; i++) {
    // do stuff
  }
}
```

We would describe the above as: `O(n)` where `n` is the size of the given input, which in this case is an array.

Another important thing about Big O is that we are describing the **worst case scenario**. This means that if we had an
algorithm similar to the above but when it found what it was looking for it broke out of the loop and completed, then the
complexity of that algorithm would be exactly the same as `doSomething` since we need to account for a scenario in which
the loop iterates to the very end of the array.

## What is Big O not?

By describing our algorithms using Big O notation what we are measuring is complexity and nothing else. A simple way of
putting it is this: we are describing how our algorithms **scale** with any given input.

Let's compare two functions that exactly do the same thing in different ways:

```javascript
function loopOne(arr) {
  let a, b;

  for (let i = 0; i < arr.length; i++) {
    a = i;
    b = i;
  }
}

function loopTwo(arr) {
  let a, b;
  
  for (let i = 0; i < arr.length; i++) {
    a = i;
  }

  for (let i = 0; i < arr.length; i++) {
    b = i;
  }
}
```

Both `loopOne` and `loopTwo` do exactly the same thing, they just take different approaches.
A common mistake people make when comparing the two functions would be to see that `loopTwo`
iterates over the given input twice and assume its complexity must be 2 times that of `loopOne`, but this is not the case.

Both `loopOne` and `loopTwo` increase in complexity in a linear fashion, directly proportional to *N*.
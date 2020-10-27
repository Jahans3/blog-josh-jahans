---
title: Writing Clean and Concise React Components by Making Full Use of ES6+ Features and the Container-Component Pattern
date: '2017-01-07'
---

* * *

This is one of a couple of articles that I wrote a while ago and re-hosted on this blog. Apologies if you've read it before.

* * *

## The Story So Far

If, like myself, you've ever created a website using the "standard" tools of plain old HTML or templates,
preprocessed CSS, and JavaScript, then you may also have shared the same delight I did when React came
along and offered a way to easily break a website or app into manageable, reusable chunks.

This also came at a time when JavaScript was maturing immensely, going from what some considered a "toy language"
to [one of the most popular languages out there today.](https://insights.stackoverflow.com/survey/2017#technology)
After promises came on the scene we could forget about writing sideways pyramids and getting ourselves into callback hell.
Then along came async/await, and now most of us try to avoid those "messy and confusing" promise chains wherever possible.
We are spoiled for choice.

Then along came Flux, after that Redux. State management just got a whole lot easier, and
[although you might not always need it](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367), Redux is
often the go-to state management tool for a lot of developers. That little extra initial setup often goes a long way
and saves us major headaches further down the line.

As the language evolves so fast it's hard to keep track of all the new features, so this article is about my personal
opinion on how to make the best use of them to improve your components without sacrificing anything whatsoever.

I should point out here that in all my examples I'll be using React Native, but the principles are exactly the same
in React… So let's get into it!

## Container Component Pattern

A remarkably simple pattern that enables you to make full use of React's composability, which can be simply
explained as your container handles the functionality and renders your component, while your component is concerned
with displaying the data fetched by your container.

Here's a container:

 `gist:4397d5c2798ae5099b3300935ff3598e`

 Now I know what you’re thinking, that’s just a React component? Well, you’re right. What’s key here though,
 is that your container component is fully separated from your stateless component and is only concerned with
 data, passing anything relevant through to your component to be rendered.

 The component should just be a stateless functional component. If you haven’t heard the term before - it’s
 exactly what it sounds like: a component that is a function and has no state. Here’s a simple example:

 `gist:b84bd5e39c1801ede4b9d3367c59a5cc`

An oft-overlooked benefit is the double PropType checks that this pattern essentially enforces. When raw props
are passed to your container, the ones that you manipulate will be flagged by your linter and, unless you enjoy
squiggly red lines, you add them to your PropType checks. For the rest of the props, the ones you know exist but
your container has no business handling, you should spread them into your component. You can see this in the above
code snippet, where the button object is spread into the Button component.

The second layer of safety this pattern offers comes from your component’s PropType checks, your first layer of
defence is your container’s PropType checks, which simply check the values passed are what you expected. Your
component can then check that the props were manipulated properly inside your container, without this pattern this
second check would not be possible. This is a little extra setup for a lot less headaches as your app grows.

For a more in-depth explanation of the pattern, [check this article out](https://medium.com/@learnreact/container-components-c0e67432e005).

## Helpful Features of ES6, ES67 and Beyond

In this part of the article I’ll be talking about how to make use of the latest features from the ECMAScript
standard that can help make your life easier and your code easier on the eyes.

### *Class Properties*

One of the simplest of the new ES features is also one of my favourite. This one simple feature allows you to
very often do away with the constructor method in your classes. So what is it? Put simply, class properties allow
defining a class property outside any of your class’ methods.

To show you just how beneficial this one simple feature can be, here’s a component that doesn’t use class properties:

`gist:22f5ee25572a5e8d0f3a05984c804cce`

And here’s the exact same component, but with class properties:

`gist:3c4419900e511bc89731553d1279e4cf`

By combining this feature with other, more well-known new ES features like arrow functions, which don’t open up a new context,
we have managed to cut a third of the lines out of our container file. We have no need for a constructor anymore, nor do we need
to bind the context of our class methods to the class’ context either.

I'll also use this space to quickly explain that it isn't always necessary to pass `props` to `super` inside your constructor. `props`
will always be bound to `this`, it just happens after the contructor in the component lifecycle, which means if you want to use `this.props`
inside your contructor or you want to call a method that references `this.props` from your constructor, then you will need to call
`super(props)`.

### *Static Methods and Properties*

Following on nicely from class properties are static methods and properties. Using static methods you can use parts of a class
without having to instantiate an entirely new instance of said class. They are called by referencing the un-instanced class
followed by the property name, if you use static on a method however this will of course exclude you from accessing `this` inside
that method, since the class has not been instantiated.

How does this benefit React components? Well, aside from clearly indicating to anybody reading your code that `this` will not be
used, you can also use it to bring propTypes and defaultProps inside the class body. This one is purely personal preference, but, in
my opinion, it looks quite a bit nicer than trailing your PropType checks after your class is defined.

Here’s an example:

`gist:c60efc051ac3b5cecd72b4f337069b89`

### *Decorators*

*⚠️ Important Note: decorators are still considered an experimental syntax meaning they could still be subject to change.*

Decorators have been around in other languages for some time. The concept in JavaScript is simple; decorators provide a
syntactically-sexy way of wrapping your classes and functions, and adding extra functionality.

The most common use case of decorators with React is using React-Redux’s connect function as a decorator. The concept is
simple, so here’s a couple of examples to illustrate how much more elegant they can make your code.

Without decorators:

`gist:a10dee33a5101213c610afff23a47740`

With decorators:

`gist:328718bb6f116c15f8b19374a91b4f5d`

Since this is just syntactic sugar for wrapping something, they can be chained as many times as you like. In my opinion,
this is where decorators really make your code much prettier.

Without decorators:

`gist:838cce156fc34835fc5436145a58d3c8`
<p style="text-align: center"><sup>Yo dawg... I heard you like to wrap functions</sup></p>

With decorators:

`gist:77fe22c84ba28c374659c24a0b93d89e`

### *Object Spread + Generate Props*

Object spread is one of the better-known new ES features, so I won’t talk about it too much, I’ll just briefly explain what it
is and show you how I use it. I should mention that the ‘generate props’ method I’m about to show you here was an old co-workers
idea that I have shamelessly taken and used ever since he first showed me.

So what is object spread? Well, to put it simply, it assigns all the properties of an object onto another object, one by one, at
the top level. Think Object.assign. The syntax has become quite ubiquitous now, so whenever you see ‘…’ prefixing a variable inside
an object or array, you’re looking at the spread operator. There is array spread, object spread, object rest spread and rest
parameters which all use the same ‘…’ syntax. Object rest spread and rest parameters are a little different, however, so I won’t go
into those here.

So what is generate props? Well, it’s a great little trick for passing props to a component from a container. It’s nothing
groundbreaking, but it does offer a way to clearly see the props you’re passing and do minor manipulations on them before you
do so. The idea is simple, have a function that returns all your props, then spread those props into your component to avoid
having a big messy lump of JSX inside your render method. Unfortunately, using generate props will not work unless you are using
the container-component pattern, as you will see in the examples below.

Using this method won’t necessarily shorten your code, but it does offer some advantages over the traditional method of passing
props. Firstly, everything you want to pass as props is spread into generate props, the result of which is spread into your
component, so once it’s all linked up, you can freely pass props down chains of components without having to open up the
intermediate components. Now, it’s worth mentioning that passing props deeply isn’t recommend, but sometimes it’s unavoidable.
Secondly, you have a nice object representation of the props you’re passing, cutting down on JSX and giving you a single point of
reference for which props you’re passing in. You’re also free to spread in any other objects, such as your state.

It’s worth noting that this may lead to some redundant props being passed down, however with the advent of functional programming
some minor (but unnoticeable) performance hits are expected in order to increase code reuse and readability, amongst other benefits.

Once again, let’s look at an example with, and an example without.

Without generate props:

`gist:7f3946dfbcb802879e5f4bade3bd1ed1`

And using generate props:

`gist:a2e191d7a9b5d84a5f82ca96c38066f2`

I just want to emphasise that in article full of personal preferences and opinion, this one is more so than the others.

## In Summary

JavaScript and the ecosystem surrounding React is advancing at a rapid pace. This is just an example of how I use some of
the new features on offer to make coding more enjoyable, and to cut down on a lot of the boilerplate involved in writing
complex applications.

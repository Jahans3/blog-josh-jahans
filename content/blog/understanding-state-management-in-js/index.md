---
title: Understanding State Management in JavaScript by Building a Library Similar to Redux
date: '2018-12-03'
---

* * *

This is one of a couple of articles that I wrote a while ago and re-hosted on this blog. Apologies if you've read it before.

* * *

> For anyone who wants to skip the article and see the end result, I’ve taken what I’ve written here and made a library out if it using hooks: [use-simple-state](https://github.com/Jahans3/use-simple-state). It has zero dependencies (other than react as a peer dependency) and at just 3kb, it’s pretty lightweight.

In recent years the scope of web applications has increased dramatically and as the requirements for our apps grow, so does the complexity. In order to make this added complexity easier to deal with, certain techniques and patterns are increasingly being used to make developer’s lives easier and to help us build more robust applications.

One of the main areas where complexity has grown is in managing our application’s state, so to combat this developers are using libraries that provide abstractions for updating and accessing their app’s state. The most notable example being [Redux](https://redux.js.org/introduction/getting-started), which is an implementation of the [Flux pattern](https://facebook.github.io/flux/docs/in-depth-overview.html#content).

Once a developer has learned how to use a library like Redux, they may still be left wondering just how exactly everything is working “under the hood” since it’s not obvious at first, even if the more general concept of updating a globally-available object is easy to grasp.

In this article we’ll build our own state management solution for a React application, completely from scratch. We’ll start with a basic solution that can be implemented in just a few lines of code and gradually work in more advanced features until we have something resembling Redux.

## The Basic Idea
Any state management tool needs only a couple of things: a global state value available to the entire application, as well as the ability to read and update it.

Just to show you how simple a state manager can be, here’s a barebones vanilla JavaScript implementation:

`gist:96806d9ac0ea161e768e2692e9eaaf56`
<p style="text-align: center"><sup>That’s it, seriously.</sup></p>

The above example is as basic as it gets, yet it still ticks all the boxes:

* A globally-available value representing our app’s state: `state`
* Ability to read our state: `getState`
* Ability to update our state: `setState`

The above example is too simple for most real-world applications so next we’re going to start implementing a workable solution for use in a React app. We’ll start by refactoring the previous example to make it work in React and build on from there.

## State Management in React

In order to make a React-based version of our previous solution we’re going to need to leverage two React features. The first feature being plain old class components, a.k.a [stateful components](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class).

The second feature is the [context API](https://reactjs.org/docs/context.html), which is used to make data available to your entire React application. A context has two parts: a provider and a consumer. The provider, as the name suggests, provides the context (data) to an application. While a consumer is used when we want to access a context.

A good way to understand context is this: if *props* are used to **explicitly** pass data through your components, then *context* is used to **implicitly** pass data.

## Building our State Manager

Now we know the tools we want to use, it’s just a case of putting them together. All we’re going to do is create a context to hold our global state, then wrap that context’s provider in a stateful component and use that to manage the state.

First off, let’s create our context using `React.createContext`, this gives us our `Provider` and `Consumer`:

`gist:7a0eb78b10662597adec55d551d5ef38`
<p style="text-align: center"><sup>Baby steps.</sup></p>

Next, we need to wrap our `Provider` in a stateful component in order to leverage it to manage our app’s state. We also want to export the consumer with a more specific name:

`gist:2ec6438dcb2df2015b7dc6e91ffedce5`
<p style="text-align: center"><sup>So far so good</sup></p>

In the above code sample, our `StateProvider` is simply a component that accepts a `state` prop as the initial state and makes whatever is contained in that prop available to any component underneath it in the component tree. If no state is provided then an empty object is used instead.

Using our `StateProvider` is as simple as wrapping it around our application’s root component:

`gist:fdad0fa6aa931f7f305bb97161d3c91b`
<p style="text-align: center"><sup>Simples</sup></p>

Now we’ve done that, we can access our state from anywhere inside `MyApp` using a consumer. In this case we’ve also initialised our state to be an object with a single property: `count`, so whenever we access our state now, that is what we will find.

Consumers use [render props](https://reactjs.org/docs/render-props.html) to pass the context data, this can be seen below where a function is a child of `StateConsumer`. The `state` parameter passed to that function represents our application’s current state, so as per our `initialState`, `state.count` will be equal to `0`.

`gist:07bb5fef1455317dcce9cd56db497474`
<p style="text-align: center"><sup>Accessing our app’s state</sup></p>

An important thing to note about our `StateConsumer` is that it automatically subscribes to changes in the context, so when our state changes the component will re-render in order to display the updates. This is just the default behaviour for consumers, we haven’t done anything to enable it.

## Updating State

So far we’ve built something that allows us to read our state, as well as automatically update when it changes. Now we need a way to update the state of our app, to do this we’re simply going to update the state in our `StateProvider`.

As you may have noticed earlier, we passed a prop called `state` to our `StateProvider`, which was then passed to the component’s state property. This is what we will be updating, using React’s built-in `this.setState` method:

`gist:0e61c2a960be5a39038c30ab0baea7a9`
<p style="text-align: center"><sup>Don't forget to bind `this` to the current scope, so it doesn't change when called</sup></p>

Continuing the theme of keeping it simple, we’ve just passed `this.setState` to our context. This meant we had to change the value of our context slightly; instead of only passing `this.state` we’re now passing an object with two properties: `state` and `setState`.

Whenever we use our `StateConsumer` we’ll use a [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get `state` and `setState`, so now we can read from and write to our state object:

`gist:d5de84f02f0a41e98b18401b0e2ad51c`

Something to note is that since we’ve simply passed React’s built-in `this.setState` method as our `setState` function, additional properties will be merged with the existing state. This means that if we had a second property in addition to count then it would be preserved automatically.

Now we’ve built something that could work in the real world (albeit not very efficiently). It’s got a simple API that should feel familiar to React developers, plus it leverages built-in tools so we haven’t added any new dependencies either. If state management libraries felt a bit ‘magical’ before, hopefully we’ve already been able to shed some light on what the internals of one might look like.

## Bells and Whistles

Those of you already familiar with Redux may have noticed that our solution is lacking in a few areas:

* It has no built-in way of handling side effects, functionality you’d get via [Redux middleware](https://redux.js.org/advanced/middleware).
* Complex state updates would be messy when written inline with our `setState` function and we’re relying on React’s default `this.setState` behaviour to handle our state update logic, there’s also no built-in way of reusing state updates, something you get from [Redux reducers](https://redux.js.org/basics/reducers).
* We’ve also got no way of handling [asynchronous actions](https://redux.js.org/advanced/async-actions), which is usually provided by libraries like [Redux Thunk](https://github.com/reduxjs/redux-thunk) and [Redux Saga](https://github.com/redux-saga/redux-saga).
* Crucially, we have no way for our consumers to subscribe to *part* of the state, meaning that when any part of our state updates every consumer will re-render.

To overcome this, we’re going to emulate Redux by implementing our own actions, reducers, and middleware. We’ll also add built-in support for async actions. After that, we’re going to implement a way for our consumers to only listen for changes in a subset of our state. Finally we’ll also look at how we can refactor our code so we’re using the brand new [Hooks API](https://reactjs.org/docs/hooks-intro.html).

## A Brief Introduction to Redux

> Disclaimer: the following is only meant to give you enough of an understanding to continue with the article, I’d highly recommend reading the official introduction to Redux for a more thorough explanation.
If you already have a good understanding of Redux, feel free to skip this bit.

Below is a simplified diagram of the data flow in a Redux application:

<div style="width: 100%; display: flex; align-items: center; justify-content: center">
<img src="https://i.imgur.com/DSE5LGc.png" />
</div>
<p style="text-align: center"><sup>Redux data flow</sup></p>

As you can see, there is a *one way* data flow — we *dispatch* an action from which our reducers derive an updated state, no data is traveling back and forth between different parts of our application.

In a bit more detail:

First, we dispatch an action which *describes* a change to our state, e.g. `dispatch({ type: INCREMENT_BY_ONE })` to increase a number by 1. Contrast this to our previous, more imperative method whereby we essentially manipulated the `count` state directly: `setState({ count: count + 1 })`.

The action then passes through our *middleware*. Redux middlewares are optional functions that can perform side effects as a result of actions, e.g. if a `SIGN_OUT` action is dispatched you may use a middleware function to remove all user data from local storage before passing the action along to your reducer. If you’re familiar with middleware in [Express](https://expressjs.com/), this is a very similar concept.

Finally, our actions arrive at our reducers which take the action, as well as any accompanying data, and use that plus the existing state to derive a new state.

Let’s say we dispatch an action called `ADD` and we also send an accompanying value (called a *payload*) which is the amount we wish to add to our state. Our reducer will check for an ADD action, when it finds one it will take the payload as well as the current value in our state and add the two together to produce our updated state.

The function signature for a reducer is as follows:

<p style="text-align: center">
<code class="language-text">(state, action) => nextState</code>
</p>

A reducer should simply be a function of `state` and `action`. The API is simple yet powerful. A key thing to note is that reducers should always be [pure functions](https://en.wikipedia.org/wiki/Pure_function), so that they are always deterministic.

### Actions + Dispatch

Now that we’ve briefly gone over some of the key parts of a Redux app, we need to modify our app to emulate the same behaviour. First things first: we need some actions and a way to dispatch them.

For our actions we’re going to use action creators, these are simply functions that create actions. Action creators make testing, reusing, and passing payloads to our actions much easier. We’re also going to create some action types, these are just string constants, since they’ll be re-used in our reducers we’ll store them in variables:

`gist:1776ac423d9bf82f658824fba4e2da67`
<p style="text-align: center"><sup>So far, so good</sup></p>

For now, we’re going to implement a placeholder `dispatch` function. Our placeholder will just be an empty function, which we’ll use to replace the `setState` function in our context. We’ll come back to this in a moment, since we don’t yet have any reducers to dispatch our actions to.

`gist:fb770633b1d1000829378de8c9042003`

### Reducers

Now we’ve got actions we just need some reducers to send them to. Thinking back to the reducer function signature, it’s simply a pure function of actions and state:

<p style="text-align: center">
<code class="language-text">(state, action) => nextState</code>
</p>

Knowing this, all we need to do is pass our component’s state and the dispatched action into our reducers. For the reducers, we simply want an array of functions that adhere to the above signature. We use an array so that we can simply iterate over it using `Array.reduce` until we arrive at our new state:

`gist:cc6787f6e31e5d961d74012f5c21083d`

As you can see, all we do to get our new state is to compute it using our reducers, then just like before we simply call `this.setState` to update `StateProvider`‘s component state.

Now we just need an actual reducer:

`gist:7c75d1169e95b6e0b1a3668ea6c59143`

Our reducer just checks the incoming `action.type` and if it finds a match it’ll update the state accordingly, otherwise we just fall through the `switch` statement and return an `undefined` value from our function by default. An important difference between Redux’s reducers and our own is that when we don’t want to update the state, usually because we didn’t find a matching action type, we return a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, whereas with Redux you would return the unchanged state.

And pass our reducer to our `StateProvider`:

`gist:81220bef8d7e500b4020a4471d991a06`
<p style="text-align: center"><sup>Our reducers need to be passed in an array, even if there’s only a single reducer</sup></p>

Now we can finally dispatch some actions and watch our state update according to which ones we send:

`gist:4984b39287ebdb97fa247f8ecf331dcb`
<p style="text-align: center"><sup>Reducers done!</sup></p>

### Middleware

Now we’ve got something that resembles Redux a fair bit, we just need a way to handle side effects. To achieve this we’re going to allow our user to pass middleware functions that will be called whenever an action is dispatched.

We also want our middleware functions to be able to bail us out of state updates, so if `null` is returned from one we won’t pass the action to our reducer. Redux handles this a little differently — in Redux middleware you need to manually pass the action along to the next middleware, if it is not passed along using Redux’s `next` function the action will not reach the reducer and the state will not update.

Now let’s write a simple middleware. We want it to look for an `ADD_N` action, if it finds one it should print the sum of the `payload` and the existing `count` state, but block the actual state update:

`gist:2227d51453db444ffd7025950004b25d`

Just like our reducers, we’ll pass any middlewares to our `StateProvider` in an array:

`gist:71069ab43169acdc6cde74c050b0d603`

Finally we need to call all of our middleware and use the result to determine whether or not we want to abort an update. Since we’ve just passed an array and we’re looking for a single value, we’re going to use `Array.reduce` to get our result. Just like with our reducers we’ll iterate through the array while calling each function, then pass the result to a variable that we’ll name `continueUpdate`.

Since middleware is considered an [advanced feature](https://redux.js.org/advanced/advanced-tutorial) we don’t want it to be mandatory, so if no `middleware` prop is found in our `StateProvider` we’ll make `continueUpdate` equal `undefined` by default. We’ll also add a `middleware` array as the default prop, just so `middleware.reduce` doesn’t throw an error if nothing is passed.

`gist:7a46c3b8d73b792c60438d29d625b0c8`

As you can see on line 13, we check to see what our middleware functions return. If a `null` value is encountered we will skip the rest of the middleware functions and the value of `continueUpdate` will be `null`, meaning we will abort the update.

### Asynchronous Actions
Since we want our state manager to be useful in the real world we’re going to add support for async actions, which will mean we can handle common tasks like network requests with ease. We’re going to borrow from [Redux Thunk](https://github.com/reduxjs/redux-thunk) a bit here since the API is simple, intuitive, and powerful.

All we’re going to do is check to see if an uncalled function was passed to `dispatch`, if we find one we’ll call it while passing `dispatch` and `state` which gives the user everything they need to write async actions. Take this authentication action as an example:

`gist:db3c8b4aa65630f5cac44de946034215`

In the above example we have an action creator called `logIn`, instead of returning an object however, it returns a function that accepts `dispatch`. This allows the user to dispatch synchronous actions before and after an asynchronous API call. Depending on the result of the API call a different action will be dispatched, in this case we send an error action if something goes wrong.

Implementing this is as easy as checking `action` for a function type in the `_dispatch` method in our `StateProvider`:

`gist:69a58b95452c53e8f2e1a969c62396eb`

Two things to note here: where we call `action` as a function we pass `this.state` so the user can access the existing state inside the async action, we’re also returning the result of the function call, allowing developers to get a return value from their async actions which opens up more possibilities, such as chaining promises from `dispatch`.

### Avoiding Unnecessary Re-renders
Something that often gets overlooked yet is an essential feature of Redux (or more accurately, [React-Redux](https://github.com/reduxjs/react-redux) — the React binding for Redux) is it’s ability to only re-render a component when necessary. To achieve this it uses the `connect` [higher order component](https://reactjs.org/docs/higher-order-components.html), which takes a mapping function — `mapStateToProps` — and will only trigger a re-render of the component it’s attached to when the output of `mapStateToProps` (just `mapState` from now on, for brevity) changes. If this were not the case then every component that uses `connect` to subscribe to store changes would be re-rendered *every single time the state updates*.

Thinking about what we need to do, we’re going to need a way to store previous outputs of `mapState` so we can compare it to any new results to decide if we want to go ahead and re-render our component. To do this we’re going to use a process called [memoization](https://en.wikipedia.org/wiki/Memoization). Like many things in our industry it’s a big word for a fairly simple process, especially for us since we can leverage `React.Component` to store the subset of our state in `this.state` and only update it when we detect changes in the output of `mapState`.

Next we’re going to need a way to skip unnecessary component updates. React provides an easy way for us to do this by using the lifecycle method `shouldComponentUpdate`. It takes any incoming props and state as parameters which allows us to compare the values to our existing props and state, if we return true the update will go ahead but if we return `false` React will skip rendering.

`gist:f42a8adee1c7072894bc5d37fe5dcbd3`

The above is an outline for what we’re going to do next. It has all the main pieces in place: it receives updates from our context, it implements `getDerivedStateFromProps` and `shouldComponentUpdate`, and it also takes a render prop as a child — just like the default consumer. We also initialise our consumer’s initial state by using the passed `mapState` function.

As it is right now though, `shouldComponentUpdate` will only render once when it receives the first state update. After that it will log the incoming and existing state and return `false`, blocking any updates.

The above solution also calls `this.setState` inside `shouldComponentUpdate` and as we know `this.setState` always triggers a re-render. Since we’re also returning `true` from `shouldComponentUpdate`, this will cause an additional re-render, so to get around this we’re going to derive our state using the lifecycle `getDerivedStateFromProps`, then we’ll use `shouldComponentUpdate` to determine whether we want to carry on with the rendering process based on our derived state.

If we inspect our console we can see that the global state updates, while our component blocks any updates to it’s `this.state` object and therefore skips rendering:

<div style="width: 100%; display: flex; justify-content: center; align-items: center">
<img src="https://i.imgur.com/HAJuyaD.png">
</div>
<p style="text-align: center"><sup>Three attempts to update state, but thisState only changes once</sup></p>

So now that we know how to prevent an unnecessary update we need a way to intelligently determine when our consumer should render. If we wanted to we could [recurse](https://en.wikipedia.org/wiki/Recursion_%28computer_science%29) over an incoming state object and check every single property to see if it’s changed, but while this would be a good exercise to improve our understanding it could be bad for performance. We can’t know how deep or complex any incoming state object might be and a recursive function will happily carry on indefinitely if the exit condition is never met, so we’re going to limit the scope of our comparison.

Just like Redux, we’re going to implement a shallow compare function. “Shallow” here refers to the depth of the properties at which we’re going to see if our objects are equal, meaning we’re only going to check 1 level deep. So we’re going to check if each property at the top level of our new state is equal to a property of the same name on our existing state, if properties of the same name don’t exist or they have different values, we’ll proceed with rendering, otherwise we assume our states are the same and we abort the render.

`gist:f346b09af7ebdf2de369e7550844156c`
<p style="text-align: center"><sup>Our shallow comparison function</sup></p>
First we start off with a simple check that will look at whether both states are objects, if not then we skip rendering. After this initial check we convert our current state into an array of key/value pairs and check the values of each property against that of our incoming state object by reducing the array into a single boolean.

That’s the hard part out of way. Now that we want to use our `shallowCompare` function it’s essentially just a case of calling it and checking the result. We're going to directly return the result of `shallowCompare` from `shouldComponentUpdate`, meaning if it returns `true` we will allow the re-render, but if it returns `false` we'll skip the update (and our derived state will be discarded). We also want to apply our `mapDispatch` function, if it exists - here we simply use a default if not (`s => s`).

`gist:4dbc491098732fce0080319b73f75aca`
<p style="text-align: center"><sup>Surprisingly simple</sup></p>

Lastly we need to pass a `mapState` function to our consumer that only maps part of our state, so we’ll pass it as a prop to our updated `StateConsumer`:

`gist:74ad5c348fba7a43aca8197c9abe8f39`

And now we’re only subscribed to changes in `greeting`, so if we update `count` our component will ignore the changes in our global state and avoid a re-render.

## Quick Recap
If you’ve made it this far you’ll have seen how to implement a Redux-like state management library, complete with reducers and actions. We’ve also covered more advanced topics, such as asynchronous actions, middleware, and how to make it so we only receive the state updates we want to avoid re-rendering our consumers each time the global state updates.

While Redux has a lot more going on under the hood than our solution, hopefully this has helped clear up some of the core concepts and shown that while Redux is generally considered to be more of an advanced topic, it’s implementation is relatively simple.

For a more thorough understanding of Redux’s internals, I’d highly recommend reading the [source code](https://github.com/reduxjs/redux/tree/master/src) on Github.

The solution we have so far has all the tools and attributes necessary to be used in a real-world project now. We could start using this in a React project and we wouldn’t need Redux unless we wanted to access some of the really advanced features.

## Hooks
If you haven’t yet heard, hooks are quickly becoming the next big thing in React. Here’s a brief explanation from the official introduction:

> Hooks are a new feature proposal that lets you use state and other React features without writing a class.

Hooks give us all the power of higher order components and render props with a cleaner and more intuitive API.

Let’s take a look at how they work using a quick example showing the basic hook `useState`:

`gist:1a1aa337c63fc288fda2231ce8baf1d0`

In the above example we initialise a new state by passing `0` to `useState` which returns our state: `count`, as well as an updater function: `setCount`. If you’ve not seen this before you may wonder how `useState` doesn’t get reinitialised to `0` on every render — it’s because React handles this internally, so we don’t need to worry about that.

So let’s forget about middleware and async actions for a moment and re-implement our provider using the `useReducer` hook, which works just like `useState`, except actions are dispatched to a reducer from which the new state is derived, just like what we’re building.

Knowing this, we simply copy our reducer logic from our old `StateProvider` into our new, functional `StateProvider`:

`gist:68e4b0e6c68b392a4e5751ad98d16666`

That’s how simple it can be, but while we want to keep things simple, we still aren’t fully harnessing the power of hooks just yet. We can also use hooks to swap our `StateConsumer` for our own custom hook, which we’ll do by wrapping the useContext hook:

`gist:beaa9d7824f7c5de0c550597abf79392`
<p style="text-align: center"><sup>Easy peasy</sup></p>

Whereas before we were destructuring `Provider` and `Consumer` when we created our context, this time we store it in a single variable which we pass to `useContext` in order for us to access our context without a consumer. We’ve also named our custom hook `useStore`, since `useState` is a default hook.

Next we simply refactor the way in which we consume our context:

`gist:bc095fda590449a9d83d57974afc1ee6`

Hopefully these examples have gone some way in showing how intuitive, simple, and powerful hooks are. We’ve reduced the amount of code needed and given ourselves a nice, simple API to work with.

We also want to get our middleware and built-in support for asynchronous actions working again. To do this we’re going to wrap our `useReducer` inside a custom hook, one to be used specially in our `StateProvider`, and then simply re-use the previous logic from our old stateful component.

`gist:b7d848204dd1a624f94e99581ce7e3c9`

As with our old solution, we want middleware to be optional, so we add an empty array as a default again — although this time we use a default parameter instead of default props. Similar to our old dispatch function, we call our middleware and, if `continueUpdate !== null` we carry on with the state update. We’ve also made no changes to how we handle async actions.

Finally, we pass the result of `useStateProvider` and it’s parameters to our provider, which has shrunk considerably:

`gist:383f033315d5a628b2c87afc75711a2a`

And that’s it! 🎉

## However...
One thing you may have noticed is that our hooks implementation has no way to skip unnecessary updates. This is because of how hooks are called in the body of a function component — at that stage React has no way of bailing out of the rendering process (not without some hacks). There’s no need to worry though, [the React team are aware of this](https://github.com/facebook/react/issues/14110) and it appears their plan is to provide a way for us to abort an update from functional components or for `useContext` hook to be able to partially subscribe to context.

Once we’ve got an official way to bail out of rendering inside a function component I’ll come back here and update this blog post. In the meantime, the library I’ve written out of the hooks implementation comes with a consumer so we can access this functionality.

## In Summary

To summarise, we’ve taken a look at the most barebones state manager possible and incrementally built upon it until we ended up with something resembling Redux — complete with actions, reducers, middleware, and a way to diff state updates to improve performance. We’ve also looked at how we can simplify our code using the brand new hooks API.

Hopefully you’ve found something useful in this article and I was able to shed a bit of light on some more advanced concepts while showing that a lot of the tools we use may be more simple than they first appear.

> As briefly mentioned at the beginning, I’ve written a library, Use Simple State, off the back of this article. You can see it on on my Github page, where I’ve used hooks for the final implementation, which includes a couple of additional features.

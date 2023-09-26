# Claire Merrell - Glorious Gumball Insurance Eligibility Dashboard
A demo applet that matches mock employees, retirees, and their dependents to an insurance eligibility timeline graph.

### Stack
* Typescript
* Vue 3
* Pinia (vue 3 state management)
* Vite (bundler & SPA server)
* Vue router
* Node 20 & npm

## Usage / Getting Started
Requirements:

Install Node 20.x if you don't have it:
```bash
nvm install 20
``` 

(To install nvm if you don't have it) - From [nvm source](https://github.com/nvm-sh/nvm): 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

Install the rest of the package dependencies:
```bash
cd /path/to/app/directory
npm install
```

Run the dev server
```bash
npm run dev
```

### Recommended vscode extensions for navigating the code:
- Vue Language Features (Volar)
- Typescript Vue Pluging (Volar)

**Note** Make sure any extensions for older versions of Vue are disabled.

## Unit tests (Vitest)
Unit tests are built around the test runner `Vitest`. It's syntactically similar to jest, with similar testing strategies.

Tests are outcome-driven on the following pattern:
- Test baselines (e.g. - mount & render for all possible component input states).
- Simulate possible user interactions and test that they result in the correct output.

### Running unit tests
All tests:
```bash
npm run test:unit
```

A specific file:
```bash
npm run test:unit -- fullOrPartial/filePath/from/src
```

For coverage:
```bash
npm run test:unit -- --coverage
```

## Code Highlights
Here are some simple run-downs of the most significant portions of the code.

Most of it is in the [src/views/eligibility](src/views/eligibility) directory.

- [Data Layer](#data-layer)
- [Component Tree](#component-tree)
- [Canvas Timeline](#canvas-timeline)
- [FlexHud](#flexhud)

### Data Layer
The root view component `src/views/eligbility/EligibilityDashboard.vue`(src/views/eligibility/EligibilityDashboard.vue) makes a call with the native JS `fetch` api to simulate querying the data set. This isn't pulling from a live data source, so it hosts its own mock data file in the public directory, and the app fetches that as if it were external:
- [src/views/eligibility/data/parseClaimants.ts](src/views/eligibility/data/parseClaimants.ts)

This takes each claimant record from the fetched json array and constructs a javascript class `Claimant` out of it:
- [src/views/eligibility/model/Claimant.ts](src/views/eligibility/model/Claimant.ts)

The Claimant class uses several other types and classes within the same `model` folder to shape the retrieved data into something easier to use in the view's component tree.

**Note:** There's a small performance vs. readability tradeoff in the Claimant constructor: 
- More readable: `Array.filter(...).map(...).reduce(...)`
  - Performance complexity: `O(3n)`
- More performant: `Array.forEach(...)`
  - Performance complexity: `O(n)`

A negligible performance cost for small data sets, but noteworthy for very large sets.

### Typescript
Everything is typed. Lots of it uses hooks that are new in vue 3 to leverage automatic type inference

### Component Tree
The component tree is broken into 3 main panels:
- [People](src/views/eligibility/components/people/)
- [History](src/views/eligibility/components/history/)
- [Claims](src/views/eligibility/components/claims/)

The root [EligibilityDashboard.vue](src/views/eligibility/EligibilityDashboard.vue) component uses vue3's built-in `teleport` component to send the left and right panels into lower-level panels controlled by a separate component called [FlexHud](#flexhud), which exposes hooks to control collapse/expand events for each panel.

[People](src/views/eligibility/components/people/), [History](src/views/eligibility/components/history/), and [Claims](src/views/eligibility/components/claims/) are pretty straightforward single page application component trees. They use a shared `pinia` store to communicate app-level state changes, called with `useEligibilityStore`.

### Canvas Timeline
The most complex component in the tree (by a wide margin) is the [Timeline](src/views/eligibility/components/history/Timeline.vue). It honestly needs to be cleaned up to meet my standards. There are definitely aspects of it that are rushed.

This particular graph is _highly_ custom, so I opted for generating it with an HTML `canvas`. d3 was an option, but I didn't use it for the following reasons:
- Adds overhead to the SPA's filesize (typically not a concern if hosted elsewhere. Repeat users will have it cached. My site guests aren't typically repeat visitors.)
- d3 is historically geared toward SVG, which isn't as well optimized as canvas.
  - d3 AND canvas is an option, but I haven't explored it yet.
- I'm not sure that d3 would have actually reduced any complexity in this particular graph.

The most interesting tradeoff (imo) is the different state flows you can achieve between d3 + vue, compared to plain vue.
- d3 + vue:
  1. Plug data into d3 tools.
  2. d3 emits events as graphs animate.
  3. Vue listens to those events to update its data state.
- vue + plain canvas:
  1. Vue controls state mutation.
  2. Vue maps those to canvas animation frames.

### FlexHud
The [FlexHud](src/components/flexHud/FlexHud.vue) component is something I designed myself a couple years ago. I originally wrote it in vue 2. A side project to finish a generic, portable version in vue 3 is in progress.

This uses a fork of that in-progress flex-hud 3 version of it that I rapidly tidied up to finish this demo.

FlexHud features:
- Eliminates the need to carry header or side-panel positioning offsets anywhere else in your code.
- Encapsulates HUD animations and exposes hooks to control expand/collapse states.
- (Still a WIP) Is easy to convert into mobile-first or responsive designs.

## Notes on Scaling
An application like this would typically scale into the multiple 1,000s of claimants/claims. Several things would need attention to scale it:

### # of Claims
To handle more claims, the main strategies would be:
1. Bundle claims quarterly and/or annually into a single entry on the timeline.
  * The graph could be adapted to enable drilling down into annual, quarterly, monthly claim histories.
  * Alternatively, annual claims could be restricted to a separate view that is opened on clicking the bundled claim entry in the `claims` panel.
2. Reduce the amount of up-front data parsing/shaping that happens on page load.
  * Right now, it parses everything before it renders anything. This would have to go immediately to scale it up.
  * If each claimant has 100s or more claims, then parsing needs to happen asynchronously with a lazy loading strategy.
3. Add claim filtering:
  * Set some default filters. Let users have more granular control over them.
4. Add an aggregate claim view that bundles claims with similar scopes 
  * (same provider, same description, similar cost range, etc).
5. Tighten up the canvas file's performance.
  * Framerate demands can be improved by letting Vue control animation frames.  
6. Test for overhead on vue observables.
  * A huge concern in modern web frameworks, when excess data mutations trigger extra life-cycle/render events.
  * Mostly a concern in views with multi-directional state mutations. This app currently only has unidirectional state mutations:
    1. The selected claimant is changed
    2. The timeline renders & populates events
    3. Events mount & fade in as they're added.
      * The events array changes while renders are happening, but each event component is keyed such that it doesn't re-render existing events unnecessarily.
7. Low-level implementation optimizations.
  * This would be a distant concern after all the above concerns.
  * Current low-level implementations are already all `O(n)`. Driving down the size of `n` with filter/reduce/aggregation strategies will generally yield more results than trying to optimize further.


### # of Employees, Dependents, Retirees
1. Reduce the default list to just active employees.
  * Add filters to allow termed employees.
  * Add dependents as sub-components of employees that don't get parsed until the main employee is clicked.
  * Add tabs for Dependant/Retiree views that show dependants/retirees as the top level entries of the list.
    * DON'T add filters that pull dependants/retirees into the top-level employee list. Keep them in a separate tab/context.
  * **NOTE** Lots of this reduction should happen at the API level, whether by GraphQL or by rewriting REST endpoints.
2. Lazy load employees.
  * You can add paging, or just load them asynchronously after the first visible employees are renderable.
3. Reduce the amount of data parsing going into each employee. (See #2 in `claims` notes)
4. Mostly similar stategies as optimizing claims.
# Claire Merrell - Glorious Gumball Insurance Eligibility Dashboard
A demo applet that matches mock employees, retirees, and their dependents to an insurance eligibility timeline graph. Started 9/17/23, finished 9/19/23.

### Stack
* Typescript
* Vue 3
* Pinia (vue 3 state management)
* Vite (bundler & SPA server)
* Vue router
* Node 20 & npm

**Link:** My notes on [Scaling](#notes-on-scaling) an app like this for larger, more complex data pulls. 

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

**Note** You might want to disable `Vetur` (vue 2) if you have it installed.

## Code Highlights
Here are some simple run-downs of the most significant portions of the code.

Most of it is in the [src/views/eligibility](src/views/eligibility) directory.

- [Data Layer](#data-layer)
- [Component Tree](#component-tree)
- [Canvas Timeline](#canvas-timeline)
- [FlexHud](#flexhud)

### Data Layer
My root view component `src/views/eligbility/EligibilityDashboard.vue`(src/views/eligibility/EligibilityDashboard.vue) makes a call with the native JS `fetch` api to simulate querying the data set. Since I didn't have an endpoint to query against, I had it query the file out of my applets own public folder:
- [src/views/eligibility/data/parseClaimants.ts](src/views/eligibility/data/parseClaimants.ts)

This takes each claimant record from the fetched json array and constructs a javascript class `Claimant` out of it:
- [src/views/eligibility/model/Claimant.ts](src/views/eligibility/model/Claimant.ts)

The Claimant class uses several other types and classes within the same `model` folder to shape the retrieved data into something easier to use in the view's component tree.

**Note:** For readability, I wanted to use javascript array methods (e.g. - `reduce`, `map`, `filter`), but `Array.forEach` allowed me to do similar data reduction in `O(n)` compared to more readable algorithms that would run up to `O(3n)`. At small data sets, readability > performance, but this data can get big.

### Typescript
Everything is typed. Lots of it uses hooks that are new in vue 3 to leverage automatic type inference

### Component Tree
The component tree is broken into 3 main panels:
- [People](src/views/eligibility/components/people/)
- [History](src/views/eligibility/components/history/)
- [Claims](src/views/eligibility/components/claims/)

The root [EligibilityDashboard.vue](src/views/eligibility/EligibilityDashboard.vue) component uses vue3's built-in `teleport` component to send the left and right panels into lower-level panels controlled by a separate component called [FlexHud](#flexhud), which exposes hooks to control collapse/expand events for each panel.

[People](src/views/eligibility/components/people/), [History](src/views/eligibility/components/history/), and [Claims](src/views/eligibility/components/claims/) are pretty straightforward single page application component trees.

You'll see lots of components create a `store` object using an imported `useEligibilityStore` method. This method returns a singleton state management object, which lets components in different parts of the component tree communicate without having to ferry data up and down the tree.

### Canvas Timeline
The most complex component in the tree (by a wide margin) is the [Timeline](src/views/eligibility/components/history/Timeline.vue). It honestly needs to be cleaned up to meet my standards. There are definitely aspects of it that are rushed.

This particular graph is _highly_ custom, so I opted for generating it with the native HTML `canvas` tool. d3 was an option, but it has some drawbacks:
- Adds overhead to the SPA's filesize (though this is typically reduced by importing it from a source that will be cached)
- d3 is historically geared toward SVG, which isn't as well optimized as canvas. 
  - d3 AND canvas is an option, granted.
- I'm not sure that d3 would have actually reduced any complexity in this particular graph.

The historical strength of d3 is that it exposes hooks to the developer that update you when data changes. These can be useful, but Vue's data reactivity actually let me drive the animations in the opposite direction:

- d3 => Plug data into d3 tools => d3 emits events => vue listens to those events to update its data state.
- vue => makes its own data state mutations => maps those to canvas animation frames.

TL;DR - Long term, if we're doing tons of highly customized graphs, training up team members in d3 is definitely a priority. For one-off graphs, it's a heavy import with a big learning curve that, depending on the graph, may not actually simplify anything.

### FlexHud
The [FlexHud](src/components/flexHud/FlexHud.vue) component is something I designed myself a couple years ago. I originally wrote it in vue 2 at work. I had a half-implemented vue 3 version of it that I tried to rapidly finish while working on this. It's still got some issues, but for this scope it works. 

I'm working on making it fully portable as an open source tool.

It: 
- Eliminates the need to carry header or side-panel positioning offsets anywhere else in your code. 
- Encapsulates HUD animations and exposes hooks to control expand/collapse states.
- (Still a WIP in this vue3 version) is easy to convert into mobile-first or responsive designs.

## Notes on Scaling
Several things would need attention to scale this up:

### # of Claims
To handle more claims, the main strategies would be:
1. Bundle claims quarterly and/or annually into a single entry on the timeline.
  * The graph could be adapted to enable drilling down into annual, quarterly, monthly claim histories.
  * Alternatively, annual claims could be restricted to a separate view that is opened on clicking the bundled claim entry in the `claims` panel.
2. Reduce the amount of up-front data parsing/shaping that happens on page load.
  * Right now, it parses everything before it renders anything. This would have to go immediately to scale it up.
  * If each claimant has 100s or more claims, then parsing needs to happen asynchronously with lazy loading strategy.
3. Add claim filtering:
  * Set some default filters. Let users have more granular control over them.
4. Add an aggregate claim view that bundles claims with similar scopes 
  * (same provider, same description, similar cost range, etc).
5. Tighten up the canvas file's performance.
  * Framerate demands can be improved by letting Vue control animation frames.  
6. Test for overhead on vue observables.
  * This is a huge concern in modern web frameworks. Data mutations trigger extra life-cycle/render events. 
  * It probably isn't a likely performance hit on this particular graph, because most data is generated once and the only mutations changing are animations.
7. Tighten up parsing algorithms.
  * I already tightened them up, so they're not the biggest performance hindrance. Everything is generally O(n), so driving down the size of `n` will yield more results. This would be a distant concern after all the above concerns.


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
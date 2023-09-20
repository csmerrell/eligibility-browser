# Claire Merrell - Glorious Gumball Insurance Eligibility Dashboard
A demo applet that matches mock employees, retirees, and their dependents to an insurance eligibility timeline graph. Started 9/17/23, finished 9/19/23.

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
To install nvm if you don't have it (From [nvm source](https://github.com/nvm-sh/nvm)): 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

The rest of the package dependencies: (cd into the app's root directory)
```bash
npm install
```

Run the dev server
```bash
npm run dev
```

## Code Highlights
Here are some simple run-downs of the significant portions of the code.

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

### Component Tree
The component tree is broken into 3 main panels:
- [People](src/views/eligibility/components/people/)
- [History](src/views/eligibility/components/history/)
- [Claims](src/views/eligibility/components/claims/)

The root [EligibilityDashboard.vue](src/views/eligibility/EligibilityDashboard.vue) component uses vue3's built-in `teleport` component to send the left and right panels into lower-level panels controlled by a separate component called [FlexHud](src/components/flexHud/FlexHud.vue), which exposes hooks to control collapse/expand events for each panel.

[People](src/views/eligibility/components/people/), [History](src/views/eligibility/components/history/), and [Claims](src/views/eligibility/components/claims/) are pretty straightforward single page application component trees, with some exceptions.

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

TL;DR - Long term, if we're doing tons of highly customized graphs, training up team members in d3 is definitely a priority. For one-off graphs, it's a heavy import with a big learning curve that, depnding on the graph, may not actually simplify anything.

### FlexHud
The [FlexHud](src/components/flexHud/FlexHud.vue) component is something I designed myself a couple years ago. I originally wrote it in vue 2 at work. I had a half-implemented vue 3 version of it that I tried to rapidly finish while working on this. It's still got some issues, but for this scope it works. 

I'm working on making it fully portable as an open source tool.

It: 
- Eliminates the need to carry header or side-panel positioning offsets anywhere else in your code. 
- Encapsulates HUD animations and exposes hooks to control expand/collapse states.
- (Still a WIP in this vue3 version) is easy to convert into mobile-first or responsive designs.
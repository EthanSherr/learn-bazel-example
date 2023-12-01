# Cool!


## build
> bazel build ...

## 
> bazel test ...

## run
> bazel run projects/my_python_app



- [python py_binary, py_library, pip_parse](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=2)
- [last lesson](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=3)



## [10-29-2023] I've built rules_js js_binary, trying to figure out how to build js_run_binary
## [11-17-2023] i've got node-js-project running a binary but not yet npm modules

I'm stuck... I thought I should set it up like a pnpm-workspace just now, and i'm tyring to require("is-odd") in node-js-project/index.js and do a js_binary but when I build I see

```sh
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/node-js-project/BUILD.bazel:4:22: no such target '//:.aspect_rules_js/node_modules/is-odd@3.0.1': target '.aspect_rules_js/node_modules/is-odd@3.0.1' not declared in package '' defined by /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/BUILD.bazel and referenced by '//projects/node-js-project:node_modules/is-odd'
ERROR: Analysis of target '//projects/node-js-project:applib' failed; build aborted: 
INFO: Elapsed time: 0.093s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (2 packages loaded, 4 targets configured)
    currently loading: @go_sdk_toolchains//
```
trying to use :node_modules/is-odd as a dep of js_library... I'm sad


AH I resolved it... I needed to have a 
```py
load("@npm//:defs.bzl", "npm_link_all_packages")

npm_link_all_packages()
```
at the root.  This was an insanely useful read: 
[hackmd.io presentation on rules_js](https://hackmd.io/@aspect/rules_js?print-pdf#/)
[stack overflow answer overview by Toxaris](https://stackoverflow.com/questions/75445658/how-to-setup-a-bazel-workspace-with-rules-js-for-a-monorepo-with-multiple-pack)
x [docs](https://docs-legacy.aspect.build/aspect-build/rules_js/v1.0.0-rc.1/docs/npm_import-docgen.html)
[rules_nodejs readme.md](https://docs.aspect.build/rulesets/rules_nodejs)

I'm trying to figure out how to use "type": "module" ESM syntax in node-js-project/index.js
But do I really care?  I mean I'll be using typescript anyway.


## [2023-11-18]
[rules_ts docs](hthttps://docs.aspect.build/rulesets/aspect_rules_ts)
[rules_ts installation](https://github.com/aspect-build/rules_ts/releases)

### skipLibCheck, linked to tsconfig
```sh
######## Required Typecheck Performance Selection ########

TypeScript's type-checking exposes a flag `--skipLibCheck`:
https://www.typescriptlang.org/tsconfig#skipLibCheck

Using this flag saves substantial time during type-checking.
Rather than doing a full check of all d.ts files, TypeScript will only type-check the code you
specifically refer to in your app's source code.
We recommend this for most rules_ts users.

HOWEVER this performance improvement comes at the expense of type-system accuracy. 
For example, two packages could define two copies of the same type in an inconsistent way.
If you publish a library from your repository, your incorrect types may result in errors for your users.

You must choose exactly one of the following flags:

1. To choose the faster performance put this in /.bazelrc:

    # passes an argument `--skipLibCheck` to *every* spawn of tsc
    build --@aspect_rules_ts//ts:skipLibCheck=always
    fetch --@aspect_rules_ts//ts:skipLibCheck=always
    query --@aspect_rules_ts//ts:skipLibCheck=always

2. To choose more correct typechecks, put this in /.bazelrc:

    # honor the setting of `skipLibCheck` in the tsconfig.json file
    build --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    fetch --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    query --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
```

I've opted for 2.


### need to pick a transpiler

```sh
esherr@laptop-esherr01:~/personal/learn-bazel/multi-language-repo$ bazel build ...
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
INFO: Build option --@aspect_rules_ts//ts:skipLibCheck has changed, discarding analysis cache.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: in ts_project rule //projects/my-ts-project:something_something: 
Traceback (most recent call last):
        File "/home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_ts/ts/private/ts_project.bzl", line 230, column 21, in _ts_project_impl
                fail(transpiler_selection_required)
Error in fail: 
######## Required Transpiler Selection ########

You must select a transpiler for ts_project rules, which produces the .js outputs.

Please read https://docs.aspect.build/rules/aspect_rules_ts/docs/transpiler

##########################################################
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: Analysis of target '//projects/my-ts-project:something_something' failed
ERROR: Analysis of target '//projects/my-ts-project:something_something' failed; build aborted: 
INFO: Elapsed time: 0.478s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (0 packages loaded, 11177 targets configured)
```

[transpiling typescript to javascript](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/transpiler/)

```
The TypeScript compiler tsc can perform type-checking, transpilation to JavaScript, or both. Type-checking is typically slow, and is really only possible with TypeScript, not with alternative tools. Transpilation is mostly "erase the type syntax" and can be done well by a variety of tools.

ts_project allows us to split the work, with the following design goals:

The user should only need a single BUILD.bazel declaration: "these are my TypeScript sources and their dependencies".
Most developers have a working TypeScript Language Service in their editor, so they got type hinting before they ran bazel.
Development activities which rely only on runtime code, like running tests or manually verifying behavior in a devserver, should not need to wait on type-checking.
Type-checking still needs to be verified before checking in the code, but only needs to be as fast as a typical test.
Read more: https://blog.aspect.dev/typescript-speedup
```

all that was needed was including swc in the ts_project, and correctly linking the tsconfigs, then aligning some properties to match tsconfig settings.


more info
[aspect-rules-ts](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/rules)


Finally, I just learned I could use a ts_project as a dependency for a js_binary rule, and run it after compilation.  FUCK YES. 

[an exmaple of liba, libb underneath a ts root](https://github.com/aspect-build/rules_ts/blob/main/examples/project_references/lib_a/BUILD.bazel)

[an example of craco integration](https://github.com/bazelbuild/examples/blob/main/frontend/react/BUILD.bazel)

[maybe a better example of pnpm workspace bzl](https://github.com/aspect-build/bazel-examples/blob/main/pnpm-workspaces/apps/alpha/src/main.ts)



## [2023-11-19] swc & tsc

I was trying to use the swc compilation (with each project having a tsconfig extending a base tsconfig.)
The tsconfigs were building to commonjs - but when I ran my bazel build, outputs still had ESM syntax.  What's the deal?
The deal is swc doesn't automatically sync with tsconfig. [read about aspect_rules_ts docs transpiler choices](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/transpiler/).  SWC is recommended due to its speed - probably a good candidate when it comes to dev related things, but I don't think it does type checking saddly!  Running compilations with only SWC (not linked to tsconfigs) restuled in errors about "can't use module style import outside of module".  I feel I could've started putting package.json>type: module everywhere but instead I tried to figure out the root cause.  I saw that the .js files generated were ESM, although my tsconfig said commonjs, and went back to check my configurations.  I ended up adding  the following to my bazelrc

```
# Use "tsc" as the transpiler when ts_project has no `transpiler` set.
build --@aspect_rules_ts//ts:default_to_tsc_transpiler
fetch --@aspect_rules_ts//ts:default_to_tsc_transpiler
query --@aspect_rules_ts//ts:default_to_tsc_transpiler
```

and removed ts_project attribute: transpiler.



## [2023-11-23] react example

Well I got react working inside bazel, using the CRA example found here


I needed a reminder about js_run_devserver rule, which may require some additional config in the workspace - in order to link to a script... [check it out here](https://docs.aspect.build/rulesets/aspect_rules_js/docs/js_run_devserver/) it dsecribes the process of getting a bin entry point for your node modules that are cli's.

This is feeling pretty great!  But there's sort of a problem.  I'm not seeing updates in my frontend, and i'm seeing compilations like


```sh
> ibazel run //projects/react-project:start

Compiled successfully!

You can now view create-react-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.0.0.13:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Scratch'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Video'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Cache'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Log'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/archive'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/work'

```

[potentially good read](https://blog.engflow.com/2023/10/16/coding-in-the-fast-lane-with-ibazel/)


## [2023-11-24] trouble with ibazel

when I ran ibazel, i'd see 2 errors in .bazelrc - syntax errors from ibazel.  this was only true of ibazel, not of bazel run nor bazel build.
I referred to aspect_rules documentation, since that's the syntax error in the bazelrc, thought about providing this config another awy - but ultimately
I realized that my .bazelversion was 5.4.0, but the latest bazel is 6.4.0;  time to upgrade right?  After and upgrade the problem went away.

I'm still not clear if ibazel is provded by bazel cli.  I'm also a little confused because doing `which bazel` or `which ibazel` it'll point to `/bdi/rt/scripts/*`. 
However I'm starting to think that bazelisk helps me out here in this repo.  Running `bazel version` in this repo shows me versions corresponding to the .bazelversion.
running `bazel version` outside of this dir shows me the bazel version of $bdi

SO that's that!  bazelisk! :)  learn more about it eh?

Yay


[2023-11-30] pip rules (deps) aren't quite right
I'm on my mac on a fresh slate, I try to `bazel build ...` but there's an error
about missing "python_deps_*"
for the following python deps

```sh
importlib_metadata==6.8.0
zipp==3.17.0
```

I was a little confused at first and revisited python_rules documentation, I feel there's a rule like

```py
    load("@rules_python//python:pip.bzl", "compile_pip_requirements")
```

which may be used to pull in requirements, i'm not sure.  But what's weird is that these deps weren't pulled in from my first list.  Maybe I had those locally on my other comp?  argg!  That means the deps aren't really sealed.  unsure.  I added deps to my /third-party/requirements_lock.yaml but I feel there's something to be learned [here](https://github.com/bazelbuild/rules_python/blob/main/examples/pip_parse/BUILD.bazel)

Also reading in the docs there may be some hermetic issues [here](https://rules-python.readthedocs.io/en/latest/getting-started.html#using-a-workspace-file)

in all the confusion I made requirements.in but i'm not really using it.